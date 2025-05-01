import { ProfileTabs } from "@/app/components/Tabs";
import { ReactNode } from "react";
import DisplayProfileDetails from "./profileComponents/DisplayProfileDetails";

export default function ProfileLayout({children}:{children:ReactNode}){
    return(
        <div className="bg-gray-900">
            <ProfileTabs/>
            <div className="flex">
             <DisplayProfileDetails/>
            <div className="flex-1">
                {children}
            </div>
            </div>
        </div>
    )
}