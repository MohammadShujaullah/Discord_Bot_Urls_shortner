import { nanoid } from "nanoid";
import UrlModel from "../models/Urls.js";


 
async function handleGenerateShortURL(interaction, url, userId) {
  
  // Step 1: Check if URL was provided
  if (!url) {
    return {
      success: false,
      error: "URL is required"
    };
  }

  // Step 2: Clean and validate URL
  console.log("=== CONTROLLER DEBUG ===");
  console.log("Original URL received:", url);
  console.log("URL type:", typeof url);
  
  // Remove any extra whitespace
  url = url.trim();
  console.log("After trim:", url);
  
  // Add https:// if no protocol is specified
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
    console.log("Added https://, new URL:", url);
  }

  // Step 3: Check if URL is valid format
  try {
    const urlObj = new URL(url);
    console.log("URL object created successfully");
    console.log("Hostname:", urlObj.hostname);
    console.log("Protocol:", urlObj.protocol);
    
    // Additional validation: make sure it has a valid hostname
    if (!urlObj.hostname || urlObj.hostname.length === 0) {
      console.error("URL validation failed - no hostname. URL received:", url);
      return {
        success: false,
        error: "Invalid URL format. Please provide a valid URL (e.g., https://example.com)"
      };
    }
    
    // Log successful validation for debugging
    console.log("✅ URL validated successfully:", url);
    
  } catch (error) {
    console.error(" URL validation error:", error.message);
    console.error("URL that failed validation:", url);
    console.error("URL type:", typeof url);
    console.error("URL length:", url.length);
    console.error("URL characters:", JSON.stringify(url));
    console.error("Full error:", error);
    
    return {
      success: false,
      error: `Invalid URL format: ${error.message}. Please make sure your URL is valid (e.g., https://github.com/MohammadShujaullah)`
    };
  }

  // Step 3: Generate a random short ID (8 characters)
  const shortId = nanoid(8);

  // Step 4: Save to database
  try {
    await UrlModel.create({
      shortId: shortId,
      redirectUrl: url,
      visitHistory: [],
      createdBy: userId
    });

    // Step 5: Return success with the short ID
    return {
      success: true,
      shortId: shortId
    };

  } catch (err) {
    // If shortId already exists (very rare), try again
    if (err.code === 11000) {
      return handleGenerateShortURL(interaction, url, userId);
    }
    
    // Other errors
    console.error("Error creating short URL:", err);
    return {
      success: false,
      error: "Server error while creating short URL"
    };
  }
}

 
async function handleVisitThroughShortURL(shortId) {
  
  try {
    // Step 1: Find the URL in database and add a visit record
    const urlEntry = await URL.findOneAndUpdate(
      { shortId: shortId },
      {
        $push: {
          visitHistory: { timestamp: Date.now() }
        }
      },
      { new: true }
    );

    // Step 2: Check if URL was found
    if (!urlEntry) {
      return {
        success: false,
        error: "Short URL not found"
      };
    }

    // Step 3: Return the original URL and visit count
    return {
      success: true,
      redirectUrl: urlEntry.redirectUrl,
      visitCount: urlEntry.visitHistory.length
    };

  } catch (err) {
    console.error("Error getting URL:", err);
    return {
      success: false,
      error: "Server error while retrieving URL"
    };
  }
}
 
async function handleGetURLAnalytics(shortId) {
  
  try {
    // Step 1: Find the URL in database
    const urlEntry = await URL.findOne({ shortId: shortId });

    // Step 2: Check if URL was found
    if (!urlEntry) {
      return {
        success: false,
        error: "Short URL not found"
      };
    }

    // Step 3: Return all the statistics
    return {
      success: true,
      data: {
        shortId: urlEntry.shortId,
        redirectUrl: urlEntry.redirectUrl,
        totalClicks: urlEntry.visitHistory.length,
        visitHistory: urlEntry.visitHistory,
        createdAt: urlEntry.createdAt,
        createdBy: urlEntry.createdBy
      }
    };

  } catch (err) {
    console.error("Error getting analytics:", err);
    return {
      success: false,
      error: "Server error while retrieving analytics"
    };
  }
}

// Export all functions
export {
  handleGenerateShortURL,
  handleVisitThroughShortURL,
  handleGetURLAnalytics
};
