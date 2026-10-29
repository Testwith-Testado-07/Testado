"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LayoutDashboard, LogOut, UserRound } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/utils/supabase/client";
import { ROLE_LABEL, type DashboardRole } from "./nav-config";
import { useCurrentUser } from "./useCurrentUser";

export function UserMenu({ role }: { role: DashboardRole }) {
  const router = useRouter();
  const user = useCurrentUser();

  const handleSignOut = async () => {
    await createClient().auth.signOut();
    router.push("/auth");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2.5 rounded-full border border-transparent py-1 pr-2.5 pl-1 outline-none transition-colors hover:border-border hover:bg-white focus-visible:ring-4 focus-visible:ring-ring/30 data-[state=open]:border-border data-[state=open]:bg-white">
        <span className="grid size-9 place-items-center rounded-full bg-linear-to-br from-navy to-primary text-xs font-bold text-white shadow-soft">
          {user.initials}
        </span>
        <span className="hidden max-w-40 text-left sm:block">
          <span className="block truncate text-sm font-semibold leading-tight text-foreground">{user.name}</span>
          <span className="block truncate text-xs leading-tight text-muted-foreground">{ROLE_LABEL[role]}</span>
        </span>
        <ChevronDown className="size-4 text-muted-foreground" aria-hidden="true" />
        <span className="sr-only">Open account menu</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <span className="block truncate font-semibold text-foreground">{user.name}</span>
          <span className="block truncate text-xs font-normal text-muted-foreground">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/${role}`}>
              <LayoutDashboard />
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/profile">
              <UserRound />
              Profile
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={handleSignOut}>
          <LogOut />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
