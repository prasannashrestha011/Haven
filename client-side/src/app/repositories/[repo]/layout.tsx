import RepoFileExplorer from "./[...params]/clientContent";

export default function RepoLayout({children}:{children:React.ReactNode}){
    return(
        <div className="flex ">
           <div className="w-80 h-screen border border-gray-600">
           
           <RepoFileExplorer/>
           </div>
            {children}
        </div>
    )
}