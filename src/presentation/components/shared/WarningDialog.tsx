import React from "react";
import { AlertTriangle, AlertCircle, Info, Trash2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";

export interface WarningDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
  icon?: React.ReactNode;
}

export function WarningDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
  onConfirm,
  icon,
}: WarningDialogProps) {
  const getTheme = () => {
    switch (variant) {
      case "warning":
        return {
          iconBg: "bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400",
          confirmBtn: "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20",
          defaultIcon: <AlertTriangle size={24} />,
        };
      case "info":
        return {
          iconBg: "bg-teal-100 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400",
          confirmBtn: "bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/20",
          defaultIcon: <Info size={24} />,
        };
      case "danger":
      default:
        return {
          iconBg: "bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400",
          confirmBtn: "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20",
          defaultIcon: <Trash2 size={24} />,
        };
    }
  };

  const theme = getTheme();

  return (
    <Dialog open={open} onOpenChange={(val) => !isLoading && onOpenChange(val)}>
      <DialogContent className="sm:max-w-md p-6 rounded-3xl border-border shadow-2xl">
        <div className="flex flex-col items-center text-center sm:items-start sm:text-left sm:flex-row gap-4 pt-2">
          {/* Icon Badge */}
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${theme.iconBg}`}
          >
            {icon || theme.defaultIcon}
          </div>

          {/* Text Content */}
          <div className="space-y-2 flex-1">
            <DialogHeader className="p-0 text-left">
              <DialogTitle
                className="text-lg font-bold text-foreground"
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                {title}
              </DialogTitle>
            </DialogHeader>

            <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </DialogDescription>
          </div>
        </div>

        {/* Footer Actions */}
        <DialogFooter className="mt-6 pt-4 border-t border-border/60 flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="rounded-xl px-4 py-2 text-sm font-medium border-border hover:bg-secondary cursor-pointer"
          >
            {cancelText}
          </Button>

          <Button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`rounded-xl px-5 py-2 text-sm font-semibold shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 ${theme.confirmBtn}`}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Processing...
              </>
            ) : (
              confirmText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
