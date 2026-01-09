import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create roles
  const adminRole = await prisma.role.upsert({
    where: { name: "admin" },
    update: {},
    create: {
      name: "admin",
      description: "Administrator with full access",
      permissions: {
        users: ["create", "read", "update", "delete"],
        events: ["create", "read", "update", "delete"],
        settings: ["create", "read", "update", "delete"],
        logs: ["read"],
      },
    },
  });

  const memberRole = await prisma.role.upsert({
    where: { name: "member" },
    update: {},
    create: {
      name: "member",
      description: "Regular member",
      permissions: {
        events: ["read"],
        profile: ["read", "update"],
      },
    },
  });

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@crazzyshuttlers.com" },
    update: {},
    create: {
      email: "admin@crazzyshuttlers.com",
      password: adminPassword,
      firstName: "Admin",
      lastName: "User",
      fullName: "Admin User",
      roleId: adminRole.id,
      isActive: true,
      isEmailVerified: true,
    },
  });

  // Create default admin (backward compatibility)
  await prisma.admin.upsert({
    where: { email: "admin@crazzyshuttlers.com" },
    update: {},
    create: {
      email: "admin@crazzyshuttlers.com",
      password: adminPassword,
      name: "Admin User",
    },
  });

  // Create default settings
  const defaultSettings = [
    {
      key: "membership_fee",
      value: "100",
      valueType: "number",
      category: "payment",
      description: "Membership fee in INR",
      isPublic: true,
    },
    {
      key: "popup_enabled",
      value: "false",
      valueType: "boolean",
      category: "popup",
      description: "Enable popup notifications",
      isPublic: false,
    },
    {
      key: "popup_title",
      value: "Welcome!",
      valueType: "string",
      category: "popup",
      description: "Popup title",
      isPublic: false,
    },
    {
      key: "popup_content",
      value: "Welcome to Crazzy Shuttlers Badminton Federation Pune!",
      valueType: "string",
      category: "popup",
      description: "Popup content",
      isPublic: false,
    },
    {
      key: "newsletter_enabled",
      value: "true",
      valueType: "boolean",
      category: "newsletter",
      description: "Enable newsletter",
      isPublic: true,
    },
    {
      key: "email_from",
      value: "noreply@crazzyshuttlersbadminton.com",
      valueType: "string",
      category: "email",
      description: "Default email sender",
      isPublic: false,
    },
    {
      key: "contact_email",
      value: "contact@crazzyshuttlersbadminton.com",
      valueType: "string",
      category: "general",
      description: "Contact email",
      isPublic: true,
    },
    {
      key: "contact_phone",
      value: "+91 1234567890",
      valueType: "string",
      category: "general",
      description: "Contact phone",
      isPublic: true,
    },
  ];

  for (const setting of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  // Create sample event
  const event = await prisma.event.upsert({
    where: { id: "sample-event-1" },
    update: {},
    create: {
      id: "sample-event-1",
      title: "Crazzy Shuttlers Badminton Tournament",
      description: "Join us for an exciting badminton tournament",
      startDate: new Date("2025-02-07"),
      endDate: new Date("2025-02-08"),
      registrationUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfj17VpGx9T8GKuNN8RGyCd0bOfhVgD66yp68thj3xVQA_6Jg/viewform",
      isActive: true,
      isFeatured: true,
      categories: [
        "Men's Singles",
        "Women's Singles",
        "Men's Doubles",
        "Women's Doubles",
        "Mixed Doubles",
      ],
      matchFormat: "Best of 3 sets (21 points)",
      schedule: [
        {
          day: "Day 1 - February 7",
          description: "Preliminary rounds and group stage matches",
          time: "9:00 AM - 6:00 PM",
        },
        {
          day: "Day 2 - February 8",
          description: "Quarterfinals, semifinals, and finals",
          time: "9:00 AM - 8:00 PM",
        },
      ],
    },
  });

  console.log("Database seeded successfully!");
  console.log({ admin, adminRole, memberRole, event });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
