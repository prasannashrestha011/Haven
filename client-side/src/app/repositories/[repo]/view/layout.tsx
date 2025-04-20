import RepoFileExplorer from "./[...params]/clientContent";



export default function RepoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex file bg-[#0C0D1D] h-screen text-slate-300  ">
        <div className="w-96 h-screen overflow-y-scroll">
        <RepoFileExplorer/>
        </div>
        {children}
      </div>
    </div>
  );
}
