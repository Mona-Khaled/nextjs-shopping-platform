"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { signInDefaultValues } from "@/lib/constants";
// allows easy submitting to signInWithCredentials action and get response/state back and do what we want with it
import { useActionState } from "react";
// nice to have, adds to user experience, showing form status (loading, spinner on signin button, etc..)
import { useFormStatus } from "react-dom";
// server action
import { signInWithCredentials } from "@/lib/actions/user.acions";
// callbackUrl Redirect
import { useSearchParams } from "next/navigation";

const CredentialsSignInForm = () => {
  // We also want to persist the callback when we submit the form,
  // So we will just pass it as a hidden input in the form.
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [data, action] = useActionState(signInWithCredentials, {
    message: "",
    success: false,
  });

  const SignInButton = () => {
    const { pending } = useFormStatus();
    return (
      <Button disabled={pending} className="w-full" variant="default">
        {pending ? "Signing In..." : "Sign In with credentials"}
      </Button>
    );
  };

  return (
    <form action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-6">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            required
            type="email"
            defaultValue={signInDefaultValues.email}
            autoComplete="email"
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            required
            type="password"
            defaultValue={signInDefaultValues.password}
            autoComplete="current-password"
          />
        </div>
        <div>
          <SignInButton />
        </div>

        {data && !data.success && (
          <div className="text-center text-destructive">{data.message}</div>
        )}

        <div className="text-sm text-center text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link target="_self" className="link" href="/sign-up">
            Sign Up
          </Link>
        </div>
      </div>
    </form>
  );
};

export default CredentialsSignInForm;
