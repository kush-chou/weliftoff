$ErrorActionPreference = "Stop"
$usb = (Get-Volume -FileSystemLabel "LIFTOFF_USB" -ErrorAction SilentlyContinue).DriveLetter
$usbRoot = if ($usb) { "${usb}:" } else { Split-Path -Parent $PSScriptRoot }

$targetDir = "$HOME\.liftoff\toolchain"
New-Item -ItemType Directory -Force -Path "$targetDir\bin", "$targetDir\jdk-17", "$targetDir\android-sdk" | Out-Null

if (Test-Path "$usbRoot\toolchain\jdk-17.zip") {
    Expand-Archive -Path "$usbRoot\toolchain\jdk-17.zip" -DestinationPath "$targetDir\jdk-17" -Force
}
if (Test-Path "$usbRoot\toolchain\android-sdk.zip") {
    Expand-Archive -Path "$usbRoot\toolchain\android-sdk.zip" -DestinationPath "$targetDir\android-sdk" -Force
}
if (Test-Path "$usbRoot\toolchain\bin") {
    Copy-Item -Path "$usbRoot\toolchain\bin\*" -Destination "$targetDir\bin" -Recurse -Force
}

$gradleDir = "$HOME\.gradle"
New-Item -ItemType Directory -Force -Path "$gradleDir\wrapper\dists", "$gradleDir\caches\modules-2" | Out-Null
if (Test-Path "$usbRoot\gradle-seed\dists") {
    Copy-Item -Path "$usbRoot\gradle-seed\dists\*" -Destination "$gradleDir\wrapper\dists" -Recurse -Force
}
if (Test-Path "$usbRoot\gradle-seed\modules-2") {
    Copy-Item -Path "$usbRoot\gradle-seed\modules-2\*" -Destination "$gradleDir\caches\modules-2" -Recurse -Force
}

[Environment]::SetEnvironmentVariable("JAVA_HOME", "$targetDir\jdk-17", "User")
[Environment]::SetEnvironmentVariable("ANDROID_HOME", "$targetDir\android-sdk", "User")

$currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($currentPath -notlike "*$targetDir\bin*") {
    [Environment]::SetEnvironmentVariable("Path", "$targetDir\bin;$targetDir\android-sdk\platform-tools;$currentPath", "User")
}

Write-Host "Environment Zero provisioned successfully."
