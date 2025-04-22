import FileViewNavigator from "../components/FileViewNavigator";
import RepoFileExplorer from "../preview/[repo]/clientContent";


export default function RepoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-screen overflow-hidden flex bg-gray-900 text-gray-200">
     <div className="h-screen w-72">
     <RepoFileExplorer />

     </div>
      <div className="w-full flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}

