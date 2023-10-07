"use client";
import Image from "next/image";
import Link from "next/link";
import { SignIn } from "./SignIn";
import { onAuthStateChangedHelper } from "@/lib/firebase/firebase";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import Upload from "./Upload";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChangedHelper((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="container flex text-center justify-between py-2">
      <Link href="/">
        <Image src="/yt-logo.svg" alt="logo" width="60" height="60" />
      </Link>
      <div className="flex justify-between w-36">
        {user && <Upload />}
        <SignIn user={user} />
      </div>
    </div>
  );
}
