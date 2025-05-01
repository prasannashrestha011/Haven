import { UserInfoState ,ProfileType} from '@/state/user_info_state';
import axios from 'axios';

interface FetchUserResponseStruct{
    data:UserInfoState|null
    err:string 
    success:boolean
}
interface FetchProfileResponseStruct{
    data:ProfileType|null 
    err:string 
    success:boolean
}
export const fetchUserInfo = async (username: string): Promise<FetchUserResponseStruct> => {
    
    const apiUrl = `${process.env.NEXT_PUBLIC_ROOT_URL}/auth/user?username=${username}`;

    try {
        const response = await axios.get(apiUrl);
        if (response.status === 200) {
            console.log(response.data.user)
            return {data:response.data.user as UserInfoState,success:true,err:""}
        } else {
            console.error(`Unexpected response status: ${response.status}`);
            return {data:null,success:false,err:"Unexpected error"};
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
        
            if (error.response) {
               
                return {data:null,err:error.response.data.error,success:false}
            }
        } else {
        
            return {data:null,success:false,err:"Unexpected error"};
        }
        return {data:null,success:false,err:"Unexpected error"};
    }
};
export const fetchProfileInfo = async (username: string): Promise<FetchProfileResponseStruct> => {
    
    const apiUrl = `${process.env.NEXT_PUBLIC_ROOT_URL}/auth/profile?username=${username}`;

    try {
        const response = await axios.get(apiUrl);
        if (response.status === 200) {
            console.log(response.data.user)
            return {data:response.data as ProfileType,success:true,err:""}
        } else {
            console.error(`Unexpected response status: ${response.status}`);
            return {data:null,success:false,err:"Unexpected error"};
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
        
            if (error.response) {
               
                return {data:null,err:error.response.data.error,success:false}
            }
        } else {
        
            return {data:null,success:false,err:"Unexpected error"};
        }
        return {data:null,success:false,err:"Unexpected error"};
    }
};