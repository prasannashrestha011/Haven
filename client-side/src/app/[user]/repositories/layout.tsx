import SearchInput from "@/app/search/searchInput";
import { ReactNode } from "react";


export default function RepositoryLayout({children}:{children:ReactNode}){
    return(
        <div>
            <SearchInput/>
            <div>
                {children}
            </div>
        </div>
    )
}