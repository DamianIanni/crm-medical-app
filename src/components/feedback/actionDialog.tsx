"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";

import { Trash2 } from "lucide-react";

type ActionDialogProps = {
  title: string;
  description?: string;
  onConfirm: () => void;
  triggerLabel?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  children?: React.ReactNode;
  triggerProps?: React.ComponentProps<typeof Button>;
};

export function ActionDialog(props: ActionDialogProps) {
  const {
    title,
    description,
    onConfirm,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    children,
  } = props;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="hover:bg-red-500 hover:text-white p-2 cursor-pointer"
          {...props.triggerProps}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold text-gray-500">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-sm font-semibold">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        {children && <div className="py-2">{children}</div>}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="cursor-pointer">
              {cancelLabel}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              variant="destructive"
              className="cursor-pointer"
              onClick={onConfirm}
            >
              {confirmLabel}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
