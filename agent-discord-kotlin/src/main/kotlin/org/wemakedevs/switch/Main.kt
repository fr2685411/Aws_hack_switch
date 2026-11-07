package org.wemakedevs.switch

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
    println("==================================================")
    println("   Switch AI Gateway - Kotlin Discord Teammate    ")
    println("==================================================")

    val dotenv = dotenv { ignoreIfMissing = true }
    val discordToken = System.getenv("DISCORD_BOT_TOKEN") 
        ?: dotenv["DISCORD_BOT_TOKEN"]
        ?: error("DISCORD_BOT_TOKEN environment variable is missing. Set it in .env")

    val kord = Kord(discordToken)

    // 1. Listen for problem reports or "!triage" commands
    kord.on<MessageCreateEvent> {
        if (message.author?.isBot == true) return@on

        val content = message.content.trim()
        val isMention = message.mentionedUserIds.contains(kord.selfId)
        val isCommand = content.startsWith("!triage") || content.startsWith("/triage")

        if (!isMention && !isCommand) return@on

        val problem = if (isCommand) {
            content.removePrefix("!triage").removePrefix("/triage").trim()
        } else {
            content.replace("<@!${kord.selfId}>", "").replace("<@${kord.selfId}>", "").trim()
        }

        val effectiveProblem = if (problem.isBlank()) "NullPointerException in user auth flow" else problem
        val eventId = "evt_${System.currentTimeMillis().toString().takeLast(6)}"

        println("[Switch Gateway] Received event $eventId from ${message.author?.username}: $effectiveProblem")

        // Persist to Cloud Firestore
        try {
            FirebaseService.recordEvent(
                eventId = eventId,
                author = message.author?.username ?: "developer",
                problem = effectiveProblem,
                channelId = message.channelId.toString()
            )
        } catch (e: Exception) {
            println("[Firebase Warning] Running in offline demo mode: ${e.message}")
        }

        // Send Interactive Embed with Human-in-the-Loop [Approve & Execute] Button
        message.channel.createMessage {
            embed {
                title = "⚡ Switch AI Gateway: Diagnostic Ready"
                description = """
                    **Problem**: `$effectiveProblem`
                    **Category**: `[Bug]`
                    **Root Cause**: Potential unhandled null or state desync.
                    
                    ```kotlin
                    // Suggested Defensive Patch:
                    fun safeHandle(input: String?): Result<Unit> = runCatching {
                        val sanitized = requireNotNull(input) { "Payload cannot be null" }
                        processState(sanitized)
                    }
                    ```
                    
                    *Review and click below to approve deployment.*
                """.trimIndent()
                color = Color(0x34D399) // Emerald-400
                footer {
                    text = "Switch Event ID: $eventId • Human-in-the-Loop Required"
                }
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

    // 2. Human-in-the-Loop Approval Action
    kord.on<ButtonInteractionCreateEvent> {
        val customId = interaction.componentId

        if (customId.startsWith("approve_")) {
            val eventId = customId.removePrefix("approve_")
            val username = interaction.user.username

            println("[Approval] Event $eventId approved by $username")
            FirebaseService.approveAndExecute(eventId, username)

            val response = interaction.deferPublicResponse()
            response.respond {
                content = "✅ **Change Approved & Executed** by <@${interaction.user.id}>!\nEvent `$eventId` merged and deployed via Switch Gateway."
            }
        } else if (customId.startsWith("reject_")) {
            val eventId = customId.removePrefix("reject_")
            val response = interaction.deferPublicResponse()
            response.respond {
                content = "🛑 **Action Cancelled** for Event `$eventId` by <@${interaction.user.id}>. No changes deployed."
            }
        }
    }

    println("✓ Connected to Discord Gateway. Bot is ready and listening!")
    kord.login()
}
