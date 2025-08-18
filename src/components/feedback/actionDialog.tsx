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
import React, { useState } from "react";

// Hacemos que onConfirm pueda ser una promesa para manejar el estado de carga
type ActionDialogProps = {
  title: string;
  description?: string;
  onConfirm: () => Promise<void> | void; // Puede ser síncrona o asíncrona
  confirmLabel?: string;
  cancelLabel?: string;
  children?: React.ReactNode; // El activador siempre será el children
  confirmButtonVariant?: React.ComponentProps<typeof Button>["variant"];
};

export function ActionDialog(props: ActionDialogProps) {
  const {
    title,
    description,
    onConfirm,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    children,
    confirmButtonVariant = "destructive",
  } = props;

  // 1. Estado para controlar si el diálogo está abierto
  const [isOpen, setIsOpen] = useState(false);
  // 2. Estado para manejar la carga de la acción asíncrona
  const [isPending, setIsPending] = useState(false);

  const handleConfirm = async () => {
    setIsPending(true);
    try {
      await onConfirm(); // 3. Esperamos a que la promesa de onConfirm se resuelva
      setIsOpen(false); // 4. Si tiene éxito, cerramos el diálogo
    } catch (error) {
      // Si onConfirm lanza un error, el diálogo permanece abierto
      // para que el usuario pueda ver el estado de error (manejado por el Toast)
      console.error("ActionDialog confirmation failed:", error);
    } finally {
      setIsPending(false); // 5. Dejamos de cargar, ya sea con éxito o error
    }
  };

  return (
    // Controlamos el estado de apertura manualmente
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {/* El activador es simplemente el 'children' que se le pasa */}
        {children ? (
          children
        ) : (
          <Button
            variant="ghost"
            className="hover:bg-destructive hover:text-white cursor-pointer flex items-center justify-start"
          >
            <Trash2 className="size-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] font-bold">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <DialogFooter>
          {/* El botón de cancelar SÍ usa DialogClose para un cierre simple */}
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isPending}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={confirmButtonVariant}
            onClick={handleConfirm}
            disabled={isPending}
            // Este botón NO está envuelto en DialogClose
          >
            {isPending ? "Confirming..." : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
