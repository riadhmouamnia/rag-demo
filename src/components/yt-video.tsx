"use client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import FormStatusButton from "./form-status-button";
import { Youtube } from "lucide-react";
import { Input } from "./ui/input";
import { transcriptYoutubeVideo } from "@/actions/transcript-yt-video";
import { generateEmbeddings } from "@/actions/generate-embeddings";

export default function YtVideo() {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (formData: FormData) => {
    setIsUploading(true);
    const url = formData.get("url") as string;
    if (!url) {
      setIsUploading(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: "URL is required",
      });
      return;
    }
    try {
      const res = await transcriptYoutubeVideo(url);
      if (res.error) {
        setIsUploading(false);
        throw new Error(res.error.message);
      }
      const videoId = url.split("v=")[1].split("&")[0];
      const embeddingsRes = await generateEmbeddings(res.data.content.text, {
        videoId,
        source: "youtube",
      });
      if (embeddingsRes?.error) {
        setIsUploading(false);
        throw new Error(embeddingsRes.error.message);
      }
      toast({
        title: "Success",
        description:
          "embeddings generated successfully for video id:" + videoId,
      });
      setIsUploading(false);
      console.log(res.data.content.text);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was an error transcripting your video" + error,
      });
      setIsUploading(false);
    }
  };

  return (
    <form action={handleFileUpload} className="p-8 space-y-8 border rounded-xl">
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-lg font-medium text-primary">
          <Youtube className="h-5 w-5" />
          <h3>YouTube URL</h3>
        </div>
        <Input
          type="text"
          name="url"
          placeholder="https://youtube.com/watch?v="
        />
      </div>
      <FormStatusButton className="w-full" disabled={isUploading}>
        {isUploading ? "Processing..." : "Process Video"}
      </FormStatusButton>
    </form>
  );
}
