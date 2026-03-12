"use client";
import { UserIcon, LogOutIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogoutMutation } from "@/features/auth/auth.api";
import { useRouter } from "next/navigation";

const listItems = [
	{
		icon: UserIcon,
		property: "Profile",
	},
	{
		icon: LogOutIcon,
		property: "Sign Out",
	},
];

export default function AvatarProfile() {
	const router = useRouter();
	const [logout] = useLogoutMutation();
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="secondary"
					size="icon"
					className="overflow-hidden w-9 h-9 rounded-full"
				>
					<img
						src="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png"
						alt="Hallie Richards"
					/>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end">
				<DropdownMenuLabel>My Account</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					{listItems.map((item, index) => (
						<DropdownMenuItem
							key={index}
							onClick={async () => {
								if (item.property === "Sign Out") {
									await logout().unwrap();
									router.push("/login");
								}
							}}
						>
							<item.icon />
							<span className="text-popover-foreground">{item.property}</span>
						</DropdownMenuItem>
					))}
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
