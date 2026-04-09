export const AUCTION_WS_CHANGE_ENDED = 'auction_ended'

export function getStatusColor(status: string) {
	switch (status) {
		case "ACTIVE":
			return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
		case "SCHEDULED":
			return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
		case "ENDED":
			return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
		case "CANCELLED":
			return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
		default:
			return "bg-gray-100 text-gray-800";
	}
}
