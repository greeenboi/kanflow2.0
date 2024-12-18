import { createUser, getUserByEmail } from '@/lib/db/actions';
import { updateUser } from '@/lib/store/userStore'; // Import updateUser
import type { RegisterFormData } from '@/lib/types/register';
import bcrypt from 'bcryptjs';
import { toast } from 'sonner';

const registerUser = async (data: RegisterFormData) => {
  console.log('registerUser: Registration started');
  try {
    // Check if user exists
    const existingUser = await getUserByEmail(data.email);
    console.log(`registerUser: Checked existing user for email ${data.email}`);
    if (existingUser) {
      toast.error('Email already registered');
      console.error('registerUser: Email already registered');
      throw new Error('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);
    console.log('registerUser: Password hashed');

    // Create user
    await createUser({
      username: data.email,
      password: hashedPassword,
      name: `${data.firstName} ${data.lastName}`,
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
    });
    console.log('registerUser: User created');

    // Retrieve the created user
    const newUser = await getUserByEmail(data.email);
    if (newUser) {
      await updateUser(newUser); // Update the user store
      console.log('registerUser: User store updated with new user');
    }

    toast.success('Registration successful! Please log in.');
    console.log('registerUser: Registration successful');
    return true;
  } catch (error) {
    console.error('registerUser: Registration failed', error);
    toast.error(error instanceof Error ? error.message : 'Registration failed');
    throw error;
  }
};

export default registerUser;