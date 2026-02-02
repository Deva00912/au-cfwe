const mongoose = require("mongoose");
require("dotenv").config();

async function testConnection() {
  try {
    console.log("Testing MongoDB Atlas connection...");

    // Hide password in logs
    const safeUri = process.env.MONGODB_URI.replace(
      /mongodb\+srv:\/\/([^:]+):([^@]+)@/,
      "mongodb+srv://$1:***@"
    );
    console.log("Using:", safeUri);

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connection successful!");
    console.log("Database:", mongoose.connection.name);
    console.log("Host:", mongoose.connection.host);

    // List all databases to verify access
    const adminDb = mongoose.connection.db.admin();
    const dbs = await adminDb.listDatabases();
    console.log("\nAvailable databases:");
    dbs.databases.forEach((db) => {
      console.log(`- ${db.name}`);
    });

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Connection failed:", error.message);

    if (error.message.includes("Authentication failed")) {
      console.log("\nAuthentication failed. Please check:");
      console.log("1. Username and password in MONGODB_URI");
      console.log("2. User exists in Database Access page");
      console.log("3. Password is correct (case-sensitive)");
    } else if (error.message.includes("network")) {
      console.log("\nNetwork error. Please check:");
      console.log("1. Internet connection");
      console.log("2. IP address is whitelisted in Network Access");
    }

    process.exit(1);
  }
}

testConnection();
