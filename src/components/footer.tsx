import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer className="flex flex-col h-24 w-full items-center justify-center border-t text-sm">
      <p>
        Powered by{" "}
        <Link className="font-bold" href="https://nextjs.org/">
          Next.js
        </Link>
        ,{" "}
        <Link
          className="font-bold"
          href="https://js.langchain.com/docs/introduction/"
        >
          LangChain.js
        </Link>{" "}
        &amp;{" "}
        <Link className="font-bold" href="https://neon.tech/">
          Neon
        </Link>
      </p>
      <div>
        Created by{" "}
        <Link className="font-bold" href="https://github.com/riadhmouamnia">
          Riadh
        </Link>{" "}
        <span>&copy;</span> | {new Date().getFullYear()}
      </div>
    </footer>
  );
}
