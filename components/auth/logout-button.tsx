
import logoutUser from '@/actions/auth/logout';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logoutUser();
            toast.success('Logged out successfully.');
            router.push('/login');
        } catch (error) {
            // Error notifications are handled within the action
        }
    };

    return (
        <Button onClick={handleLogout}>
            Logout
        </Button>
    );
}