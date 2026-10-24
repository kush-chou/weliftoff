import java.util.Properties
import java.time.Instant

plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.ksp)
    alias(libs.plugins.play.publisher)
}

val crewProps = Properties().apply {
    val propFile = rootProject.file("crew.properties")
    if (propFile.exists()) {
        propFile.inputStream().use { load(it) }
    }
}

val rawSlug = crewProps.getProperty("team.slug", "template")
val sanitizedSlug = rawSlug.replace('-', '_').filter { it.isLetterOrDigit() || it == '_' }

android {
    namespace = "ai.substrata.liftoff"
    compileSdk = 35

    defaultConfig {
        applicationId = "ai.substrata.liftoff.$sanitizedSlug"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"

        val gitSha = try {
            providers.exec {
                commandLine("git", "rev-parse", "--short", "HEAD")
            }.standardOutput.asText.get().trim()
        } catch (_: Exception) {
            "uncommitted"
        }

        buildConfigField("String", "GIT_COMMIT_SHA", "\"$gitSha\"")
        buildConfigField("String", "STUDENT_HANDLES", "\"${crewProps.getProperty("student.handles", "unassigned")}\"")
        buildConfigField("String", "BUILD_TIMESTAMP", "\"${Instant.now()}\"")
        buildConfigField("String", "LICENSE", "\"Apache-2.0\"")
    }

    signingConfigs {
        create("release") {
            val keystorePath = providers.environmentVariable("RELEASE_KEYSTORE_PATH").orNull
            if (!keystorePath.isNullOrBlank() && file(keystorePath).exists()) {
                storeFile = file(keystorePath)
                storePassword = providers.environmentVariable("KEYSTORE_PASSWORD").get()
                keyAlias = providers.environmentVariable("KEY_ALIAS").get()
                keyPassword = providers.environmentVariable("KEY_PASSWORD").get()
            }
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
            val releaseSigning = signingConfigs.getByName("release")
            signingConfig = if (releaseSigning.storeFile != null) releaseSigning else signingConfigs.getByName("debug")
        }
    }

    buildFeatures {
        compose = true
        buildConfig = true
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }
}

ksp {
    arg("room.schemaLocation", "$projectDir/schemas")
}

play {
    defaultToAppBundles.set(true)
    val saJson = providers.environmentVariable("PLAY_SERVICE_ACCOUNT_JSON").orNull
    if (!saJson.isNullOrBlank()) {
        serviceAccountCredentials.set(file(saJson))
    }
}

dependencies {
    val composeBom = platform(libs.compose.bom)
    implementation(composeBom)
    implementation(libs.compose.ui)
    implementation(libs.compose.ui.graphics)
    implementation(libs.compose.ui.tooling.preview)
    implementation(libs.compose.material3)
    implementation(libs.activity.compose)
    implementation(libs.room.runtime)
    implementation(libs.room.ktx)
    ksp(libs.room.compiler)
    testImplementation(libs.junit)
}

val verifyZeroEgress by tasks.registering {
    dependsOn("processDebugMainManifest", "processReleaseMainManifest")
    doLast {
        val variants = listOf("debug", "release")
        variants.forEach { variant ->
            val variantCap = variant.replaceFirstChar { if (it.isLowerCase()) it.titlecase() else it.toString() }
            val candidates = listOf(
                layout.buildDirectory.file("intermediates/merged_manifest/$variant/process${variantCap}MainManifest/AndroidManifest.xml").get().asFile,
                layout.buildDirectory.file("intermediates/merged_manifest/$variant/process${variantCap}Manifest/AndroidManifest.xml").get().asFile,
                layout.buildDirectory.file("intermediates/merged_manifests/$variant/AndroidManifest.xml").get().asFile,
                layout.buildDirectory.file("intermediates/merged_manifest/$variant/AndroidManifest.xml").get().asFile
            )
            val manifest = candidates.firstOrNull { it.exists() }
                ?: throw GradleException("Zero-Egress Audit Failed: Merged manifest not found for variant '$variant'. Candidates checked: ${candidates.map { it.path }}")
            if (manifest.readText().contains("android.permission.INTERNET")) {
                throw GradleException("Zero-Egress Invariant Violated: android.permission.INTERNET detected in ${manifest.absolutePath}")
            }
        }
    }
}

tasks.named("check") { dependsOn(verifyZeroEgress) }
