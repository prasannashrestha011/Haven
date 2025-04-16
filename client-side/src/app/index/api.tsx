import axios from "axios"

export interface RegistrationForm{
    username:string
    password:string 
    email:string
}
export type RegistrationResult =
  | { success: true; message:string } 
  | { success: false; error: string }; 

interface LoginForm{
    username:string 
    password:string 
}
interface LoginResponseType{
    refresh:string 
    access:string 
    username:string 
    storageID:string
}
const root_url=process.env.NEXT_PUBLIC_ROOT_URL
export async function SubmitRegistrationForm(
    body: RegistrationForm
  ): Promise<RegistrationResult> {
    try {
      console.log("Processing...");
      const response = await axios.post(`${root_url}/auth/register`, body);
      return {success:true,message:"Registration successfull"}
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 400) {
          console.log("Validation Error:", err.response.data);
          var non_field_err=err.response.data.error.non_field_errors 
            return {success:false,error:non_field_err}
        } else {
          console.error("Server Error:", err.response?.status, err.message);
           return {success:false,error:err.message}
        }
      } else {
        console.error("Unknown Error:", err);
      }
      return {success:false,error:"Unknow error while registration,please try again later"};
    }
  }
export async function SubmitLoginForm(body: LoginForm): Promise<LoginResponseType | null> {
    try {
        const response = await axios.post<LoginResponseType>(`${root_url}/auth/token`, body);
        
        if (response.status !== 200) {
            console.error("Login failed with status:", response.status, "Response:", response.data);
            return null;
        }
        console.log(response.data)
        return response.data;
    } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
            // Handle Axios-specific errors
            console.error("Login request failed:", {
                status: err.response?.status,
                message: err.response?.data?.message || err.message,
                code: err.code
            });
        } else if (err instanceof Error) {
            // Handle other Error types
            console.error("Unexpected login error:", err.message);
        } else {
            // Handle completely unknown errors
            console.error("Unknown error occurred during login");
        }
        
        return null;
    }
}