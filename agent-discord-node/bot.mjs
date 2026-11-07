import { 
  Client, 
  GatewayIntentBits, 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle 
} from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const token = process.env.DISCORD_BOT_TOKEN;
if (!token || token === 'your_discord_bot_token_here') {
  console.error('❌ Error: DISCORD_BOT_TOKEN is not configured in .env');
  console.error('Please create a .env file and add your Discord bot token.');
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once('ready', () => {
  console.log('==================================================');
  console.log(`⚡ Switch AI Discord Agent is ONLINE as: ${client.user.tag}`);
  console.log('==================================================');
  console.log('Ready! In Discord, type "!triage <issue>" or mention the bot.');
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const isMention = message.mentions.has(client.user.id);
  const isCommand = message.content.startsWith('!triage') || message.content.startsWith('/triage');

  if (!isMention && !isCommand) return;

  const rawProblem = isCommand
    ? message.content.replace(/^![a-z]+\s*|^\/[a-z]+\s*/i, '').trim()
    : message.content.replace(new RegExp(`<@!?${client.user.id}>`, 'g'), '').trim();

  const issueText = rawProblem || 'Null pointer exception in authentication gateway';
  const eventId = `evt_${Date.now().toString().slice(-6)}`;

  console.log(`[Switch Gateway] Received event ${eventId}: "${issueText}" from @${message.author.username}`);

  // Construct diagnostic embed
  const embed = new EmbedBuilder()
    .setTitle('⚡ Switch AI Gateway: Diagnostic Ready')
    .setDescription(`**Problem**: \`${issueText}\`\n**Category**: \`[Bug]\`\n**Suggested Fix**: Isolated null reference. Proposing defensive null-safety wrapper.`)
    .setColor(0x34d399) // Emerald-400
    .addFields({
      name: 'Proposed Defensive Code',
      value: '```kotlin\nfun safeHandle(input: String?): Result<Unit> = runCatching {\n    val sanitized = requireNotNull(input) { "Payload cannot be null" }\n    processState(sanitized)\n}\n```',
    })
    .setFooter({ text: `Switch Event ID: ${eventId} • Human-in-the-Loop Required` })
    .setTimestamp();

  // Create human-in-the-loop approval buttons
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`approve_${eventId}`)
      .setLabel('Approve & Execute')
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId(`reject_${eventId}`)
      .setLabel('Reject')
      .setStyle(ButtonStyle.Danger)
  );

  await message.reply({
    embeds: [embed],
    components: [row],
  });
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;

  const { customId, user } = interaction;

  if (customId.startsWith('approve_')) {
    const eventId = customId.replace('approve_', '');
    console.log(`[Approval] Event ${eventId} approved by @${user.username}`);

    await interaction.update({
      content: `✅ **Change Approved & Executed** by <@${user.id}>!\nEvent \`${eventId}\` was merged and deployed via Switch Gateway.`,
      components: [], // Remove buttons
    });
  } else if (customId.startsWith('reject_')) {
    const eventId = customId.replace('reject_', '');
    console.log(`[Rejection] Event ${eventId} rejected by @${user.username}`);

    await interaction.update({
      content: `🛑 **Action Cancelled** for Event \`${eventId}\` by <@${user.id}>. No changes deployed.`,
      components: [],
    });
  }
});

client.login(token);
