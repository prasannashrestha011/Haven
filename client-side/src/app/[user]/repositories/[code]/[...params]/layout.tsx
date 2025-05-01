import React, { ReactNode } from "react";
import FileViewNavigator from "../../components/FileViewNavigator";


export default function FileViewLayout({ children }: { children: ReactNode }) {
  return (
    <div className=" w-full overflow-hidden">

      
      <nav>
        <FileViewNavigator />
      </nav>
      <div className="h-screen w-full flex">
      {children}
      </div>
    </div>
  );
}
