"use client";

import React, { useEffect, useState } from "react";
import { Particles } from "../ui/particles";
import { useTheme } from "next-themes";

export default function ParticleLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { resolvedTheme } = useTheme();
	const [color, setColor] = useState("#ffffff");

	useEffect(() => {
		setColor(resolvedTheme === "dark" ? "#ffffff" : "#56a836");
	}, [resolvedTheme]);

	return (
		<section className="bg-gray-100 dark:bg-secondary/10 relative overflow flex h-full w-full flex-col items-center justify-center">
			<Particles
				className="fixed inset-0 z-0 h-full"
				ease={20}
				quantity={250}
				color={color}
				size={0.7}
				refresh
			/>
			{children}
		</section>
	);
}
