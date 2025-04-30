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

interface UserStore {
  userInfo: UserInfoState | null
  setUserInfo: (info: UserInfoState) => void
}

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      userInfo: null,
      setUserInfo: (info: UserInfoState) => set({ userInfo: info })
    }),
    {
      name: 'user-storage',
    }
  )
)
export default useUserStore