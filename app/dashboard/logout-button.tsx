"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="text-sm text-stone-500 hover:text-stone-900 transition-colors"
    >
      Sign out
    </button>
  );
}
