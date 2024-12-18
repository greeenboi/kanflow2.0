import { getUserByUsername, createUser, type User } from '@/lib/db/actions';
import { updateUser } from '@/lib/store/userStore'; // Import updateUser
import bcrypt from 'bcryptjs';
import { toast } from 'sonner';

const guestLogin = async () => {
  console.log('guestLogin: Guest login attempt started');
  try {
    let user = await getUserByUsername('anonymous');
    console.log('guestLogin: Retrieved guest user');
    if (!user) {
      console.log('guestLogin: Guest user not found, creating new guest user');
      const hashedPassword = await bcrypt.hash('anon', 10);
      await createUser({
        username: 'anonymous',
        password: hashedPassword,
        name: 'Guest User',
        email: 'guest@example.com',
      });
      console.log('guestLogin: Guest user created');
      user = await getUserByUsername('anonymous');
      console.log('guestLogin: Retrieved newly created guest user');
    }

    if (!user) {
      console.error('guestLogin: Failed to create or retrieve guest user');
      throw new Error('Failed to create or retrieve guest user');
    }

    const { password: _, ...safeUser } = user;

    // Update the user store
    await updateUser(safeUser as User);
    console.log('guestLogin: User store updated with guest user');

    sessionStorage.setItem('user', JSON.stringify(safeUser));
    console.log('guestLogin: Guest user stored in sessionStorage');
    toast.success('Logged in as Guest');
    console.log('guestLogin: Guest login successful');
    return safeUser;
  } catch (error) {
    console.error('guestLogin: Guest login failed', error);
    toast.error('Guest login failed');
    throw error;
  }
};

export default guestLogin;
