import { Button } from "./ui/button";
import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { SettingsDialog } from "./setting-dialog";
import { getCookie } from "@/lib/cookies";
import WebForm from "./web-form";
import PDFForm from "./pdf-form";
import YtVideoForm from "./yt-video-form";

export default async function UploadDocs() {
  const openAiKey = await getCookie("openAiKey");
  const dbConnectionString = await getCookie("dbConnectionString");
  const tableName = await getCookie("tableName");
  const initialSettings = { openAiKey, dbConnectionString, tableName };
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="xl:text-4xl text-2xl font-bold">Document Upload</h1>
        <div className="flex gap-4">
          <SettingsDialog initialSettings={initialSettings} />
          <Button asChild className="hover:scale-105 transition-transform">
            <Link href="/chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Chat
            </Link>
          </Button>
        </div>
      </div>
      <WebForm />
      <PDFForm />
      <YtVideoForm />
    </div>
  );
}
