"use client";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FetchFileContent, FileContentResponse } from "./api";
import useUserStore from "@/state/user_info_state";
import LoadingState from "@/app/components/LoadingState";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import useProfileStore from "@/state/profileStore";
export default function Post() {
  const params=useParams()
  const repo=params.user
  const dynamicParams: string[] = Array.isArray(params?.params) ? params.params : [];


  const { profileInfo } = useProfileStore();
  const [fileRender, setFileRenderer] = useState<FileContentResponse>();

  useEffect(() => {
    const RenderFileContent = async () => {
      // Only proceed if storageID exists
      if (!profileInfo?.user.folder_ref) {
        console.log("StorageID not loaded yet, waiting...");
        return;
      }
     
      const filePath=`${repo}/${dynamicParams.join("/")}`
  
      const file_path = `${profileInfo.user.folder_ref}/${filePath}`;
      console.log(file_path)
      const contentBody = await FetchFileContent(file_path);

      if (!contentBody) {
        console.log("No file content");
        return;
      }
      setFileRenderer(contentBody);
    };

    RenderFileContent()
  }, [profileInfo]);
  if (!fileRender) {
    return <LoadingState />;
  }
  return (
    <>
      {fileRender && (
        <div className="w-full h-full">
          <SyntaxHighlighter
            language="java"
            style={vscDarkPlus}
            wrapLongLines
            customStyle={{
              height: "100%",
              width: "100%",
              margin: 0,
            }}
            codeTagProps={{
              style: { fontSize: "0.9rem" },
            }}
            showLineNumbers
          >
            {fileRender.message.content}
          </SyntaxHighlighter>
        </div>
      )}
    </>
  );
}