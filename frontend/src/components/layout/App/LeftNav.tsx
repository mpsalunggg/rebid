"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
	HomeIcon,
	SearchIcon,
	BellIcon,
	BookmarkIcon,
	UserIcon,
} from "lucide-react";

const items = [
	{ href: "/", label: "Home", icon: HomeIcon },
	{ href: "/explore", label: "Explore", icon: SearchIcon },
	{ href: "/notifications", label: "Notifications", icon: BellIcon },
	{ href: "/bookmarks", label: "Bookmarks", icon: BookmarkIcon },
	{ href: "/profile", label: "Profile", icon: UserIcon },
];

export function LeftNav() {
	const pathname = usePathname();

	return (
		<nav className="rounded-2xl bg-card p-4 shadow-sm ring-1 ring-black/5">
			<ul className="space-y-1">
				{items.map((it) => (
					<li key={it.href}>
						<Link
							className={cn(
								"flex gap-2 items-center rounded-lg px-3 py-2 text-sm hover:bg-primary/10",
								pathname === it.href && "bg-primary/10 text-primary",
							)}
							href={it.href}
						>
							<div className="flex items-center flex-1 gap-2">
								<it.icon />
								{it.label}
							</div>
							{pathname === it.href && (
								<div className="h-6 bg-emerald-400 w-[2px] rounded-full" />
							)}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
}
