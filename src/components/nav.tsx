import Link from "next/link";
import { ModeToggle } from "./mode-toggle";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-4 border-b">
      <p className="font-bold">RAG Demo App</p>
      <div className="flex items-center gap-4">
        <Link href="/" className="font-bold hover:underline">
          Home
        </Link>
        <ModeToggle />
      </div>
    </nav>
  );
}
