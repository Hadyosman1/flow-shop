import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import ky from "ky";

export interface MediaAttachment {
  id: string;
  file: File;
  url?: string;
  state: "uploading" | "uploaded" | "failed";
}

const useMediaUpload = () => {
  const { toast } = useToast();

  const [attachments, setAttachments] = useState<MediaAttachment[]>([]);

  async function startUpload(file: File) {
    const id = crypto.randomUUID();
    setAttachments((prev) => [...prev, { id, file, state: "uploading" }]);

    try {
      const { uploadUrl } = await ky
        .get(`/api/review-media-upload`, {
          timeout: false,
          searchParams: {
            fileName: file.name,
            mimeType: file.type,
          },
        })
        .json<{ uploadUrl: string }>();

      const {
        file: { url },
      } = await ky
        .put(uploadUrl, {
          timeout: false,
          body: file,
          headers: {
            "Content-Type": "application/octet-stream",
          },
          searchParams: { filename: file.name },
        })
        .json<{ file: { url: string } }>();

      setAttachments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, state: "uploaded", url } : a)),
      );
    } catch (error) {
      console.error(error);

      setAttachments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, state: "failed" } : a)),
      );

      toast({
        variant: "destructive",
        title: "Error uploading media",
        description: "Please try again later",
      });
    }
  }

  function removeAttachment(id: string) {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  }

  function clearAttachments() {
    setAttachments([]);
  }

  return {
    attachments,
    removeAttachment,
    startUpload,
    clearAttachments,
  };
};

export default useMediaUpload;
