import React, { ReactNode } from "react";
import FileViewNavigator from "../../components/FileViewNavigator";

export default function FileViewLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen w-full overflow-hidden">
      <nav>
        <FileViewNavigator />
      </nav>
      {children}
    </div>
  );
}
