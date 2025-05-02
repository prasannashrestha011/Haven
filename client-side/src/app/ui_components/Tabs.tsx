"use client"

import Link from "next/link";
import { useParams } from "next/navigation"

import { Book, LayoutDashboard } from "lucide-react"; // Import icons

export const ProfileTabs = () => {
  
  const params = useParams();
  const user = params.user;

  return (
    <div className="flex gap-3 px-5  text-slate-200 py-2">
      <Link href={`/${user}`} className="flex items-center gap-1 ">
        <LayoutDashboard size={16} />
        <span>Overview</span>
      </Link>
      <Link href={`/${user}?tab=repo`} className="flex items-center gap-1 ">
        <Book size={16} />
        <span>Repositories</span>
      </Link>
    </div>
  );
}
