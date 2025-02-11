"use client";
import pdfToText from "react-pdftotext";
import { useDropzone } from "react-dropzone";
import { useCallback, useState } from "react";
import { Input } from "./ui/input";
import { CheckCircle2, FileUp, Loader2, Settings } from "lucide-react";
import { generateEmbeddings } from "@/actions/generate-embeddings";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";

export default function PDFForm() {
  const [file, setFile] = useState<FileType | null>(null);
  const [state, setState] = useState<ActionResponse>({
    success: false,
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setState({
      success: false,
      message: "",
    });
    const acceptedFile = acceptedFiles[0];
    const fileName = acceptedFile.name;
    const textContent = await pdfToText(acceptedFile);
    setFile({ name: fileName, textContent: textContent });
  }, []);

  const { getRootProps, getInputProps, isDragActive, isFocused } = useDropzone({
    onDrop,
    accept: { "text/pdf": [".pdf"] },
    multiple: false,
  });

  const handlePdfUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!file) {
        setState({
          success: false,
          message: "Please upload a PDF file first",
        });
        return;
      }
      console.log(file.textContent);
      const response = await generateEmbeddings(file.textContent, {
        source: "pdf",
        fileName: file.name,
      });
      setState(response);
    } catch (error) {
      setState({
        success: false,
        message: "Failed to generate embeddings: " + error,
      });
    } finally {
      setLoading(false);
      setFile(null);
    }
  };

  return (
    <form
      onSubmit={handlePdfUpload}
      className="p-8 space-y-8 border rounded-xl"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-lg font-medium text-primary">
          <FileUp className="h-5 w-5" />
          <h3>Upload PDF</h3>
        </div>
        <div
          {...getRootProps()}
          className={`${
            isFocused || isDragActive ? "border-green-500" : ""
          } w-full p-6 border-2 border-dashed rounded-lg cursor-pointer focus:outline-none`}
        >
          {file?.name ? (
            <p>{file.name}</p>
          ) : (
            <>
              <Input {...getInputProps()} name="pdf" />
              {isDragActive ? (
                <p className="text-gray-500">Drop the files here ...</p>
              ) : (
                <p className="text-gray-500">
                  Drag & drop a PDF file here, or click to select a file
                </p>
              )}
            </>
          )}
        </div>
        {state?.message && (
          <Alert variant={state.success ? "default" : "destructive"}>
            <AlertDescription className="flex items-center gap-2">
              {state.success && <CheckCircle2 className="h-4 w-4" />}{" "}
              {state.message.includes("Missing OpenAI") ||
              state.message.includes("Missing Database") ? (
                <div>
                  {state.message} <br />
                  to add yours click on the gear icon{" "}
                  <Settings className="h-4 w-4 inline" /> in the top right
                  corner.
                </div>
              ) : (
                state.message
              )}
            </AlertDescription>
          </Alert>
        )}
      </div>
      <Button className="w-full" disabled={loading}>
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          "Upload and Process PDF"
        )}
      </Button>
    </form>
  );
}
