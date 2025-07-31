// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useMutation } from "@tanstack/react-query";
// import { ToastFeedback } from "@/components/feedback/toastFeedback";

// export function useCreateCenter() {
//   return useMutation({
//     mutationFn: createCenter,
//     onSuccess: (data: any) => {
//       ToastFeedback({
//         type: "success",
//         title: "Patient created",
//         description: `Patient ${data.firstName} added successfully.`,
//       });
//     },
//     onError: () => {
//       ToastFeedback({
//         type: "error",
//         title: "Failed to create patient",
//         description: "Please try again later.",
//       });
//     },
//   });
// }

// export function useDeleteCenter() {
//   return useMutation({
//     mutationFn: (id: number) => deleteCenter(id),
//     onSuccess: () => {
//       ToastFeedback({
//         type: "info",
//         title: "Deleted",
//         description: `Center deleted successfully.`,
//       });
//     },
//     onError: () => {
//       ToastFeedback({
//         type: "error",
//         title: "Failed to delete center",
//         description: "Please try again later.",
//       });
//     },
//   });
// }
