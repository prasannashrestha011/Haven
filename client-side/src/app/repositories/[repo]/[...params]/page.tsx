"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FetchFileContent, FileContentResponse } from "./api";
import useUserStore from "@/state/user_info_state";
import LoadingState from "@/app/components/LoadingState";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
export default function Post() {
  const pathName = usePathname();
  const filePath = pathName.split("/").slice(2).join("/");
  const { userInfo } = useUserStore();
  const [fileRender, setFileRenderer] = useState<FileContentResponse>();

  useEffect(() => {
    const RenderFileContent = async () => {
      // Only proceed if storageID exists
      if (!userInfo?.storageID) {
        console.log("StorageID not loaded yet, waiting...");
        return;
      }
      const file_path = `/users/${userInfo.storageID}/${filePath}`;

      const contentBody = await FetchFileContent(file_path);

      if (!contentBody) {
        console.log("No file content");
        return;
      }
      setFileRenderer(contentBody);
    };

    RenderFileContent();
  }, [userInfo, filePath]);
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
