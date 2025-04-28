import { ReactNode } from "react";
import SearchInput from "./searchInput";


export default function SearchLayout({children}:{children:ReactNode}){
    return(
        <div>
            <SearchInput/>
            <div>
                {children}
            </div>
        </div>
    )
}