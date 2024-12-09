"use client";
import { scrapeWebContent } from "@/actions/scarepe-web";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import FormStatusButton from "./form-status-button";
import { Globe } from "lucide-react";
import { Input } from "./ui/input";

export default function Url() {
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
      const res = await scrapeWebContent(formData);
      if (res.error) {
        setIsUploading(false);
        throw new Error(res.error.message);
      }
      toast({
        title: url,
        description: "Your document has been uploaded successfully",
      });
      setIsUploading(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was an error uploading your document" + error,
      });
      setIsUploading(false);
    }
  };

  return (
    <form action={handleFileUpload} className="p-8 space-y-8 border rounded-xl">
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-lg font-medium text-primary">
          <Globe className="h-5 w-5" />
          <h3>Add URL</h3>
        </div>
        <Input type="text" name="url" placeholder="https://example.com" />
      </div>
      <FormStatusButton className="w-full" disabled={isUploading}>
        {isUploading ? "Processing..." : "Upload and Process"}
      </FormStatusButton>
    </form>
  );
}
