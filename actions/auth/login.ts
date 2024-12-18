import { getUserByEmail, type User } from '@/lib/db/actions';
import { updateUser } from '@/lib/store/userStore';
import type { LoginCredentials } from '@/lib/types/login';
import bcrypt from 'bcryptjs';
import { toast } from 'sonner';
import { saveUserToCookie } from '@/lib/utils/cookies';

const loginUser = async ({ email, password, rememberMe }: LoginCredentials) => {
  console.log('loginUser: Login attempt started for email', email);
  try {
    const user = await getUserByEmail(email);
    console.log(`loginUser: Retrieved user for email ${email}`);
    if (!user) {
      toast.error('Invalid email or password');
      console.error('loginUser: User not found');
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('loginUser: Password validation result:', isValidPassword);
    if (!isValidPassword) {
      toast.error('Invalid email or password');
      console.error('loginUser: Invalid password');
      throw new Error('Invalid credentials');
    }

    // Remove sensitive data
    const { password: _, ...safeUser } = user;

    // Update the user store and cookies
    await updateUser(safeUser as User);
    saveUserToCookie(safeUser as User);
    console.log('loginUser: User store and cookies updated');

    // Remove localStorage/sessionStorage usage as we're using cookies now
    
    toast.success('Login successful!');
    console.log('loginUser: Login successful');
    return safeUser;
  } catch (error) {
    console.error('loginUser: Login failed', error);
    toast.error(error instanceof Error ? error.message : 'Login failed');
    throw error;
  }
};

export default loginUser;