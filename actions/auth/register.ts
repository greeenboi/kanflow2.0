import { getDb } from '@/lib/db/dbInitialize';
import { users } from '@/lib/schema/users';
import { registrationSchema, type RegistrationData } from '@/lib/types/zod/user';
import * as bcrypt from 'bcryptjs'
import { toast } from 'sonner';

export const registerUser = async (data: RegistrationData) => {
    const parsedData = registrationSchema.safeParse(data);
    const db = await getDb();
    if (!parsedData.success) {
        toast.error('Invalid registration data.');
        throw new Error('Invalid registration data');
    }

    const { password, ...userData } = parsedData.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await db.insert(users).values({
            ...userData,
            password: hashedPassword,
        });
        toast.success('Account created successfully! Please sign in.');
    } catch (error) {
        toast.error('Registration failed. Please try again.');
        throw new Error('Registration failed');
    }
};
