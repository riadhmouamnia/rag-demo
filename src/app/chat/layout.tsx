import { SettingsDialog } from "@/components/setting-dialog";
import { Button } from "@/components/ui/button";
import { getCookie } from "@/lib/cookies";
import { Upload } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Chat",
  description: "Chat with your Documents",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const openAiKey = await getCookie("openAiKey");
  const dbConnectionString = await getCookie("dbConnectionString");
  const tableName = await getCookie("tableName");
  const initialSettings = { openAiKey, dbConnectionString, tableName };
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Chat with Documents</h1>
          <div className="flex gap-4">
            <SettingsDialog initialSettings={initialSettings} />
            <Button asChild className="hover:scale-105 transition-transform">
              <Link href="/" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload
              </Link>
            </Button>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
