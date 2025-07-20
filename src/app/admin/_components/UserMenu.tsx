'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { User, LifeBuoy, LogOut } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import Link from "next/link";

export default function UserMenu({ user }: { user: SupabaseUser }) {
  
  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button
            variant="secondary"
            size="icon"
            className="rounded-full h-8 w-8"
            >
                <User className="h-4 w-4" />
                <span className="sr-only">Toggle user menu</span>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link href="/admin/settings">
                    <LifeBuoy className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                </Link>
            </DropdownMenuItem>
             <DropdownMenuSeparator />
            <form action="/auth/signout" method="post">
                <DropdownMenuItem asChild>
                    <button type="submit" className="w-full text-left">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </button>
                </DropdownMenuItem>
            </form>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}
