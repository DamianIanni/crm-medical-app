// "use client";

// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import React from "react";

// import { Trash2 } from "lucide-react";

// type ActionDialogProps = {
//   title: string;
//   description?: string;
//   onConfirm: () => void;
//   triggerLabel?: string;
//   confirmLabel?: string;
//   cancelLabel?: string;
//   children?: React.ReactNode;
//   triggerProps?: React.ComponentProps<typeof Button>;
// };

// export function ActionDialog(props: ActionDialogProps) {
//   const {
//     title,
//     description,
//     onConfirm,
//     confirmLabel = "Confirm",
//     cancelLabel = "Cancel",
//     children,
//   } = props;
//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button
//           size="default"
//           onClick={(e) => e.stopPropagation()}
//           className="hover:bg-red-500 hover:text-white cursor-pointer flex items-center justify-start"
//           {...props.triggerProps}
//         >
//           {children ? <div>{children}</div> : <Trash2 className="h-4 w-4" />}
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle className="text-sm font-semibold text-gray-500">
//             {title}
//           </DialogTitle>
//           {description && (
//             <DialogDescription className="text-sm font-semibold">
//               {description}
//             </DialogDescription>
//           )}
//         </DialogHeader>

//         {/* {children && <div className="py-2">{children}</div>} */}

//         <DialogFooter>
//           <DialogClose asChild>
//             <Button
//               // onClick={(e) => e.stopPropagation()}
//               variant="outline"
//               className="cursor-pointer"
//             >
//               {cancelLabel}
//             </Button>
//           </DialogClose>
//           <DialogClose asChild>
//             <Button
//               variant="destructive"
//               className="cursor-pointer"
//               onClick={(e) => {
//                 // e.stopPropagation();
//                 onConfirm();
//               }}
//             >
//               {confirmLabel}
//             </Button>
//           </DialogClose>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

interface ActionDialogProps {
  title: string;
  description?: string;
  /**
   * The function to call when the confirm button is clicked
   * @internal This is a client-side only callback
   */
  onConfirm: () => void | Promise<void>;
  triggerLabel?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  children?: React.ReactNode;
  triggerProps?: React.ComponentProps<typeof Button>;
  variant?: "default" | "delete" | "info" | "warning" | "success" | "error";
  isPending?: boolean;
}

export function ActionDialog({
  title,
  description,
  onConfirm,
  confirmLabel,
  cancelLabel,
  children,
  triggerProps,
  variant = "default",
  isPending = false,
}: ActionDialogProps) {
  const t = useTranslations("ActionDialog");
  const [isOpen, setIsOpen] = React.useState(false);

  const buttonVariant =
    variant === "delete" || variant === "error" ? "destructive" : "default";

  const getDefaultLabel = () => {
    if (variant === "delete") return t("default.delete");
    return t("default.confirm");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button
            size="default"
            variant={triggerProps?.variant || "ghost"}
            className="hover:bg-red-500 hover:text-white cursor-pointer flex items-center justify-start"
            {...triggerProps}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold text-gray-500">
            {title || t(`default.${variant}Title`, { defaultValue: t("default.confirmTitle") })}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-sm font-semibold">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            onClick={() => setIsOpen(false)}
            disabled={isPending}
          >
            {cancelLabel || t("default.cancel")}
          </Button>
          <Button
            type="button"
            variant={buttonVariant}
            className="cursor-pointer"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending
              ? t(`default.${variant === "delete" ? "deleting" : "confirming"}`)
              : confirmLabel || getDefaultLabel()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
