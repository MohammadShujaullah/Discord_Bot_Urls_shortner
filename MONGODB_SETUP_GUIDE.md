# MongoDB Setup Guide for Discord Bot URL Shortener

## 📋 Prerequisites Checklist

- ✅ MongoDB account (MongoDB Atlas - free tier available)
- ✅ mongoose package (already installed in your package.json)
- ✅ MongoDB connection string

---

## 🔗 Step 1: Get MongoDB Connection String

### Option A: MongoDB Atlas (Cloud - Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account or sign in
3. Create a new cluster (free tier M0)
4. Go to **Database Access** → Create a database user
5. Go to **Network Access** → Add your IP (or 0.0.0.0/0 for development)
6. Click **Connect** → **Connect your application**
7. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)

### Option B: Local MongoDB
- Install MongoDB locally
- Connection string: `mongodb://localhost:27017/discord_bot`

---

## 🔧 Step 2: Add MongoDB Connection String to .env

Add this line to your `.env` file:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/discord_bot?retryWrites=true&w=majority
```

**Important:** Replace `username`, `password`, and `cluster` with your actual values!

---

## 📦 Step 3: Create Database Connection File

Create a new file: `database.js`

**Key Points:**
- Use `mongoose.connect()` to connect to MongoDB
- Handle connection events (connected, error, disconnected)
- Export the connection function

**Hints:**
```javascript
import mongoose from 'mongoose';

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
  }
}
```

---

## 📊 Step 4: Create URL Schema/Model

Create a new file: `models/Url.js` (create `models` folder first)

**Schema Structure:**
- `originalUrl` (String, required) - The long URL
- `shortId` (String, required, unique) - The short identifier
- `createdAt` (Date, default: Date.now) - When it was created
- `clickCount` (Number, default: 0) - Track how many times it was clicked

**Hints:**
- Use `mongoose.Schema()` to define the schema
- Use `mongoose.model()` to create the model
- Consider adding indexes for faster lookups

---

## 🎯 Step 5: Implement URL Shortening Logic

**Key Functions Needed:**

1. **Generate Short ID**
   - Use `crypto.randomBytes()` or `nanoid` package
   - Make it 6-8 characters long
   - Check if it already exists in database

2. **Save URL to Database**
   - Validate the URL format
   - Generate unique shortId
   - Save to MongoDB using your model

3. **Retrieve URL from Database**
   - Find by shortId
   - Return originalUrl

**Hints:**
- Use `URL` constructor to validate URLs
- Handle duplicate shortIds (regenerate if exists)
- Add error handling for database operations

---

## 🔄 Step 6: Update Your Bot Commands

### Update `command.js`:
- Add URL parameter to the `/create` command
- Add options for the command (e.g., `url` option)

### Update `index.js`:
- Import your database connection
- Import your URL model
- Connect to MongoDB when bot starts
- Handle the `/create` command interaction
- Save URL to database
- Reply with short URL

**Command Structure:**
```
/create url:https://example.com
```

---

## 🚀 Step 7: Implementation Flow

1. **Bot Startup:**
   - Connect to MongoDB
   - Wait for connection before accepting commands

2. **When User Runs `/create`:**
   - Extract URL from command options
   - Validate URL format
   - Generate shortId
   - Save to MongoDB
   - Reply with: `Your short URL: https://yourdomain.com/shortId`

3. **Optional: Add `/expand` command:**
   - Look up shortId in database
   - Return original URL

---

## 📝 Step 8: Error Handling

Handle these cases:
- Invalid URL format
- Database connection errors
- Duplicate shortId (regenerate)
- URL not found (for expand command)
- Network errors

---

## 🎨 Step 9: Optional Enhancements

- Add expiration dates for URLs
- Track click counts
- Add custom shortId option
- Add user ownership (link URLs to Discord user IDs)
- Add analytics (when was it created, how many clicks)

---

## 📚 Useful Mongoose Methods

- `Model.create()` - Create new document
- `Model.findOne()` - Find one document
- `Model.findById()` - Find by ID
- `Model.exists()` - Check if document exists
- `Model.updateOne()` - Update document

---

## 🔍 Testing Steps

1. Start your bot
2. Check console for MongoDB connection message
3. Run `/create url:https://google.com`
4. Check MongoDB Atlas/Compass to see if document was created
5. Verify the shortId is returned correctly

---

## ⚠️ Common Issues & Solutions

**Issue:** Connection timeout
- **Solution:** Check your IP is whitelisted in MongoDB Atlas

**Issue:** Authentication failed
- **Solution:** Verify username/password in connection string

**Issue:** Duplicate key error
- **Solution:** Regenerate shortId if it already exists

**Issue:** Invalid URL
- **Solution:** Use URL validation before saving

---

## 📖 Next Steps After Setup

1. Create a web server to handle redirects (optional)
2. Add rate limiting to prevent abuse
3. Add command to list user's URLs
4. Add command to delete URLs
5. Add statistics/analytics

---

Good luck! 🚀

