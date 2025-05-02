
import { ReactNode } from "react";
import DisplayProfileDetails from "./profileComponents/DisplayProfileDetails";
import { ProfileTabs } from "../ui_components/Tabs";
import SearchInput from "../search/searchInput";
import Nav from "../ui_components/Nav";

export default function ProfileLayout({children}:{children:ReactNode}){
    return(
        <div className="bg-gray-900">
                 <Nav/>
            <div className="flex">
           
            <div className="flex-1">
                {children}
            </div>
            </div>
        </div>
    )
}