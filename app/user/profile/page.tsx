import { auth } from "@/auth";
import { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import ProfileForm from "./profile-form";

export const metadata: Metadata = {
  title: "Customer Profile",
};

/**
 * wrap this server component page with SessionProvider
 * cause there is a client component that will be embedded inside this server component
 * which is the profile form .. and this form will need to access the session through
 * useSession hook and not auth() method used in the server
 *
 * so to use that useSession hook it has to be within that SessionProvider
 */
const ProfilePage = async () => {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <div className="max-w-md  mx-auto space-y-4">
        <h2 className="h2-bold">Profile</h2>
        <ProfileForm />
      </div>
    </SessionProvider>
  );
};

export default ProfilePage;
