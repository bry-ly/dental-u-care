import { MongoClient } from "mongodb";

/**
 * Creates database indexes for optimal query performance
 * Run with: npx ts-node prisma/create-indexes.ts
 */
async function createIndexes() {
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL environment variable is not set");
    process.exit(1);
  }

  const client = new MongoClient(process.env.DATABASE_URL);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db();

    console.log("📊 Creating indexes...");

    // Appointment indexes for status, date, and user filtering
    console.log("  - Creating appointment indexes...");
    await db.collection("appointment").createIndex({ status: 1 });
    await db.collection("appointment").createIndex({ date: 1 });
    await db.collection("appointment").createIndex({ createdAt: -1 });
    await db
      .collection("appointment")
      .createIndex({ patientId: 1, status: 1, date: 1 });
    await db
      .collection("appointment")
      .createIndex({ dentistId: 1, status: 1, date: 1 });
    await db
      .collection("appointment")
      .createIndex({ status: 1, updatedAt: -1 });

    // User indexes for role-based queries
    console.log("  - Creating user indexes...");
    await db.collection("user").createIndex({ role: 1 });
    await db.collection("user").createIndex({ role: 1, createdAt: -1 });
    await db.collection("user").createIndex({ emailVerified: 1 });
    await db.collection("user").createIndex({ role: 1, isAvailable: 1 });

    // Payment indexes for status and user queries
    console.log("  - Creating payment indexes...");
    await db.collection("payment").createIndex({ status: 1 });
    await db.collection("payment").createIndex({ userId: 1, status: 1 });
    await db.collection("payment").createIndex({ paidAt: -1 });
    await db.collection("payment").createIndex({ status: 1, paidAt: -1 });

    // Service indexes
    console.log("  - Creating service indexes...");
    await db.collection("service").createIndex({ isActive: 1 });
    await db.collection("service").createIndex({ category: 1, isActive: 1 });

    // Session indexes for auth performance
    console.log("  - Creating session indexes...");
    await db.collection("session").createIndex({ expiresAt: 1 });
    await db.collection("session").createIndex({ userId: 1 });

    console.log("\n✅ All indexes created successfully!");

    // Display created indexes
    console.log("\n📋 Index Summary:");
    const collections = [
      "appointment",
      "user",
      "payment",
      "service",
      "session",
    ];
    for (const collectionName of collections) {
      const indexes = await db.collection(collectionName).indexes();
      console.log(`\n${collectionName}:`);
      indexes.forEach((index) => {
        const keyStr = Object.entries(index.key)
          .map(([k, v]) => `${k}:${v}`)
          .join(", ");
        console.log(`  - ${index.name}: { ${keyStr} }`);
      });
    }
  } catch (error) {
    console.error("❌ Error creating indexes:", error);
    process.exit(1);
  } finally {
    await client.close();
    console.log("\n✅ Disconnected from MongoDB");
  }
}

createIndexes().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});
