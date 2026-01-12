# Discord Bot URL Shortener

A powerful Discord bot that allows users to create, manage, and track shortened URLs directly from their Discord servers. This bot makes it easy to share long URLs in a compact format while providing analytics and tracking capabilities.

## ✨ Features

### 🚀 URL Creation
- **Create Short URLs**: Use the `/create` command to generate a short URL from any long URL
- **Automatic Protocol Detection**: Automatically adds `https://` if no protocol is specified
- **URL Validation**: Validates URLs to ensure they are properly formatted before shortening
- **Unique Short IDs**: Generates 8-character unique short identifiers using nanoid

### 🔍 URL Expansion
- **Expand Short URLs**: Use the `/expand` command to retrieve the original URL from a short ID
- **Visit Count Tracking**: Shows how many times a short URL has been accessed
- **Real-time Lookup**: Instantly retrieves original URLs from the database

### 📊 Analytics & Tracking
- **URL Analytics**: Use the `/analytics` command to get detailed statistics
- **Click Tracking**: Tracks total clicks on each shortened URL
- **Creation Timestamp**: Shows when each URL was created
- **Historical Data**: Maintains visit history with timestamps

### 💾 Database Management
- **MongoDB Integration**: Uses MongoDB Atlas for reliable storage
- **Visit History**: Logs every access with timestamps for analytics
- **User Attribution**: Links URLs to Discord user IDs who created them
- **Automatic Indexing**: Optimized database indexing for fast lookups

### 🤖 Discord Integration
- **Slash Commands**: Full integration with Discord's slash command system
- **Interactive Responses**: Rich embed-like responses with emoji formatting
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Message Filtering**: Guides users to use slash commands instead of text commands

## 🛠️ Commands

### `/create url:<long_url>`
Creates a new shortened URL from the provided long URL.

**Parameters:**
- `url` (Required): The long URL you want to shorten

**Example:**
```
/create url:https://github.com/MohammadShujaullah
```

### `/expand shortid:<short_identifier>`
Retrieves the original URL from a short identifier.

**Parameters:**
- `shortid` (Required): The short ID of the URL to expand

**Example:**
```
/expand shortid:a1b2c3d4e5f
```

### `/analytics shortid:<short_identifier>`
Gets detailed analytics for a shortened URL.

**Parameters:**
- `shortid` (Required): The short ID to get analytics for

**Example:**
```
/analytics shortid:a1b2c3d4e5f
```

## 🚀 Getting Started

### Prerequisites
- Node.js (ESM support required)
- Discord Bot Token
- MongoDB Atlas account (or local MongoDB instance)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Discord_BOT_URLs_shortner
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory with the following:
   ```
   DISCORD_TOKEN=your_discord_bot_token
   CLIENT_ID=your_discord_application_client_id
   MONGODB_URL=your_mongodb_connection_string
   ```

4. **Register slash commands:**
   ```bash
   node command.js
   ```

5. **Start the bot:**
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

### Environment Variables
- `DISCORD_TOKEN`: Your Discord bot token from the Developer Portal
- `CLIENT_ID`: Your Discord application client ID
- `MONGODB_URL`: MongoDB connection string (Atlas or local)

## 📊 Analytics Information

The bot provides comprehensive analytics for each shortened URL:
- **Total Clicks**: Number of times the short URL has been accessed
- **Creation Time**: When the URL was originally shortened
- **Visit History**: Timestamps of each visit for trend analysis
- **Original URL**: The full destination URL that the short link redirects to

## 🔒 Security & Reliability

- **Duplicate Prevention**: Prevents creation of duplicate short IDs
- **Input Validation**: Validates all URLs before processing
- **Error Resilience**: Handles network and database errors gracefully
- **Rate Limiting Ready**: Architecture supports adding rate limiting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support, please open an issue in the GitHub repository or contact the project maintainer.

---

Made with ❤️ using Discord.js and MongoDB