"use server";
import z from "zod";
import { ActionResponse, signInSchema } from "@/lib/validations";
import { signIn } from "@/auth";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";

type loginFields = z.infer<typeof signInSchema>;

export async function login(data: loginFields): Promise<ActionResponse | void> {
  const validatedFields = signInSchema.safeParse(data);
  if (!validatedFields.success) {
    return {
      error: validatedFields.error.issues[0].message,
    };
  }
  const { email, password } = validatedFields.data;
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Невірний email або пароль" };
        default:
          return { error: "Щось пішло не так" };
      }
    }
    throw error;
  }
  redirect("/admin");
}
