"use server";

import { setCoockie } from "@/lib/cookies";
import { z } from "zod";

const integrationSettingsSchema = z.object({
  openAiKey: z.string().min(1, "OpenAI API Key is required").startsWith("sk-", {
    message: "Invalid OpenAI API Key format, the string must start with 'sk-'.",
  }),
  dbConnectionString: z
    .string()
    .min(1, "Database Connection String is required")
    .startsWith("postgresql://neondb", {
      message:
        "Invalid Neon database connection string format, the string must start with 'postgresql://neondb'.",
    }),
  tableName: z.string().optional(),
});

export async function integrationSettingsAction(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const rawData: IntegrationFormData = {
      openAiKey: formData.get("openAiKey") as string,
      dbConnectionString: formData.get("dbConnectionString") as string,
      tableName: formData.get("tableName") as string,
    };

    const validatedData = integrationSettingsSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        message: "Please fix the errors in the form",
        errors: validatedData.error.flatten().fieldErrors,
        input: rawData,
      };
    }

    await setCoockie("openAiKey", validatedData.data.openAiKey);
    await setCoockie(
      "dbConnectionString",
      validatedData.data.dbConnectionString
    );
    await setCoockie("tableName", validatedData.data.tableName || "embeddings");
    return {
      success: true,
      message: "Integration settings saved successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to save integration settings. Please try again." + error,
    };
  }
}
