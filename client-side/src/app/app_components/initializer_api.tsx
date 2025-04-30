import { UserInfoState } from '@/state/user_info_state';
import axios from 'axios';


export const fetchUserInfo = async (username: string): Promise<UserInfoState | null> => {
    
    const apiUrl = `${process.env.NEXT_PUBLIC_ROOT_URL}/auth/user?username=${username}`;

    try {
        const response = await axios.get(apiUrl);
        if (response.status === 200) {
            return response.data.user as UserInfoState;
        } else {
            console.error(`Unexpected response status: ${response.status}`);
            return null;
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Axios error:', error.message);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
            }
        } else {
            console.error('Unexpected error:', error);
        }
        return null;
    }
};