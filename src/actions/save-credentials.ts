/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { setCoockie } from "@/lib/cookies";

export async function saveCredentials(formData: FormData) {
  const openAiKey = formData.get("openAiKey");
  const dbConnectionString = formData.get("dbConnectionString");
  const tableName = formData.get("tableName");

  if (!openAiKey || !dbConnectionString || !tableName) {
    return { error: { message: "Missing credentials" } };
  }
  console.log({ openAiKey, dbConnectionString, tableName });

  try {
    await setCoockie("openAiKey", openAiKey.toString());
    await setCoockie("dbConnectionString", dbConnectionString.toString());
    await setCoockie("tableName", tableName.toString());
    return { success: true };
  } catch (error: Error | any) {
    return { error: { message: error.message } };
  }
}
