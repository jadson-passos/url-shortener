import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export class AuthService {
  async register(email: string, password: string): Promise<User> {
    console.log('Registering user with email:', email);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    console.log('User created with ID:', user.id);
    return user;
  }

  async login(email: string, password: string): Promise<string> {
    console.log('Logging in user with email:', email);
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      console.error('User not found with email:', email);
      throw new Error('Invalid email or password');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log('Password match result:', passwordMatch);
    if (!passwordMatch) {
      console.error('Password does not match for email:', email);
      throw new Error('Invalid email or password');
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined');
      throw new Error('JWT_SECRET is not defined');
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: '1d',
    });

    console.log('Token generated for user ID:', user.id);
    return token;
  }
}
