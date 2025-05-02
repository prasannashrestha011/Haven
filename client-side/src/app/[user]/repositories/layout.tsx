import SearchInput from "@/app/search/searchInput";
import { ReactNode } from "react";


export default function RepositoryLayout({children}:{children:ReactNode}){
    return(
        <div>
         
            <div>
                {children}
            </div>
        </div>
    )
}