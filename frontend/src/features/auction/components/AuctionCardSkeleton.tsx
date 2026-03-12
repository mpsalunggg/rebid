import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function AuctionCardSkeleton() {
	return (
		<Card className="overflow-hidden">
			<CardContent>
				<div className="flex items-start gap-3 mb-4">
					<Skeleton className="w-10 h-10 rounded-full" />
					<div className="flex-1">
						<Skeleton className="h-4 w-32 mb-2" />
						<Skeleton className="h-3 w-20" />
					</div>
				</div>
				<Skeleton className="h-12 w-full mb-4" />
				<div className="grid grid-cols-2 grid-rows-2 gap-2 w-full h-24">
					<Skeleton className="row-span-2 rounded-lg" />
					<Skeleton className="rounded-lg h-full" />
					<Skeleton className="rounded-lg h-full" />
				</div>
				<div className="mt-4 space-y-3">
					<Skeleton className="h-16 w-full" />
				</div>
			</CardContent>
		</Card>
	);
}
