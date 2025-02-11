"use client";
import { webContentAction } from "@/actions/web";
import { useActionState } from "react";
import { CheckCircle2, Globe, Loader2, Settings } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";

const initialState: ActionResponse = {
  success: false,
  message: "",
};
export default function WebForm() {
  const [state, action, isPending] = useActionState(
    webContentAction,
    initialState
  );
  return (
    <form
      action={action}
      className="p-8 space-y-8 border rounded-xl"
      autoComplete="on"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-lg font-medium text-primary">
          <Globe className="h-5 w-5" />
          <h3>Add URL</h3>
        </div>
        <Input
          type="text"
          name="url"
          id="url"
          defaultValue={state.input?.url}
          placeholder="https://example.com"
          minLength={5}
          maxLength={100}
          autoComplete="website-url"
          aria-describedby="website-url-error"
          className={state?.errors?.url ? "border-red-500" : ""}
        />
        {state?.errors?.url && (
          <p id="country-error" className="text-sm text-red-500">
            {state.errors.url[0]}
          </p>
        )}
        {state?.message && (
          <Alert variant={state.success ? "default" : "destructive"}>
            <AlertDescription className="flex items-center gap-2">
              {state.success && <CheckCircle2 className="h-4 w-4" />}{" "}
              {state.message.includes("No article content found") ? (
                <div dangerouslySetInnerHTML={{ __html: state.message }} />
              ) : state.message.includes("Missing OpenAI") ||
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
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          "Scrape and Process URL"
        )}
      </Button>
    </form>
  );
}
