import { create } from 'zustand'
import { persist } from 'zustand/middleware'
export interface UserStruct{
  username:string
}
export interface UserInfoState {
  userID:string
  username:string
  created_at:string 
  updated_at:string 
  folder_ref:string 
  readme_ref:string
}
export interface ReadmeType{
  file_name:string 
  content:string
}
export interface ProfileType{
  user:UserInfoState
  readme:ReadmeType
}
interface UserStore {
  profileInfo: ProfileType | null
  setProfileInfo: (info: ProfileType) => void
}

const useProfileStore = create<UserStore>()(
  persist(
    (set) => ({
        profileInfo: null,
      setProfileInfo: (info: ProfileType) => set({ profileInfo: info })
    }),
    {
      name: 'user-storage',
    }
  )
)
export default useProfileStore