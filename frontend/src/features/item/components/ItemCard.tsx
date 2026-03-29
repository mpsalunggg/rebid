"use client";

import { Button } from "@/components/ui/button";
import { EyeIcon, PencilIcon, Trash2Icon, ImageIcon } from "lucide-react";
import type { Item } from "@/features/item/item.type";
import { formatTimeAgo } from "@/utils/time";

const PLACEHOLDER_COLORS = [
  "from-emerald-400 to-teal-600",
  "from-teal-400 to-cyan-600",
  "from-cyan-400 to-blue-500",
  "from-violet-400 to-purple-600",
];

interface ItemCardProps {
  item: Item;
  onView: (item: Item) => void;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
}

export default function ItemCard({ item, onView, onEdit, onDelete }: ItemCardProps) {
  const hasImages = item?.images && item?.images?.length > 0;
  const gradient =
    PLACEHOLDER_COLORS[parseInt(item.id, 10) % PLACEHOLDER_COLORS.length] ||
    PLACEHOLDER_COLORS[0];

  return (
    <div className="flex items-center gap-4 px-4 py-3 hover:bg-muted/40 transition-colors">
      {/* Thumbnail */}
      <div className="w-12 h-12 rounded-lg shrink-0 overflow-hidden">
        {hasImages ? (
          <img
            src={item?.images?.[0]?.url}
            alt={item?.images?.[0]?.filename}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className={`w-full h-full bg-linear-to-br ${gradient} flex items-center justify-center`}
          >
            <ImageIcon className="w-4 h-4 text-white/60" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm truncate">{item.name}</span>
          {hasImages && (
            <span className="text-xs text-muted-foreground shrink-0">
              {item.images?.length ?? 0} img{(item.images?.length ?? 0) !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate mt-0.5">
          {item.description}
        </p>
      </div>

      {/* Date */}
      <span className="text-xs text-muted-foreground shrink-0 hidden sm:block">
        {formatTimeAgo(item.created_at)}
      </span>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => onView(item)}
          title="View"
        >
          <EyeIcon className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => onEdit(item)}
          title="Edit"
        >
          <PencilIcon className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-muted-foreground hover:text-red-600 dark:hover:text-red-400"
          onClick={() => onDelete(item)}
          title="Delete"
        >
          <Trash2Icon className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
