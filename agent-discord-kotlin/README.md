# Switch AI Discord Bot (Kotlin & Firebase)

Complete, ready-to-run Discord Bot teammate built with **Kotlin Coroutines**, **Kord**, and **Google Cloud Firestore**.

## 1. Setup Instructions (3 Minutes)

### Step 1: Discord Developer Portal
1. Open [discord.com/developers/applications](https://discord.com/developers/applications) and click **New Application**.
2. Go to **Bot** tab:
   - Click **Reset Token** and copy your token.
   - Under **Privileged Gateway Intents**, enable:
     - [x] **Message Content Intent**
     - [x] **Server Members Intent**
3. Go to **OAuth2 -> URL Generator**:
   - Scopes: `bot`, `applications.commands`
   - Bot Permissions: `Send Messages`, `Read Message History`, `Embed Links`, `Use Slash Commands`
   - Copy the generated URL and paste it into your browser to invite the bot to your Discord server!

### Step 2: Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Paste your `DISCORD_BOT_TOKEN` into `.env`.

### Step 3: Run the Bot
Requires Java 17+ / Gradle:
```bash
# On Linux / macOS
./gradlew run

# On Windows
gradlew.bat run
```

---

## 2. Testing in Discord
In your Discord server:
- Type `!triage API timeout in payments worker`
- Or mention your bot: `@YourBot help with database deadlock`
- Watch the bot respond with:
  1. An issue diagnostic embed with category `[Bug]`.
  2. Suggested minimal Kotlin patch.
  3. Interactive green **[Approve & Execute]** and red **[Reject]** buttons.
- Click **[Approve & Execute]** — the bot logs the human approval and acknowledges deployment!
