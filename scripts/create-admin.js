// Script to create admin account
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

async function createAdmin() {
  const email = 'sarojmounjewellary@gmail.com';
  const password = 'Sarojmoun@jewellary18';
  const name = 'Saroj Moun';
  
  // Hash password
  const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
  
  try {
    // Check if admin exists
    const existing = await prisma.admin.findUnique({ where: { email } });
    
    if (existing) {
      // Update password
      await prisma.admin.update({
        where: { email },
        data: { passwordHash, name }
      });
      console.log('✅ Admin password updated successfully!');
    } else {
      // Create new admin
      await prisma.admin.create({
        data: {
          email,
          passwordHash,
          name,
          role: 'SUPER_ADMIN',
          isActive: true
        }
      });
      console.log('✅ Admin account created successfully!');
    }
    
    console.log('\n📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('\nYou can now login at /admin');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
