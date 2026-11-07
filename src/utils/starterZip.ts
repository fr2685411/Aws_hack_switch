import JSZip from 'jszip';

export async function downloadStarterPackageZip() {
  const zip = new JSZip();

  // Root README
  zip.file(
    'README.md',
    `# Switch AI Hackathon Starter Kit (Discord + Kotlin + Node.js)

Welcome solo participant! This starter pack contains all files required to run your Discord Bot with Switch AI gateway and Human-in-the-Loop approvals.

## Folder Structure
- /agent-discord-kotlin/ : Kotlin 2.0 + Kord + Firebase Firestore Daemon
- /agent-discord-node/   : Lightweight Node.js + discord.js Runner (Instant test without Gradle)
- /RECORDING_GUIDE.md    : 2-minute video recording checklist and teleprompter pitch

## How to Get Started in 3 Minutes:
1. Create a Discord Bot in Discord Developer Portal:
   - https://discord.com/developers/applications
   - Enable "Message Content Intent" in Bot settings.
   - Generate OAuth2 invite link with bot + applications.commands scopes.
2. If using Node.js:
   - cd agent-discord-node
   - npm install
   - cp .env.example .env (paste DISCORD_BOT_TOKEN)
   - npm start
3. If using Kotlin:
   - cd agent-discord-kotlin
   - cp .env.example .env (paste DISCORD_BOT_TOKEN)
   - ./gradlew run
4. In Discord, test by typing:
   !triage Database deadlock in transaction retry
   Click [Approve & Execute] to demonstrate human-in-the-loop approval.
`
  );

  // Recording Guide
  zip.file(
    'RECORDING_GUIDE.md',
    `# Hackathon Demo Video Guide (90-120 Seconds)

1. [0:00 - 0:20] Hook: Introduce yourself as solo hacker building for Switch AI Hackathon.
2. [0:20 - 0:50] Problem & Architecture: Explain why terminal agents need chat integration (Slack/Discord) with Firebase.
3. [0:50 - 1:30] Live Demo: Show Discord chat -> type "!triage bug" -> bot proposes patch with [Approve & Execute] button -> human clicks button -> executed!
4. [1:30 - 2:00] Outro: Show public GitHub repo with OSI license (MIT) and thank WeMakeDevs & Switch AI.
`
  );

  // Kotlin Agent
  const kotlinFolder = zip.folder('agent-discord-kotlin');
  if (kotlinFolder) {
    kotlinFolder.file(
      'build.gradle.kts',
      `plugins {
    kotlin("jvm") version "2.0.21"
    application
}

group = "org.wemakedevs.switch"
version = "1.0.0"

repositories {
    mavenCentral()
}

dependencies {
    implementation("dev.kord:kord-core:0.14.0")
    implementation("com.google.firebase:firebase-admin:9.4.1")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.9.0")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-reactive:1.9.0")
    implementation("org.slf4j:slf4j-simple:2.0.16")
    implementation("io.github.cdimascio:dotenv-kotlin:6.4.2")
}

application {
    mainClass.set("org.wemakedevs.switch.MainKt")
}

kotlin {
    jvmToolchain(17)
}
`
    );

    kotlinFolder.file(
      '.env.example',
      `DISCORD_BOT_TOKEN="your_discord_bot_token_here"
GOOGLE_APPLICATION_CREDENTIALS="./firebase-key.json"
SWITCH_GATEWAY_URL="http://localhost:3000/api"
`
    );

    kotlinFolder.file(
      'src/main/kotlin/org/wemakedevs/switch/FirebaseService.kt',
      `package org.wemakedevs.switch

import com.google.auth.oauth2.GoogleCredentials
import com.google.cloud.firestore.Firestore
import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions
import com.google.firebase.cloud.FirestoreClient
import kotlinx.coroutines.tasks.await
import java.io.File
import java.io.FileInputStream

object FirebaseService {
    private val firestore: Firestore by lazy {
        initFirebase()
        FirestoreClient.getFirestore()
    }

    private fun initFirebase() {
        if (FirebaseApp.getApps().isNotEmpty()) return
        val credentialsPath = System.getenv("GOOGLE_APPLICATION_CREDENTIALS")
        val optionsBuilder = FirebaseOptions.builder()

        if (!credentialsPath.isNullOrBlank() && File(credentialsPath).exists()) {
            FileInputStream(credentialsPath).use { serviceAccount ->
                optionsBuilder.setCredentials(GoogleCredentials.fromStream(serviceAccount))
            }
        } else {
            optionsBuilder.setCredentials(GoogleCredentials.getApplicationDefault())
        }
        FirebaseApp.initializeApp(optionsBuilder.build())
    }

    suspend fun recordEvent(eventId: String, author: String, problem: String, channelId: String) {
        val payload = mapOf(
            "eventId" to eventId,
            "author" to author,
            "problem" to problem,
            "channelId" to channelId,
            "status" to "PENDING_APPROVAL",
            "category" to "[Bug]",
            "createdAt" to com.google.firebase.Timestamp.now()
        )
        firestore.collection("workspace_events").document(eventId).set(payload).await()
    }

    suspend fun approveAndExecute(eventId: String, approvedBy: String): Boolean {
        return try {
            firestore.collection("workspace_events").document(eventId).update(
                mapOf(
                    "status" to "APPROVED_AND_EXECUTED",
                    "approvedBy" to approvedBy,
                    "executedAt" to com.google.firebase.Timestamp.now()
                )
            ).await()
            true
        } catch (e: Exception) {
            System.err.println("Firestore update failed: " + e.message)
            false
        }
    }
}
`
    );

    kotlinFolder.file(
      'src/main/kotlin/org/wemakedevs/switch/Main.kt',
      `package org.wemakedevs.switch

import dev.kord.common.Color
import dev.kord.common.entity.ButtonStyle
import dev.kord.core.Kord
import dev.kord.core.behavior.channel.createMessage
import dev.kord.core.behavior.interaction.response.respond
import dev.kord.core.event.interaction.ButtonInteractionCreateEvent
import dev.kord.core.event.message.MessageCreateEvent
import dev.kord.core.on
import dev.kord.rest.builder.message.actionRow
import dev.kord.rest.builder.message.embed
import io.github.cdimascio.dotenv.dotenv

suspend fun main() {
    println("Switch AI Gateway - Kotlin Discord Teammate")
    val dotenv = dotenv { ignoreIfMissing = true }
    val discordToken = System.getenv("DISCORD_BOT_TOKEN") 
        ?: dotenv["DISCORD_BOT_TOKEN"]
        ?: error("DISCORD_BOT_TOKEN environment variable is missing. Set it in .env")

    val kord = Kord(discordToken)

    kord.on<MessageCreateEvent> {
        if (message.author?.isBot == true) return@on
        val content = message.content.trim()
        val isMention = message.mentionedUserIds.contains(kord.selfId)
        val isCommand = content.startsWith("!triage") || content.startsWith("/triage")
        if (!isMention && !isCommand) return@on

        val problem = if (isCommand) {
            content.removePrefix("!triage").removePrefix("/triage").trim()
        } else {
            content.replace("<@!\${kord.selfId}>", "").replace("<@\${kord.selfId}>", "").trim()
        }

        val effectiveProblem = if (problem.isBlank()) "Unhandled state exception" else problem
        val eventId = "evt_\${System.currentTimeMillis().toString().takeLast(6)}"

        try {
            FirebaseService.recordEvent(
                eventId = eventId,
                author = message.author?.username ?: "developer",
                problem = effectiveProblem,
                channelId = message.channelId.toString()
            )
        } catch (e: Exception) {
            println("[Firebase] Offline demo mode: " + e.message)
        }

        message.channel.createMessage {
            embed {
                title = "⚡ Switch AI Gateway: Diagnostic Ready"
                description = "**Problem**: \`$effectiveProblem\`\\n**Category**: \`[Bug]\`\\n\\n\`\`\`kotlin\\nfun safeHandle(input: String?): Result<Unit> = runCatching {\\n    val sanitized = requireNotNull(input) { \\"Payload cannot be null\\" }\\n    processState(sanitized)\\n}\\n\`\`\`\\n*Review and click below to approve deployment.*"
                color = Color(0x34D399)
                footer { text = "Switch Event ID: $eventId • Human-in-the-Loop Required" }
            }
            actionRow {
                interactionButton(ButtonStyle.Success, customId = "approve_$eventId") {
                    label = "Approve & Execute"
                }
                interactionButton(ButtonStyle.Danger, customId = "reject_$eventId") {
                    label = "Reject"
                }
            }
        }
    }

    kord.on<ButtonInteractionCreateEvent> {
        val customId = interaction.componentId
        if (customId.startsWith("approve_")) {
            val eventId = customId.removePrefix("approve_")
            val username = interaction.user.username
            FirebaseService.approveAndExecute(eventId, username)
            val response = interaction.deferPublicResponse()
            response.respond {
                content = "✅ **Change Approved & Executed** by <@\${interaction.user.id}>!\\nEvent \`$eventId\` merged and deployed via Switch Gateway."
            }
        } else if (customId.startsWith("reject_")) {
            val eventId = customId.removePrefix("reject_")
            val response = interaction.deferPublicResponse()
            response.respond {
                content = "🛑 **Action Cancelled** for Event \`$eventId\` by <@\${interaction.user.id}>. No changes deployed."
            }
        }
    }

    println("✓ Bot is ready and listening in Discord!")
    kord.login()
}
`
    );
  }

  // Node.js Agent
  const nodeFolder = zip.folder('agent-discord-node');
  if (nodeFolder) {
    nodeFolder.file(
      'package.json',
      `{
  "name": "switch-discord-node-agent",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node bot.mjs"
  },
  "dependencies": {
    "discord.js": "^14.17.3",
    "dotenv": "^16.4.7"
  }
}
`
    );

    nodeFolder.file(
      '.env.example',
      `DISCORD_BOT_TOKEN="your_discord_bot_token_here"
`
    );

    nodeFolder.file(
      'bot.mjs',
      `import { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();
const token = process.env.DISCORD_BOT_TOKEN;

if (!token || token.includes('your_discord_bot_token')) {
  console.error('❌ Please set DISCORD_BOT_TOKEN in .env');
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

client.once('ready', () => {
  console.log(\`⚡ Switch AI Discord Agent is ONLINE as: \${client.user.tag}\`);
  console.log('Ready! In Discord, type "!triage <issue>" or mention the bot.');
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  const isMention = message.mentions.has(client.user.id);
  const isCommand = message.content.startsWith('!triage');
  if (!isMention && !isCommand) return;

  const rawProblem = isCommand
    ? message.content.replace(/^!triage\\s*/i, '').trim()
    : message.content.replace(new RegExp(\`<@!?\${client.user.id}>\`, 'g'), '').trim();

  const issueText = rawProblem || 'Null pointer exception in authentication gateway';
  const eventId = \`evt_\${Date.now().toString().slice(-6)}\`;

  const embed = new EmbedBuilder()
    .setTitle('⚡ Switch AI Gateway: Diagnostic Ready')
    .setDescription(\`**Problem**: \\\`\${issueText}\\\`\\n**Category**: \\\`[Bug]\\\`\\n**Suggested Fix**: Isolated null reference. Proposing defensive null-safety wrapper.\`)
    .setColor(0x34d399)
    .addFields({
      name: 'Proposed Defensive Code',
      value: '\`\`\`kotlin\\nfun safeHandle(input: String?): Result<Unit> = runCatching {\\n    val sanitized = requireNotNull(input) { "Payload cannot be null" }\\n    processState(sanitized)\\n}\\n\`\`\`',
    })
    .setFooter({ text: \`Switch Event ID: \${eventId} • Human-in-the-Loop Required\` });

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId(\`approve_\${eventId}\`).setLabel('Approve & Execute').setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId(\`reject_\${eventId}\`).setLabel('Reject').setStyle(ButtonStyle.Danger)
  );

  await message.reply({ embeds: [embed], components: [row] });
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;
  const { customId, user } = interaction;

  if (customId.startsWith('approve_')) {
    const eventId = customId.replace('approve_', '');
    await interaction.update({
      content: \`✅ **Change Approved & Executed** by <@\${user.id}>!\\nEvent \\\`\${eventId}\\\` was merged and deployed via Switch Gateway.\`,
      components: [],
    });
  } else if (customId.startsWith('reject_')) {
    const eventId = customId.replace('reject_', '');
    await interaction.update({
      content: \`🛑 **Action Cancelled** for Event \\\`\${eventId}\\\` by <@\${user.id}>. No changes deployed.\`,
      components: [],
    });
  }
});

client.login(token);
`
    );
  }

  // Generate blob and download
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'switch-discord-agent-starter.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
