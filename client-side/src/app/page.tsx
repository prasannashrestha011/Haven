import { Index } from "./index";

export default function Home() {
  return (
    <div
      className="
  relative min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#0f0c29] overflow-hidden  "
    >
      <Index />
      <div className="absolute bottom-[-120px] right-[-120px] w-[400px] h-[400px] bg-purple-900 opacity-40 rounded-full filter blur-3xl"></div>
      <div className="absolute top-[50%] left-[50%] w-[300px] h-[300px] bg-indigo-800 opacity-30 rounded-full filter blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute top-[-120px] left-[-120px] w-[400px] h-[400px] bg-blue-900 opacity-40 rounded-full filter blur-3xl"></div>
    </div>
  );
}
