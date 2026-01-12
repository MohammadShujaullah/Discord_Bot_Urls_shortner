 
import { Client, Events, GatewayIntentBits } from 'discord.js';
import "dotenv/config";
import { connectDB } from './database.js';
import { 
    handleGenerateShortURL, 
    handleVisitThroughShortURL,
    handleGetURLAnalytics 
} from './controllers/urlController.js';

 
const token = process.env.DISCORD_TOKEN;

// Create the bot client with necessary permissions
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,           // For server interactions
        GatewayIntentBits.GuildMessages,    // For reading messages
        GatewayIntentBits.MessageContent     // For message content
    ] 
});

 
// EVENT 1: When Bot Starts
 client.once(Events.ClientReady, async () => {
    console.log(`  Bot is ready! Logged in as ${client.user.tag}`);
    
    // Connect to MongoDB database
    await connectDB();
});

 // EVENT 2: When User Uses a Slash Command
 // jab BOT interaction ke liye ,ready ho jata hai
client.on("interactionCreate", async (interaction) => {
    
    // Only handle slash commands (ignore button clicks, etc.)
    if (!interaction.isChatInputCommand()) return;

     // COMMAND 1: /create - Create Short URL
  
    if (interaction.commandName === 'create') {
        
        try {
            // Tell Discord we're processing (gives us time to work)
            await interaction.deferReply();

            // Get the URL from the command
            const url = interaction.options.getString('url');
            const userId = interaction.user.id;

            // Debug: Log what we received
            console.log("=== DEBUG INFO ===");
            console.log("URL received:", url);
            console.log("URL type:", typeof url);
            console.log("URL length:", url?.length);
            console.log("User ID:", userId);

            // Check if URL was provided
            if (!url) {
                await interaction.editReply({
                    content: `❌ **Error:** URL is required!\n\n` +
                            `**Correct usage:** \`/create url:https://github.com/MohammadShujaullah\`\n\n` +
                            `**Note:** You must include \`url:\` before the URL.`
                });
                return;
            }

            // Call controller to create short URL
            const result = await handleGenerateShortURL(interaction, url, userId);
            
            // Debug: Log the result
            console.log("Controller result:", result);

            // If successful, show the short URL
            if (result.success) {
                const shortUrl = `https://yourdomain.com/${result.shortId}`;

                await interaction.editReply({
                    content: `✅ **Short URL Created!**\n\n` +
                            `**Original URL:** ${url}\n` +
                            `**Short URL:** ${shortUrl}\n` +
                            `**Short ID:** \`${result.shortId}\``
                });
            } 
            // If failed, show error
            else {
                await interaction.editReply({
                    content: `❌ **Error:** ${result.error}\n\nPlease make sure you provide a valid URL (e.g., https://example.com)`
                });
            }
        } catch (error) {
            console.error("Error handling /create command:", error);
            try {
                await interaction.editReply({
                    content: `❌ **Server Error:** Something went wrong. Please try again later.\n\nError: ${error.message}`
                });
            } catch (editError) {
                console.error("Failed to send error message:", editError);
            }
        }
    }

     // COMMAND 2: /expand - Get Original URL
 
    if (interaction.commandName === 'expand') {
        
        try {
            await interaction.deferReply();

            // Get the short ID from the command
            const shortId = interaction.options.getString('shortid');

            // Call controller to find the original URL
            const result = await handleVisitThroughShortURL(shortId);

            // If found, show the original URL
            if (result.success) {
                await interaction.editReply({
                    content: `🔗 **URL Found!**\n\n` +
                            `**Short ID:** \`${shortId}\`\n` +
                            `**Original URL:** ${result.redirectUrl}\n` +
                            `**Total Visits:** ${result.visitCount}`
                });
            } 
            // If not found, show error
            else {
                await interaction.editReply({
                    content: `❌ **Error:** ${result.error}`
                });
            }
        } catch (error) {
            console.error("Error handling /expand command:", error);
            try {
                await interaction.editReply({
                    content: `❌ **Server Error:** Something went wrong. Please try again later.\n\nError: ${error.message}`
                });
            } catch (editError) {
                console.error("Failed to send error message:", editError);
            }
        }
    }

     // COMMAND 3: /analytics - Get URL Statistics
     if (interaction.commandName === 'analytics') {
        
        try {
            await interaction.deferReply();

            // Get the short ID from the command
            const shortId = interaction.options.getString('shortid');

            // Call controller to get statistics
            const result = await handleGetURLAnalytics(shortId);

            // If found, show the statistics
            if (result.success) {
                const data = result.data;
                await interaction.editReply({
                    content: `📊 **URL Analytics**\n\n` +
                            `**Short ID:** \`${data.shortId}\`\n` +
                            `**Original URL:** ${data.redirectUrl}\n` +
                            `**Total Clicks:** ${data.totalClicks}\n` +
                            `**Created:** <t:${Math.floor(data.createdAt.getTime() / 1000)}:R>`
                });
            } 
            // If not found, show error
            else {
                await interaction.editReply({
                    content: ` **Error:** ${result.error}`
                });
            }
        } catch (error) {
            console.error("Error handling /analytics command:", error);
            try {
                await interaction.editReply({
                    content: ` **Server Error:** Something went wrong. Please try again later.\n\nError: ${error.message}`
                });
            } catch (editError) {
                console.error("Failed to send error message:", editError);
            }
        }
    }
});

 // EVENT 3: When User Sends a Message (Optional)
 client.on("messageCreate", (message) => {
    
    // Ignore messages from bots
    if (message.author.bot) return;

    // If user types "create" in a message, guide them to use slash command
    if (message.content.startsWith("create")) {
        const url = message.content.split("create")[1]?.trim();
        
        if (!url) {
            return message.reply({
                content: "  Please provide a URL after 'create'. Example: `create https://example.com`\n\n💡 **Tip:** Use the slash command `/create url:https://example.com` for better experience!"
            });
        }

        return message.reply({
            content: ` **Please use the slash command instead!**\n\nUse: \`/create url:${url}\`\n\nThis will properly save your URL to the database.`
        });
    }
});

//  
// START THE BOT
 
client.login(token);
