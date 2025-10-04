// Password reset utility for existing users
// Run this script to reset passwords for users who can't login due to old password hashes

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const readline = require('readline');

const prisma = new PrismaClient();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function resetUserPassword() {
  try {
    console.log('Password Reset Utility');
    console.log('=====================');
    
    // List all users
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true }
    });
    
    console.log('\nExisting users:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email})`);
    });
    
    rl.question('\nEnter user email to reset password: ', async (email) => {
      const user = await prisma.user.findFirst({
        where: { email }
      });
      
      if (!user) {
        console.log('User not found!');
        rl.close();
        await prisma.$disconnect();
        return;
      }
      
      rl.question('Enter new password: ', async (newPassword) => {
        try {
          const hash = await bcrypt.hash(newPassword, 10);
          
          await prisma.user.update({
            where: { id: user.id },
            data: { password_hash: hash }
          });
          
          console.log(`Password updated successfully for ${user.email}`);
        } catch (error) {
          console.error('Error updating password:', error);
        } finally {
          rl.close();
          await prisma.$disconnect();
        }
      });
    });
    
  } catch (error) {
    console.error('Error:', error);
    rl.close();
    await prisma.$disconnect();
  }
}

resetUserPassword();
