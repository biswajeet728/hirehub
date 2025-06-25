"use client";

import { CardAction } from "./ui/card";
import { Bookmark, BookmarkCheck, Loader } from "lucide-react";
import { createBookmark, deleteBookmark } from "@/lib/action";
import { useState } from "react";
import toast from "react-hot-toast";

export function BookmarkForm({
  candidateId,
  isBookmarkedStatus,
  bookmarkId: initialBookmarkId,
}: {
  candidateId: string;
  isBookmarkedStatus?: boolean;
  bookmarkId?: string | null;
}) {
  const [isBookmarked, setIsBookmarked] = useState(isBookmarkedStatus ?? false);
  const [bookmarkId, setBookmarkId] = useState<string | null>(
    initialBookmarkId ?? null
  );
  const [loading, setLoading] = useState(false);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);

        if (isBookmarked) {
          if (!bookmarkId) {
            toast.error("Bookmark ID missing!");
            setLoading(false);
            return;
          }
          const response = await deleteBookmark(bookmarkId);
          if (response.success) {
            setIsBookmarked(false);
            setBookmarkId(null);
            toast.success("Bookmark removed!");
          } else {
            console.error("Failed to delete bookmark:", response.message);
            toast.error("Failed to remove bookmark");
          }
        } else {
          const response = await createBookmark(candidateId);
          if (response.success) {
            setIsBookmarked(true);
            setBookmarkId(response.data._id);
            toast.success("Bookmark added!");
          } else {
            console.error("Failed to create bookmark:", response.message);
            toast.error(response.message);
          }
        }

        setLoading(false);
      }}
    >
      <button type="submit" disabled={loading}>
        <CardAction
          className={`flex items-center gap-2 px-4 py-2 
            ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} 
            bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 
            hover:border-blue-400/50 rounded-lg text-sm font-medium 
            text-blue-200 hover:text-blue-100 transition-all duration-300 
            transform group/link`}
        >
          {loading ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : isBookmarked ? (
            <BookmarkCheck className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
          ) : (
            <Bookmark className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
          )}
        </CardAction>
      </button>
    </form>
  );
}
