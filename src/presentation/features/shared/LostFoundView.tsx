import { useCallback, useEffect, useState } from "react";
import { Package, Plus } from "lucide-react";
import type {
  CreateLostFoundPayload,
  LostFoundItem,
  LostFoundItemType,
} from "@/domain/Models/lost-found.model";
import { StatusBadge } from "@/presentation/components/shared";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import poster from "@/domain/utils/posters";
import axiosInstance from "@/domain/utils/axios_instanse";

const PAGE_LIMIT = 10;
const CATEGORIES = [
  "BAGS",
  "ELECTRONICS",
  "CLOTHING",
  "BOOKS",
  "KEYS",
  "DOCUMENTS",
  "OTHER",
] as const;

type FilterTab = "all" | "found" | "lost";

function tabToItemType(tab: FilterTab): LostFoundItemType | undefined {
  if (tab === "found") return "FOUND";
  if (tab === "lost") return "LOST";
  return undefined;
}

function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatLabel(value: string) {
  return value.charAt(0) + value.slice(1).toLowerCase();
}

export function LostFoundView() {
  const [tab, setTab] = useState<FilterTab>("all");
  const [items, setItems] = useState<LostFoundItem[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("BAGS");
  const [itemType, setItemType] = useState<LostFoundItemType>("FOUND");
  const [location, setLocation] = useState("");

  const totalPages = Math.max(1, Math.ceil(total / PAGE_LIMIT));

  const fetchItems = useCallback(async (filter: FilterTab, pageNum: number) => {
    setIsFetching(true);
    setFetchError("");
    try {
      const item_type = tabToItemType(filter);
      const response = await axiosInstance.get("/lost-found/", {
        params: {
          page: pageNum,
          limit: PAGE_LIMIT,
          ...(item_type ? { item_type } : {}),
        },
      });
      const payload = response.data?.data ?? response.data;
      const list: LostFoundItem[] = payload?.data ?? [];
      setItems(list);
      setTotal(payload?.total ?? list.length);
      setPage(payload?.page ?? pageNum);
    } catch (err: any) {
      console.error("Failed to fetch lost & found items:", err);
      setFetchError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load lost & found items."
      );
      setItems([]);
      setTotal(0);
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchItems(tab, page);
  }, [tab, page, fetchItems]);

  const handleTabChange = (next: FilterTab) => {
    setTab(next);
    setPage(1);
  };

  const resetForm = () => {
    setItemName("");
    setDescription("");
    setCategory("BAGS");
    setItemType("FOUND");
    setLocation("");
    setFormError("");
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleReportItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSuccessMessage("");

    if (!itemName.trim()) {
      setFormError("Item name is required");
      return;
    }
    if (!description.trim()) {
      setFormError("Description is required");
      return;
    }
    if (!location.trim()) {
      setFormError("Location is required");
      return;
    }

    const payload: CreateLostFoundPayload = {
      item_name: itemName.trim(),
      description: description.trim(),
      category,
      item_type: itemType,
      location: location.trim(),
    };

    setIsSubmitting(true);
    try {
      await poster("/lost-found/", payload);
      setSuccessMessage("Item reported successfully");
      handleModalClose();
      setPage(1);
      await fetchItems(tab, 1);
    } catch (err: any) {
      console.error("Failed to report item:", err);
      setFormError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Failed to report item."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>
          Lost & Found
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Report and search for lost or found items</p>
      </div>

      {fetchError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {fetchError}
        </div>
      )}

      {successMessage && (
        <div className="bg-teal-50 border border-teal-200 text-teal-800 px-4 py-3 rounded-xl text-sm">
          {successMessage}
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        {(["all", "found", "lost"] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => handleTabChange(filter)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors capitalize ${
              tab === filter
                ? "bg-primary text-white"
                : "bg-white border border-border text-muted-foreground hover:bg-secondary"
            }`}
          >
            {filter}
          </button>
        ))}
        <Button
          onClick={() => {
            setSuccessMessage("");
            setIsModalOpen(true);
          }}
          className="ml-auto flex items-center gap-2 bg-primary text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-teal-700 transition-colors"
        >
          <Plus size={15} /> Report Item
        </Button>
      </div>

      <div className="space-y-3">
        {isFetching ? (
          <div className="bg-white rounded-2xl border border-border p-8 text-center text-sm text-muted-foreground">
            Loading items...
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-border p-8 text-center text-sm text-muted-foreground">
            No items found
          </div>
        ) : (
          items.map((item) => {
            const isFound = item.item_type === "FOUND";
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-border p-5 flex items-start gap-4"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isFound ? "bg-teal-100" : "bg-red-100"
                  }`}
                >
                  <Package size={18} className={isFound ? "text-teal-600" : "text-red-500"} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>
                      {item.item_name}
                    </p>
                    <StatusBadge type={formatLabel(item.item_type)} />
                    <StatusBadge type={formatLabel(item.status)} />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    {formatLabel(item.category)} · {item.location} · {formatDate(item.date_reported)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {total > 0 && (
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <p className="text-xs text-muted-foreground">
            Page {page} of {totalPages} · {total} items
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={page <= 1 || isFetching}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-xl px-3 py-2 text-sm"
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={page >= totalPages || isFetching}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-xl px-3 py-2 text-sm"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={(open) => !open && handleModalClose()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: "Outfit, sans-serif" }}>Report Item</DialogTitle>
            {formError && (
              <DialogDescription className="text-red-500 text-sm">{formError}</DialogDescription>
            )}
          </DialogHeader>

          <form onSubmit={handleReportItem} className="space-y-4 py-2">
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium block mb-1.5">
                Item Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g. Black Backpack"
                disabled={isSubmitting}
                required
                className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm"
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium block mb-1.5">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                value={itemType}
                onChange={(e) => setItemType(e.target.value as LostFoundItemType)}
                disabled={isSubmitting}
                className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
              >
                <option value="FOUND">Found</option>
                <option value="LOST">Lost</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium block mb-1.5">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {formatLabel(cat)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium block mb-1.5">
                Location <span className="text-red-500">*</span>
              </label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Classroom 101"
                disabled={isSubmitting}
                required
                className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm"
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium block mb-1.5">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Black backpack with a red zipper"
                disabled={isSubmitting}
                required
                rows={3}
                className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50 resize-none"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleModalClose}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl text-sm"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl text-sm bg-primary text-white hover:bg-teal-700 disabled:opacity-50"
              >
                {isSubmitting ? "Reporting..." : "Report Item"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
