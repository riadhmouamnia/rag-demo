import Link from "next/link";
import { ModeToggle } from "./mode-toggle";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-4 border-b">
      <div>RAG</div>
      <div className="flex items-center gap-4">
        <Link href="/">Home</Link>
        <ModeToggle />
      </div>
    </nav>
  );
}
