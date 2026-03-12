"use client";

import { useGetAuctionsQuery } from "@/features/auction/auction.api";
import { Card, CardContent } from "@/components/ui/card";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store";
import { Input } from "@/components/ui/input";
import EmptyAuctionState from "@/features/auction/components/EmptyAuctionState";
import AuctionCardSkeleton from "@/features/auction/components/AuctionCardSkeleton";
import AuctionCard from "@/features/auction/components/AuctionCard";
import AppDialog from "@/components/common/AppDialog";
import CreateAuctionDialog from "@/features/auction/components/CreateAuctionDialog";
import { openDialog } from "@/store/dialog.slice";
import { useCallback } from "react";

export default function HomePage() {
	const dispatch = useDispatch();
	const { data, isLoading, error } = useGetAuctionsQuery();
	const { user } = useSelector((state: RootState) => state.auth);

	const openCreateAuctionDialog = useCallback(() => {
		dispatch(
			openDialog({
				id: "create-auction",
				component: <CreateAuctionDialog />,
				maxWidth: "max-w-2xl",
			}),
		);
	}, [dispatch]);

	return (
		<section className="">
			<Card className="mb-6">
				<CardContent>
					<div className="flex items-start gap-3">
						<div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-semibold shrink-0">
							{user?.name?.charAt(0).toUpperCase() || "U"}
						</div>
						<div className="flex-1">
							<Input
								placeholder="Create new auction"
								onClick={openCreateAuctionDialog}
								readOnly
								className="cursor-pointer"
							/>
						</div>
					</div>
				</CardContent>
			</Card>

			{error && (
				<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-800 dark:text-red-200 mb-6">
					<p className="font-medium">
						{error.message || "Failed to load auctions"}{" "}
					</p>
					<p className="text-sm mt-1">
						{"status" in error && error.status === 401
							? "Please login to continue"
							: "Please try again later"}
					</p>
				</div>
			)}

			{isLoading ? (
				<div className="space-y-6">
					<AuctionCardSkeleton />
					<AuctionCardSkeleton />
					<AuctionCardSkeleton />
				</div>
			) : (
				<>
					{data?.data && data.data.length > 0 ? (
						<div className="space-y-6">
							{data.data.map((auction) => (
								<AuctionCard key={auction.id} auction={auction} />
							))}
						</div>
					) : (
						<EmptyAuctionState />
					)}
				</>
			)}

			<AppDialog />
		</section>
	);
}
