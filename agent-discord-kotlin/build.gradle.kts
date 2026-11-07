plugins {
    kotlin("jvm") version "2.0.21"
    application
}

group = "org.wemakedevs.switch"
version = "1.0.0"

repositories {
    mavenCentral()
}

dependencies {
    // Discord Gateway & UI Library (Kord)
    implementation("dev.kord:kord-core:0.14.0")

    // Google Cloud Firestore & Firebase Admin SDK
    implementation("com.google.firebase:firebase-admin:9.4.1")

    // Kotlin Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.9.0")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-reactive:1.9.0")

    // SLF4J Logger
    implementation("org.slf4j:slf4j-simple:2.0.16")

    // Dotenv for environment variables
    implementation("io.github.cdimascio:dotenv-kotlin:6.4.2")
}

application {
    mainClass.set("org.wemakedevs.switch.MainKt")
}

kotlin {
    jvmToolchain(17)
}
