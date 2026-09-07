import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    const password = await bcrypt.hash('Admin123', 12);

    // Create the admin role if it doesn't exist
    const adminRole = await prisma.role.upsert({
      where: { name: 'ADMIN' },
      update: {},
      create: {
        name: 'ADMIN',
        description: 'Administrator role with full access',
      },
    });

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: { email: 'admin@samvera.com' }
    });

    if (existingUser) {
      console.log('Admin user already exists!');
      
      // Ensure they have the ADMIN role
      const userRoleExists = await prisma.userRole.findUnique({
        where: {
          userId_roleId: {
            userId: existingUser.id,
            roleId: adminRole.id
          }
        }
      });

      if (!userRoleExists) {
        await prisma.userRole.create({
          data: {
            userId: existingUser.id,
            roleId: adminRole.id
          }
        });
        console.log('Granted ADMIN role to existing user.');
      }
      return;
    }

    // Create the Admin user
    const user = await prisma.user.create({
      data: {
        firstName: 'System',
        lastName: 'Admin',
        email: 'admin@samvera.com', // using a valid email format
        password,
        isActive: true,
        emailVerified: true,
        roles: {
          create: {
            roleId: adminRole.id,
          },
        },
      },
    });

    console.log(`Successfully created Admin User:`);
    console.log(`Email: ${user.email}`);
    console.log(`Password: Admin123`);

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
