"use client";

import { Fragment } from "react";
import { uploadVideo } from "@/lib/firebase/functions";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Video } from "lucide-react";

export default function Upload() {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0);
    if (!file) return;
    await handleUpload(file);
  };

  const handleUpload = async (file: File) => {
    try {
      const respond = await uploadVideo(file);
      alert(`File uploaded successfully: ${JSON.stringify(respond)}`);
    } catch (e) {
      alert(`Failed to upload file: ${e}`);
    }
  };

  return (
    <Fragment>
      <Input
        id="upload"
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <Label htmlFor="upload" className="relative cursor-pointer ">
        <Video className="absolute my-2 border w-8 text-gray-400 hover:text-white border-gray-400 hover:border-white rounded-sm " />
      </Label>
    </Fragment>
  );
}
