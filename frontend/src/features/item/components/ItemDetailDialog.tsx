"use client";

import {
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarIcon, RefreshCwIcon, ImageIcon } from "lucide-react";
import { useDispatch } from "react-redux";
import { closeDialog } from "@/store/dialog.slice";
import type { Item } from "@/features/item/item.type";

interface ItemDetailDialogProps {
  item: Item;
}

function formatDate(dateString: string) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const PLACEHOLDER_GRADIENTS = [
  "from-emerald-400 to-teal-600",
  "from-teal-400 to-cyan-600",
  "from-cyan-400 to-blue-600",
  "from-blue-400 to-indigo-600",
];

export default function ItemDetailDialog({ item }: ItemDetailDialogProps) {
  const dispatch = useDispatch();
  const hasImages = item.images && item.images.length > 0;

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold">{item.name}</DialogTitle>
      </DialogHeader>

      <div className="py-4 space-y-5">
        {/* Image Grid */}
        <div>
          {hasImages ? (
            <div
              className={`grid gap-2 rounded-xl overflow-hidden ${
                item.images.length === 1
                  ? "grid-cols-1"
                  : item.images.length === 2
                    ? "grid-cols-2"
                    : item.images.length === 3
                      ? "grid-cols-2"
                      : "grid-cols-2"
              }`}
            >
              {item.images.slice(0, 4).map((img, idx) => (
                <div
                  key={img.id}
                  className={`relative bg-muted overflow-hidden ${
                    item.images.length === 3 && idx === 0
                      ? "row-span-2"
                      : ""
                  }`}
                  style={{ aspectRatio: item.images.length === 1 ? "16/7" : "1/1" }}
                >
                  <img
                    src={img.url}
                    alt={img.filename}
                    className="w-full h-full object-cover"
                  />
                  {item.images.length > 4 && idx === 3 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        +{item.images.length - 4}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full h-48 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center">
              <ImageIcon className="w-12 h-12 text-white/60" />
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
            Description
          </p>
          <p className="text-sm text-foreground leading-relaxed">
            {item.description || "No description provided."}
          </p>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          <div className="flex items-start gap-2">
            <CalendarIcon className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Created</p>
              <p className="text-sm font-medium">{formatDate(item.created_at)}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <RefreshCwIcon className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Last updated</p>
              <p className="text-sm font-medium">
                {item.updated_at ? formatDate(item.updated_at) : "Never"}
              </p>
            </div>
          </div>
        </div>

        {/* Image count badge */}
        {hasImages && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{item.images.length} image{item.images.length !== 1 ? "s" : ""} attached</span>
          </div>
        )}
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={() => dispatch(closeDialog())}>
          Close
        </Button>
      </DialogFooter>
    </>
  );
}
