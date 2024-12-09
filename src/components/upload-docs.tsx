import { Button } from "./ui/button";
import { Settings, MessageSquare } from "lucide-react";
import Link from "next/link";
import Url from "./url";

export default function UploadDocs() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Document Upload</h1>
        <div className="flex gap-4">
          <Button
            variant="outline"
            size="icon"
            className="hover:scale-105 transition-transform"
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button asChild className="hover:scale-105 transition-transform">
            <Link href="/chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Chat
            </Link>
          </Button>
        </div>
      </div>
      <Url />
    </div>
  );
}
