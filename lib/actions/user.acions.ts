"use server";

import { signIn, signOut } from "@/auth";
import { signInFormSchema, signUpFormSchema } from "../validators";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hashSync } from "bcrypt-ts-edge"; // we must hash passwords when signing up
import { prisma } from "@/db/prisma";
import { formatError } from "../utils";

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

    // return { success: false, message: "Invalid email or password" };
    return { success: false, message: formatError(error) };
  }
}

// Sign user out
export async function signOutUser() {
  await signOut();
}

// Sign user up .. since we are using useActionState hook , then 1st arg will always be prevState
export async function signUpUser(prevState: unknown, formData: FormData) {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    // catch password before hashing it to use it for signin in later
    const plainPassword = user.password;

    // hash the password before saving in the db
    user.password = hashSync(user.password, 10);

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });

    // sign in after user creation
    await signIn("credentials", {
      email: user.email,
      password: plainPassword,
    });

    return { success: true, message: "User registered successfully" };
  } catch (error) {
    // console.log(error.name);
    // console.log(error.code);
    // console.log(error.errors);
    // console.log(error.meta?.target);

    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: formatError(error) };
  }
}
