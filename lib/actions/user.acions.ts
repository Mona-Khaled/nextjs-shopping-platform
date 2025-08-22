"use server";

import { signIn, signOut } from "@/auth";
import { signInFormSchema } from "../validators";
import { isRedirectError } from "next/dist/client/components/redirect-error";

// sign in the user with credentials
export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    await signIn("credentials", user);

    // obj below is the action state. (useActionState)
    return { success: true, message: "Signed in successfully" };
  } catch (error) {
    /**
     *  If there is an error, we'll check if it is a "redirect error,"
     *  which is thrown internally by NextAuth's redirect() function.
     *  If it's a redirect error, the function rethrows it so Next.js can handle the redirection.
     */
    if (isRedirectError(error)) {
      throw error; // let next handle redirection
    }

    return { success: false, message: "Invalid email or password" };
  }
}

export async function signOutUser() {
  await signOut();
}
