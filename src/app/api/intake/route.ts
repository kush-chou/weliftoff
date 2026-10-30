import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface CrewPayload {
  studentName: string;
  schoolOrCity: string;
  grade: string;
  coFounder?: string;
  parentWhatsApp: string;
  notes?: string;
}

interface InstitutionalPayload {
  name: string;
  role: string;
  institution: string;
  email: string;
  notes?: string;
}

interface IntakeRequest {
  mode: "crew" | "institutional";
  cohortWindow: string;
  data: CrewPayload | InstitutionalPayload;
}

export async function POST(request: Request) {
  try {
    const body: IntakeRequest = await request.json();
    const { mode, cohortWindow, data } = body;

    if (!mode || !cohortWindow || !data) {
      return NextResponse.json(
        { error: "Invalid request payload: missing required fields" },
        { status: 400 }
      );
    }

    if (mode === "crew") {
      const crew = data as CrewPayload;
      if (!crew.studentName?.trim() || !crew.schoolOrCity?.trim() || !crew.grade?.trim() || !crew.parentWhatsApp?.trim()) {
        return NextResponse.json(
          { error: "Missing required founder crew fields" },
          { status: 422 }
        );
      }
    } else if (mode === "institutional") {
      const inst = data as InstitutionalPayload;
      if (!inst.name?.trim() || !inst.role?.trim() || !inst.institution?.trim() || !inst.email?.trim()) {
        return NextResponse.json(
          { error: "Missing required institutional fields" },
          { status: 422 }
        );
      }
    } else {
      return NextResponse.json({ error: "Unsupported intake mode" }, { status: 400 });
    }

    const applicationId = `WL-${Date.now().toString(36).toUpperCase()}`;
    const submissionRecord = {
      id: applicationId,
      timestamp: new Date().toISOString(),
      mode,
      cohortWindow,
      data,
    };

    // Resilient local file persistence (fails gracefully in read-only environments)
    try {
      const logDir = path.join(process.cwd(), ".data");
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }
      const logFile = path.join(logDir, "intake_submissions.jsonl");
      fs.appendFileSync(logFile, JSON.stringify(submissionRecord) + "\n", "utf8");
    } catch {
      // Gracefully continue even in serverless environments where local disk may be ephemeral
      console.log("[INTAKE] Received submission:", JSON.stringify(submissionRecord));
    }

    return NextResponse.json({
      success: true,
      id: applicationId,
      message: "Application registered successfully",
    });
  } catch (error) {
    console.error("[INTAKE_ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error processing intake registration" },
      { status: 500 }
    );
  }
}
