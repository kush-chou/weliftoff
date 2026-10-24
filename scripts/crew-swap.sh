#!/usr/bin/env bash
set -euo pipefail

CREW_PROPS="crew.properties"
if [ ! -f "$CREW_PROPS" ] && [ -f "templates/liftoff-starter/crew.properties" ]; then
    CREW_PROPS="templates/liftoff-starter/crew.properties"
fi

if [ ! -f "$CREW_PROPS" ]; then
    echo "Error: crew.properties not found." >&2
    exit 1
fi

CURRENT_LEAD=$(git config user.name || echo "")
HANDLES=$(grep "student.handles" "$CREW_PROPS" | cut -d'=' -f2 | tr -d ' ')
HANDLE_A=$(echo "$HANDLES" | cut -d',' -f1)
HANDLE_B=$(echo "$HANDLES" | cut -d',' -f2)

if [ "$CURRENT_LEAD" == "$HANDLE_A" ]; then
    NEW_LEAD="$HANDLE_B"
    NEW_AUDITOR="$HANDLE_A"
else
    NEW_LEAD="$HANDLE_A"
    NEW_AUDITOR="$HANDLE_B"
fi

git config user.name "$NEW_LEAD"
git config user.email "$NEW_LEAD@users.noreply.github.com"

mkdir -p .git
cat <<EOF > .git/.commit-template
<type>(<scope>): <summary>

Agent: antigravity
Model: gemini-2.5-pro
Prompted-by: $NEW_LEAD <$NEW_LEAD@users.noreply.github.com>
Audited-by: $NEW_AUDITOR <$NEW_AUDITOR@users.noreply.github.com>
Co-authored-by: $NEW_LEAD <$NEW_LEAD@users.noreply.github.com>
Co-authored-by: $NEW_AUDITOR <$NEW_AUDITOR@users.noreply.github.com>
Co-authored-by: Antigravity <antigravity@google.com>
EOF

git config commit.template .git/.commit-template
echo "Swapped seat: Lead Architect is now $NEW_LEAD, Systems Auditor is $NEW_AUDITOR."
