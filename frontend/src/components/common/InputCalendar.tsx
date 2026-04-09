"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

function snapMinuteToStep(minute: number, step: number): number {
	if (step <= 1) return minute;
	return Math.floor(minute / step) * step;
}

function mergeCalendarDayKeepTime(
	selected: Date,
	previous: Date | undefined,
	minuteStep: number,
): Date {
	const next = new Date(selected);
	if (previous) {
		next.setHours(
			previous.getHours(),
			snapMinuteToStep(previous.getMinutes(), minuteStep),
			0,
			0,
		);
	} else {
		next.setHours(0, 0, 0, 0);
	}
	return next;
}

function applyHourMinute(base: Date, hour: number, minute: number): Date {
	const next = new Date(base);
	next.setHours(hour, minute, 0, 0);
	return next;
}

function clampHour(n: number): number {
	if (Number.isNaN(n)) return 0;
	return Math.min(23, Math.max(0, Math.trunc(n)));
}

function clampMinute(n: number, step: number): number {
	if (Number.isNaN(n)) return 0;
	const m = Math.min(59, Math.max(0, Math.trunc(n)));
	return snapMinuteToStep(m, step);
}

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) => i);

function pad2(n: number) {
	return String(n).padStart(2, "0");
}

function SearchableTimeCombo({
	disabled,
	label,
	value,
	options,
	onCommit,
	formatLabel,
	searchPlaceholder,
}: {
	disabled?: boolean;
	label: string;
	value: number;
	options: readonly number[];
	onCommit: (n: number) => void;
	formatLabel: (n: number) => string;
	searchPlaceholder: string;
}) {
	const [open, setOpen] = React.useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen} modal={false}>
			<PopoverTrigger asChild>
				<Button
					type="button"
					variant="outline"
					disabled={disabled}
					aria-label={label}
					className={cn(
						"h-9 w-17 justify-between px-2 font-mono text-sm tabular-nums",
					)}
				>
					{formatLabel(value)}
					<ChevronDownIcon className="size-3.5 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-36 p-0" align="start" sideOffset={4}>
				<Command>
					<CommandInput placeholder={searchPlaceholder} className="h-9" />
					<CommandList>
						<CommandEmpty>No match.</CommandEmpty>
						<CommandGroup>
							{options.map((opt) => (
								<CommandItem
									key={opt}
									value={`${opt} ${pad2(opt)}`}
									onSelect={() => {
										onCommit(opt);
										setOpen(false);
									}}
								>
									{formatLabel(opt)}
									<CheckIcon
										className={cn(
											"ml-auto size-4",
											value === opt ? "opacity-100" : "opacity-0",
										)}
									/>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}

interface InputCalendarProps {
	value?: Date;
	onChange?: (date: Date | undefined) => void;
	placeholder?: string;
	className?: string;
	showTime?: boolean;
	minuteStep?: number;
}

export default function InputCalendar({
	value,
	onChange,
	placeholder = "Pick a date",
	className,
	showTime = false,
	minuteStep = 1,
}: InputCalendarProps) {
	const step = Math.max(1, Math.min(60, Math.floor(minuteStep)));
	const minuteOptions = React.useMemo(() => {
		const out: number[] = [];
		for (let m = 0; m < 60; m += step) {
			out.push(m);
		}
		return out;
	}, [step]);

	const handleDateSelect = (selected: Date | undefined) => {
		if (!selected) {
			onChange?.(undefined);
			return;
		}
		onChange?.(mergeCalendarDayKeepTime(selected, value, step));
	};

	const displayHour = value ? value.getHours() : 0;
	const displayMinute = value
		? snapMinuteToStep(value.getMinutes(), step)
		: (minuteOptions[0] ?? 0);

	const commitHour = (hour: number) => {
		const h = clampHour(hour);
		const base = value ?? new Date();
		const minute = value
			? snapMinuteToStep(value.getMinutes(), step)
			: (minuteOptions[0] ?? 0);
		onChange?.(applyHourMinute(base, h, minute));
	};

	const commitMinute = (minute: number) => {
		const m = clampMinute(minute, step);
		const base = value ?? new Date();
		const hour = value ? value.getHours() : 0;
		onChange?.(applyHourMinute(base, hour, m));
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					data-empty={!value}
					className={`w-full justify-between text-left font-normal data-[empty=true]:text-muted-foreground ${className}`}
				>
					{value ? format(value, "PPP p") : <span>{placeholder}</span>}
					<ChevronDownIcon />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className="w-auto min-w-0 p-0 sm:min-w-fit"
				align="start"
			>
				<div className="flex flex-col sm:flex-row sm:items-stretch sm:gap-0">
					<div className="w-fit">
						<Calendar
							mode="single"
							selected={value}
							onSelect={showTime ? handleDateSelect : onChange}
							defaultMonth={value}
						/>
					</div>
					{showTime && (
						<>
							<div
								className="hidden w-px shrink-0 self-stretch bg-border sm:block"
								aria-hidden
							/>
							<div className="flex flex-col justify-center gap-3 border-t border-border p-3 sm:min-w-36 sm:border-t-0">
								<span className="text-muted-foreground text-xs font-medium">
									Time
								</span>
								<div className="flex items-center gap-1.5">
									<SearchableTimeCombo
										disabled={!value}
										label="Hour"
										value={displayHour}
										options={HOUR_OPTIONS}
										onCommit={commitHour}
										formatLabel={pad2}
										searchPlaceholder="Search hour…"
									/>
									<span
										className="text-muted-foreground pb-0.5 text-sm"
										aria-hidden
									>
										:
									</span>
									<SearchableTimeCombo
										disabled={!value}
										label="Minute"
										value={displayMinute}
										options={minuteOptions}
										onCommit={commitMinute}
										formatLabel={pad2}
										searchPlaceholder="Search minute…"
									/>
								</div>
							</div>
						</>
					)}
				</div>
			</PopoverContent>
		</Popover>
	);
}
