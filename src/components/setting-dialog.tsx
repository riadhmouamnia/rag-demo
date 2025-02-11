"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { useActionState, useState } from "react";
import {
  Key,
  Database,
  Table2,
  Settings,
  Loader2,
  CheckCircle2,
  EyeOff,
  Eye,
} from "lucide-react";
import { integrationSettingsAction } from "@/actions/integration-settings";
import { useToast } from "@/hooks/use-toast";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { deleteCookie } from "@/lib/cookies";
import { Alert, AlertDescription } from "./ui/alert";
import { DialogDescription } from "@radix-ui/react-dialog";

interface SettingsDialogProps {
  initialSettings: {
    openAiKey: string | undefined;
    dbConnectionString: string | undefined;
    tableName: string | undefined;
  };
}

const initialState: ActionResponse = {
  success: false,
  message: "",
};

export function SettingsDialog({ initialSettings }: SettingsDialogProps) {
  const [state, action, isPending] = useActionState(
    integrationSettingsAction,
    initialState
  );
  const { dbConnectionString, openAiKey, tableName } = initialSettings;
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isOpenAiKeyVisible, setIsOpenAiKeyVisible] = useState<boolean>(false);
  const [isDbConnectionStringVisible, setIsDbConnectionStringVisible] =
    useState<boolean>(false);
  const { toast } = useToast();

  const toggleOpenAiKeyVisibility = () =>
    setIsOpenAiKeyVisible((prevState) => !prevState);

  const toggleDbConnectionStringVisibility = () =>
    setIsDbConnectionStringVisible((prevState) => !prevState);

  const handleClearIntegrationSettings = async () => {
    setIsClearing(true);
    try {
      await deleteCookie("openAiKey");
      await deleteCookie("dbConnectionString");
      await deleteCookie("tableName");
      toast({
        title: "Success",
        description: "Integration settings cleared successfully",
      });
      setSettingsOpen(false);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to clear Integration settings. Please try again.",
      });
      return;
    } finally {
      setIsClearing(false);
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
            <DialogTitle className="text-2xl font-bold">
              Integration settings
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              Configure your API and database connection to store embeddings
              seamlessly. Ensure that the details are correct for smooth
              operation.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-6 py-4" action={action}>
            <div className="space-y-2">
              <Label className="flex items-center gap-2" htmlFor="openAiKey">
                <Key className="h-4 w-4" />
                OpenAI API Key<span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  type={isOpenAiKeyVisible ? "text" : "password"}
                  name="openAiKey"
                  id="openAiKey"
                  defaultValue={state.input?.openAiKey || openAiKey}
                  minLength={5}
                  autoComplete="openAiKey"
                  aria-describedby="openAiKey-error"
                  className={state?.errors?.url ? "border-red-500" : ""}
                  placeholder="sk-..."
                />

                <button
                  className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                  type="button"
                  onClick={toggleOpenAiKeyVisibility}
                  aria-label={
                    isOpenAiKeyVisible ? "Hide password" : "Show password"
                  }
                  aria-pressed={isOpenAiKeyVisible}
                  aria-controls="password"
                >
                  {isOpenAiKeyVisible ? (
                    <EyeOff size={16} strokeWidth={2} aria-hidden="true" />
                  ) : (
                    <Eye size={16} strokeWidth={2} aria-hidden="true" />
                  )}
                </button>
              </div>
              {state?.errors?.openAiKey && (
                <p id="country-error" className="text-sm text-red-500">
                  {state.errors.openAiKey[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                className="flex items-center gap-2"
                htmlFor="dbConnectionString"
              >
                <Database className="h-4 w-4" />
                Database Connection String (Neon)
                <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  type={isDbConnectionStringVisible ? "text" : "password"}
                  name="dbConnectionString"
                  id="dbConnectionString"
                  defaultValue={
                    state.input?.dbConnectionString || dbConnectionString
                  }
                  minLength={5}
                  autoComplete="dbConnectionString"
                  aria-describedby="dbConnectionString-error"
                  className={state?.errors?.url ? "border-red-500" : ""}
                  placeholder="postgresql://neondb..."
                />

                <button
                  className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                  type="button"
                  onClick={toggleDbConnectionStringVisibility}
                  aria-label={
                    isDbConnectionStringVisible
                      ? "Hide password"
                      : "Show password"
                  }
                  aria-pressed={isDbConnectionStringVisible}
                  aria-controls="password"
                >
                  {isDbConnectionStringVisible ? (
                    <EyeOff size={16} strokeWidth={2} aria-hidden="true" />
                  ) : (
                    <Eye size={16} strokeWidth={2} aria-hidden="true" />
                  )}
                </button>
              </div>
              {state?.errors?.dbConnectionString && (
                <p id="country-error" className="text-sm text-red-500">
                  {state.errors.dbConnectionString[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2" htmlFor="tableName">
                <Table2 className="h-4 w-4" />
                Table Name
              </Label>
              <Input
                name="tableName"
                id="tableName"
                placeholder="embeddings"
                defaultValue={state.input?.tableName || tableName}
                autoComplete="tableName"
                aria-describedby="tableName-error"
                className={state?.errors?.url ? "border-red-500" : ""}
              />
            </div>

            {state?.message && (
              <Alert variant={state.success ? "default" : "destructive"}>
                <AlertDescription className="flex items-center gap-2">
                  {state.success && <CheckCircle2 className="h-4 w-4" />}{" "}
                  {state.message}
                </AlertDescription>
              </Alert>
            )}

            <Button disabled={isPending} className="w-full">
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Save Integration Settings"
              )}
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="w-full"
              disabled={
                isClearing ||
                initialSettings.openAiKey === undefined ||
                initialSettings.dbConnectionString === undefined ||
                initialSettings.tableName === undefined
              }
              onClick={handleClearIntegrationSettings}
            >
              {isClearing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Clear Integration Settings"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
