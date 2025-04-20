import RepoFileExplorer from "./view/[...params]/clientContent";


export default function RepoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
     
        
        {children}
 
    </div>
  );
}
