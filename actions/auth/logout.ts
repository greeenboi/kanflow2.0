import { toast } from 'sonner';

export const logoutUser = async () => {
    try {
        // TODO: Implement session destruction, e.g., clearing cookies or tokens
        toast('Logged out successfully.');
    } catch (error) {
        toast.error('Failed to logout. Please try again.');
        throw new Error('Logout failed');
    }
};