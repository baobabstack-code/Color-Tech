import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

const prisma = new PrismaClient();

async function createAdminUser(
  email: string,
  password: string,
  name: string
) {
  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existingUser) {
    // Update existing user with new password
    const updatedUser = await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: {
        password: hashedPassword,
        name,
        role: "admin",
      },
    });
    console.log(`✅ Updated admin user: ${updatedUser.email}`);
    return updatedUser;
  } else {
    // Create new user
    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name,
        role: "admin",
      },
    });
    console.log(`✅ Created admin user: ${newUser.email}`);
    return newUser;
  }
}

async function main() {
  console.log("🔐 Creating admin users...\n");

  try {
    // Create admin users from environment variables
    const adminEmails =
      process.env.ADMIN_EMAILS || process.env.NEXT_PUBLIC_ADMIN_EMAILS || "";

    if (!adminEmails) {
      console.error(
        "❌ No admin emails found in environment variables (ADMIN_EMAILS or NEXT_PUBLIC_ADMIN_EMAILS)"
      );
      process.exit(1);
    }

    const emails = adminEmails.split(",").map((email) => email.trim());

    // Default password for all admin users (you should change this after first login)
    const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || "Admin@123";

    console.log(`📧 Admin emails: ${emails.join(", ")}`);
    console.log(`🔑 Default password: ${defaultPassword}\n`);

    for (const email of emails) {
      await createAdminUser(email, defaultPassword, email.split("@")[0]);
    }

    console.log("\n✅ Admin users setup complete!");
    console.log("\n⚠️  IMPORTANT: Please change the default password after first login!");
    console.log("\n📝 Login credentials:");
    emails.forEach((email) => {
      console.log(`   Email: ${email}`);
      console.log(`   Password: ${defaultPassword}\n`);
    });
  } catch (error) {
    console.error("❌ Error creating admin users:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
