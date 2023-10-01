import Image from "next/image";
import Link from "next/link";
import { SignIn } from "./SignIn";

export default function Navbar() {
  return (
    <div className="container flex text-center justify-between py-2">
      <Link href="/">
        <Image src="/yt-logo.svg" alt="logo" width="60" height="60" />
      </Link>
      <div className="flex gap-2">
        <SignIn />
      </div>
    </div>
  );
}
