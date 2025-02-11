"use server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function setCoockie(name: string, value: string) {
  const cookie = await cookies();
  cookie.set({
    name,
    value,
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
}
export async function getCookie(name: string) {
  const cookie = await cookies();
  const value = cookie.get(name)?.value;

  return value;
}

export async function deleteCookie(name: string) {
  const cookie = await cookies();
  cookie.delete(name);
  revalidatePath("/", "layout");
}
