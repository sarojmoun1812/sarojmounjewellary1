const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  // Delete existing admin and create fresh
  await prisma.admin.deleteMany({
    where: { email: "sarojmounjewellary@gmail.com" },
  });
  
  console.log("Creating fresh admin...");

  // Create admin with hardcoded credentials
  const passwordHash = await bcrypt.hash("Sarojmoun@jewellary18", 12);

  const admin = await prisma.admin.create({
    data: {
      email: "sarojmounjewellary@gmail.com",
      passwordHash,
      name: "Saroj Moun Jewellery",
      role: "SUPER_ADMIN",
      isActive: true,
    },
  });

  console.log("Admin created successfully!");
  console.log("Email: sarojmounjewellary@gmail.com");
  console.log("Password: Sarojmoun@jewellary18");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
