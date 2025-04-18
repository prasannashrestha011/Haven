import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PathStore{
    path:string
    setPath:(path:string)=>void
}
const usePathStore=create<PathStore>()(persist(
    (set)=>({
        path:"",
        setPath:(path:string)=>set({path:path})
    }),
    {
        name:"path-storage"
    }
))
export default usePathStore