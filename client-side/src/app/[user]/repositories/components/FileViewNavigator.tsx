"use client";
import React, { useEffect, useState } from "react";
import {
  Trash2,
  Save,
  Download,
  Share2,
  Settings,
  File,
  Menu,
} from "lucide-react";
import { usePathname } from "next/navigation";

const FileViewNavigator = () => {
  const pathName = usePathname();
  const [filename, setFilename] = useState<string>("Document.pdf");
  const prepareFileName = () => {
    const fullPath = pathName.split("/");
    const filteredFileName = fullPath.slice(fullPath.length - 1)[0];
    setFilename(filteredFileName);
  };
  useEffect(() => {
    console.log("File name");
    prepareFileName();
  }, [pathName]);
  return (
    <div className="flex bg-[#0C0D1D] shadow-sm items-center justify-between p-2 border-b border-gray-100">
      <div className="flex items-center gap-3">
        <div className="p-1 bg-blue-50 rounded-lg">
          <File size={18} className="text-blue-500" />
        </div>
        <span className="text-gray-300 text-sm font-medium">{filename}</span>
      </div>

      <div className="flex items-center gap-1">
       

        <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors">
          <Download size={18} />
        </button>

        <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors">
          <Share2 size={18} />
        </button>

        <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors">
          <Settings size={18} />
        </button>

     

      

        <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors">
          <Menu size={18} />
        </button>
      </div>
    </div>
  );
};

export default FileViewNavigator;
