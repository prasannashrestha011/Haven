import { create } from 'zustand'
import { persist } from 'zustand/middleware'
export interface UserStruct{
  username:string
}
interface UserInfoState {
  username: string
  storageID: string
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