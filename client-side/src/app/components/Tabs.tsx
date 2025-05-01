"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link";
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"

export const ProfileTabs = () => {
  
    const params = useParams();
    const user = params.user;

  
    return (
      <div className="flex gap-3 px-5 bg-gray-900 text-slate-200">
         <Link href={`/${user}`}>
        <span>OverView</span>
        </Link>
        <Link href={`/${user}?tab=repo`}>
        <span>Repositories</span>
        </Link>
        </div>
    );
};
