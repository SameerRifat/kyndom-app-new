"use client";
import { Button } from "@/components/ui/button";
import { useUploadThing } from "@/lib/uploadthing/utils";
import { api } from "@/trpc/react";
import { CameraIcon, Loader2Icon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { generateClientDropzoneAccept } from "uploadthing/client";

const UpdateProfileImage = () => {
  const user = api.user.me.useQuery();

  const [file, setFile] = useState<File>();
  const onDrop = useCallback((acceptedFile: File[]) => {
    setFile(acceptedFile[0]);
  }, []);

  const { startUpload, isUploading, permittedFileInfo } = useUploadThing(
    "profileImageUploader",
    {
      onClientUploadComplete: () => {},
      onUploadBegin: () => {},
    },
  );

  const fileTypes = permittedFileInfo?.config
    ? Object.keys(permittedFileInfo.config)
    : [];

  const { getRootProps, open } = useDropzone({
    onDrop,
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
  });

  useEffect(() => {
    if (!file) return;
    startUpload([file]);
  }, [file]);

  return (
    <div className="flex flex-col gap-y-8">
      <div
        className="h-32 w-32 select-none rounded-full border border-border bg-cover"
        style={{
          backgroundImage: `url(${user.data?.image ?? "/img/user.png"})`,
        }}
        {...getRootProps()}
      >
        <div className="relative">
          <div className="absolute right-0 top-24">
            <Button
              className="rounded-3xl"
              size="icon"
              disabled={isUploading}
              onClick={() => open()}
            >
              <CameraIcon size={19} />
            </Button>
          </div>
        </div>
      </div>
      {isUploading && (
        <div className="flex gap-x-3">
          <div className="animate-spin">
            <Loader2Icon />
          </div>
          <div>Uploading...</div>
        </div>
      )}
    </div>
  );
};

export default UpdateProfileImage;
