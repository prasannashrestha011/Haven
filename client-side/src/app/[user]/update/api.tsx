import axios from 'axios';

export const UpdateReadMeFile = async (readme_ref: string,file_name:string,content:string): Promise<string> => {
    console.log("REad me ref  ",readme_ref)
    try {
        const response = await axios.put(`http://127.0.0.1:8000/api/auth/profile?readme_ref=${readme_ref}`,{
            file_name,
            content
        },{withCredentials:true});
        console.log(response.data.message.content)
        return response.data.message.content as string; // Assuming the response contains the string content
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Axios error:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'An error occurred while updating the profile.');
        } else {
            console.error('Unexpected error:', error);
            throw new Error('An unexpected error occurred.');
        }
    }
};