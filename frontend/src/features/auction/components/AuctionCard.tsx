import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import type { Auction } from "@/features/auction/auction.type";
import { formatTimeAgo } from "@/utils/time";
import BentoGridImages from "./BentoGridImages";
import { formatPrice } from "@/utils/price";
import { getStatusColor } from "@/features/auction/auction.constant";

export default function AuctionCard({ auction }: { auction: Auction }) {
	const priceDelta = auction.current_price - auction.starting_price;

	return (
		<Card className="overflow-hidden">
			<CardContent>
				<div className="flex items-start justify-between mb-4">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-primary/80 flex items-center justify-center text-white font-semibold">
							{auction?.user?.name?.charAt(0).toUpperCase() || "U"}
						</div>
						<div>
							<div className="flex items-center gap-2">
								<span className="font-semibold text-sm">
									{auction?.user?.name || "User"}
								</span>
								<span className="text-xs text-muted-foreground">
									{formatTimeAgo(auction.created_at)}
								</span>
							</div>
							<span
								className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(auction.status)}`}
							>
								{auction.status}
							</span>
						</div>
					</div>
				</div>

				<p className="text-sm mb-4 text-foreground">
					{auction.item.description}
				</p>

				<BentoGridImages images={auction.item.images} />

				<div className="mt-4 p-4 bg-muted/50 rounded-lg">
					<div className="flex items-center justify-between">
						<div>
							<div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
								Current Bid
							</div>
							<div className="flex items-baseline gap-2">
								<span className="text-2xl font-bold">
									{formatPrice(auction.current_price)}
								</span>
								{priceDelta > 0 && (
									<span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
										▲ {formatPrice(priceDelta)}
									</span>
								)}
							</div>
						</div>
						<div className="flex items-center gap-3">
							{auction.current_bidder_id && (
								<div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
									<div className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
									Live bidder
								</div>
							)}
							<Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
								Bid Now
							</Button>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
