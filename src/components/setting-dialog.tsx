"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { useState } from "react";
import { Key, Database, Table2, Settings, Loader2 } from "lucide-react";
import FormStatusButton from "./form-status-button";
import { saveCredentials } from "@/actions/save-credentials";
import { useToast } from "@/hooks/use-toast";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { deleteCookie } from "@/lib/cookies";

interface SettingsDialogProps {
  initialSettings: {
    openAiKey: string | undefined;
    dbConnectionString: string | undefined;
    tableName: string | undefined;
  };
}

export function SettingsDialog({ initialSettings }: SettingsDialogProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [openAiKey, setOpenAiKey] = useState(initialSettings.openAiKey || "");
  const [dbConnectionString, setDbConnectionString] = useState(
    initialSettings.dbConnectionString || ""
  );
  const [tableName, setTableName] = useState(initialSettings.tableName || "");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { toast } = useToast();

  const handleSave = async (formData: FormData) => {
    setIsSaving(true);
    try {
      const res = await saveCredentials(formData);
      if (res.error) {
        throw new Error(res.error.message);
      }
      toast({
        title: "Success",
        description: "Credentials saved successfully",
      });
      setSettingsOpen(false);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to save credentials. Please try again.",
      });
      return;
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearCredentials = async () => {
    setIsSaving(true);
    try {
      await deleteCookie("openAiKey");
      await deleteCookie("dbConnectionString");
      await deleteCookie("tableName");
      toast({
        title: "Success",
        description: "Credentials cleared successfully",
      });
      setSettingsOpen(false);
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to clear credentials. Please try again.",
      });
      return;
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setSettingsOpen(true)}
        className="hover:scale-105 transition-transform"
      >
        <Settings className="h-4 w-4" />
      </Button>
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className=" border-primary/20 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Settings</DialogTitle>
          </DialogHeader>
          <form className="space-y-6 py-4" action={handleSave}>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                OpenAI API Key
              </Label>
              <Input
                type="password"
                name="openAiKey"
                value={openAiKey}
                onChange={(e) => setOpenAiKey(e.target.value)}
                placeholder="sk-..."
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Database Connection String
              </Label>
              <Input
                type="password"
                name="dbConnectionString"
                value={dbConnectionString}
                onChange={(e) => setDbConnectionString(e.target.value)}
                placeholder="postgresql://..."
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Table2 className="h-4 w-4" />
                Table Name
              </Label>
              <Input
                value={tableName}
                name="tableName"
                onChange={(e) => setTableName(e.target.value)}
                placeholder="embeddings"
              />
            </div>

            <FormStatusButton
              disabled={
                !openAiKey || !dbConnectionString || !tableName || isSaving
              }
              className="w-full"
            >
              {isSaving ? "Saving..." : "Save Settings"}
            </FormStatusButton>
            <Button
              type="button"
              variant="destructive"
              className="w-full"
              disabled={
                isSaving ||
                initialSettings.openAiKey === undefined ||
                initialSettings.dbConnectionString === undefined ||
                initialSettings.tableName === undefined
              }
              onClick={handleClearCredentials}
            >
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Clear Credentials"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
