"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Unauthorized Access",
};

const UnAuthorizedPage = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <Image
        src="/images/logo.svg"
        height={50}
        width={50}
        alt={`${APP_NAME} logo`}
        priority={true}
      />
      <div className="p-6 w-1/3 shadow-md rounded-lg text-center">
        <h1 className="text-3xl font-bold mb-4">Unauthorized Access</h1>
        <p className="text-md text-destructive mb-4">
          You do not have permission to access this page
        </p>
        <Button asChild>
          <Link href="/">Go to Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default UnAuthorizedPage;
