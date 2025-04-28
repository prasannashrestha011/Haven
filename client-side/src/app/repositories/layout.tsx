import { ReactNode } from "react";
import SearchInput from "../search/searchInput";

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