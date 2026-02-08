// Script to create admin account
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

// Same hashing logic as lib/auth.ts
async function hashPassword(password) {
  const authSecret = process.env.AUTH_SECRET || 'default-secret-key';
  const encoder = new TextEncoder();
  const data = encoder.encode(password + authSecret);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function createAdmin() {
  const email = 'sarojmounjewellary@gmail.com';
  const password = 'Sarojmoun@jewellary18';
  const name = 'Saroj Moun';
  
  // Hash password using same logic as auth.ts
  const passwordHash = await hashPassword(password);
  
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
