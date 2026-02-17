"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { Button } from "@/components/ui/button";
import { LogOut, Loader2, ShieldCheck } from "lucide-react";

export function AdminHeader() {
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
      window.location.href = "/admin/login";
    } catch {
      setLoggingOut(false);
    }
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-semibold">Admin</h1>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          disabled={loggingOut}
        >
          {loggingOut ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Abmelden...
            </>
          ) : (
            <>
              <LogOut className="mr-2 h-4 w-4" />
              Abmelden
            </>
          )}
        </Button>
      </div>
    </header>
  );
}
