import { getDb} from '@/lib/db/dbInitialize';
import { users } from '@/lib/schema/users';
import { loginSchema, type LoginData } from '@/lib/types/zod/user';
import * as bcrypt from 'bcryptjs';
import { toast } from 'sonner';
import { eq } from 'drizzle-orm';

export async function comparePasswords(
	password: string,
	hash: string,
): Promise<boolean> {
	return bcrypt.compare(password, hash);
}

export const loginUser = async (data: LoginData) => {
    const parsedData = loginSchema.safeParse(data);
    const db = await getDb();
    if (!parsedData.success) {
        toast.error('Invalid login data.');
        throw new Error('Invalid login data');
    }
        const user = await db
            .select()
            .from(users)
            .where(eq(users.email, parsedData.data.email))
            .execute();

        if (user.length === 0) {
            toast.error('User not found.');
            throw new Error('User not found');
        }

        const isPasswordValid = await comparePasswords(parsedData.data.password, user[0].password);
        if (!isPasswordValid) {
            toast.error('Incorrect password.');
            throw new Error('Incorrect password');
        }

        // TODO: Implement session handling (e.g., JWT, cookies)
        toast.success('Logged in successfully!');
};
