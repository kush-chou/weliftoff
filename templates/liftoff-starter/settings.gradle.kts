pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        if (providers.gradleProperty("useSubnetMirror").orNull == "true") {
            maven { url = uri("http://192.168.1.254:8081/maven") }
        }
        google()
        mavenCentral()
    }
}
rootProject.name = "liftoff-starter"
include(":app")
