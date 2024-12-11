"use client";
import pdfToText from "react-pdftotext";
import { useDropzone } from "react-dropzone";
import { useToast } from "@/hooks/use-toast";
import { useCallback, useState } from "react";
import FormStatusButton from "./form-status-button";
import { Input } from "./ui/input";
import { FileUp } from "lucide-react";
import { generateEmbeddings } from "@/actions/generate-embeddings";

export default function PDF() {
  const [file, setFile] = useState<FileType>();
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const acceptedFile = acceptedFiles[0];
    const fileName = acceptedFile.name;
    const textContent = await pdfToText(acceptedFile);
    setFile({ name: fileName, textContent: textContent });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "text/pdf": [".pdf"] },
    multiple: false,
  });

  const handlePdfUpload = async () => {
    setIsUploading(true);
    console.log(file);
    if (!file) {
      setIsUploading(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: "PDF file is required",
      });
      return;
    }
    try {
      console.log(file.textContent);
      const embeddingsRes = await generateEmbeddings(file.textContent, {
        source: "pdf",
        fileName: file.name,
      });

      if (embeddingsRes?.error) {
        setIsUploading(false);
        throw new Error(embeddingsRes.error.message);
      }
      toast({
        title: "Success",
        description: `embeddings generated successfully for ${file.name}`,
      });
      setIsUploading(false);
      setFile(undefined);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was an error uploading your document" + error,
      });
      setIsUploading(false);
      setFile(undefined);
    }
  };

  return (
    <form action={handlePdfUpload} className="p-8 space-y-8 border rounded-xl">
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-lg font-medium text-primary">
          <FileUp className="h-5 w-5" />
          <h3>Upload PDF</h3>
        </div>
        <div
          {...getRootProps()}
          className="w-full p-6 border-2 border-dashed rounded-lg cursor-pointer focus:outline-none"
        >
          {file?.name ? (
            <p>{file.name}</p>
          ) : (
            <>
              <Input {...getInputProps()} name="pdf" />
              <p className="text-gray-500">
                Drag & drop a PDF file here, or click to select a file
              </p>
            </>
          )}
          {isUploading ? (
            <div className="bg-blue-100 border-blue-300 rounded-lg p-2">
              <p className="text-sm">Uploading...</p>
            </div>
          ) : null}
        </div>
      </div>
      <FormStatusButton className="w-full" disabled={isUploading}>
        {isUploading ? "Processing..." : "Upload and Process"}
      </FormStatusButton>
    </form>
  );
}
