"use client";

import { User } from "firebase/auth";
import { Button } from "./ui/Button";
import { signInWithGoogle, signOut } from "@/lib/firebase/firebase";

interface SignInProps {
  user: User | null;
}

export function SignIn({ user }: SignInProps) {
  return (
    <>
      {user ? (
        <Button onClick={signOut}>Sign Out</Button>
      ) : (
        <Button onClick={signInWithGoogle}>Sign In</Button>
      )}
    </>
  );
}
