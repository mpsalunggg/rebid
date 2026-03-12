"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { closeDialog } from "@/store/dialog.slice";
import {
	createAuctionSchema,
	type CreateAuctionFormData,
} from "../auction.schema";
import {
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InputCalendar from "@/components/common/InputCalendar";

export default function CreateAuctionDialog() {
	const dispatch = useDispatch();

	const {
		register,
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<CreateAuctionFormData>({
		resolver: zodResolver(createAuctionSchema),
		defaultValues: {
			status: "SCHEDULED",
		},
	});

	const onSubmit = async (data: CreateAuctionFormData) => {
		console.log("Form data", data);
		dispatch(closeDialog());
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<DialogHeader>
				<DialogTitle>Create New Auction</DialogTitle>
				<DialogDescription>
					List your item for auction. Fill in the details below.
				</DialogDescription>
			</DialogHeader>

			<div className="space-y-4 py-4">
				<div className="space-y-2">
					<Label htmlFor="item-name">Item Name</Label>
					<Input
						id="item-name"
						placeholder="e.g., Vintage Camera"
						{...register("itemName")}
					/>
					{errors.itemName && (
						<p className="text-sm text-red-500">{errors.itemName.message}</p>
					)}
				</div>

				<div className="space-y-2">
					<Label htmlFor="description">Description</Label>
					<textarea
						id="description"
						placeholder="Describe your item..."
						className="w-full min-h-24 px-3 py-2 text-sm rounded-md border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
						{...register("description")}
					/>
					{errors.description && (
						<p className="text-sm text-red-500">{errors.description.message}</p>
					)}
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="starting-price">Starting Price</Label>
						<Input
							id="starting-price"
							type="number"
							placeholder="10000"
							{...register("startingPrice", { valueAsNumber: true })}
						/>
						{errors.startingPrice && (
							<p className="text-sm text-red-500">
								{errors.startingPrice.message}
							</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="status">Status</Label>
						<select
							id="status"
							className="w-full h-10 px-3 py-2 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
							{...register("status")}
						>
							<option value="SCHEDULED">Scheduled</option>
							<option value="ACTIVE">Active</option>
						</select>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label>Start Time</Label>
						<Controller
							control={control}
							name="startTime"
							render={({ field }) => (
								<InputCalendar
									value={field.value}
									onChange={field.onChange}
									placeholder="Pick start time"
								/>
							)}
						/>
						{errors.startTime && (
							<p className="text-sm text-red-500">{errors.startTime.message}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label>End Time</Label>
						<Controller
							control={control}
							name="endTime"
							render={({ field }) => (
								<InputCalendar
									value={field.value}
									onChange={field.onChange}
									placeholder="Pick end time"
								/>
							)}
						/>
						{errors.endTime && (
							<p className="text-sm text-red-500">{errors.endTime.message}</p>
						)}
					</div>
				</div>
			</div>

			<DialogFooter>
				<Button
					type="button"
					variant="outline"
					onClick={() => dispatch(closeDialog())}
				>
					Cancel
				</Button>
				<Button
					type="submit"
					className="bg-emerald-600 hover:bg-emerald-700"
					disabled={isSubmitting}
				>
					{isSubmitting ? "Creating..." : "Create Auction"}
				</Button>
			</DialogFooter>
		</form>
	);
}
