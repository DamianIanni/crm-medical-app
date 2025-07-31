// "use client";

// import React from "react";
// import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";

// import { memberSchema, MemberFormValues } from "@/lib/schemas/memberSchema";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";

// import { useRouter } from "next/navigation";

// import { Form } from "@/components/ui/form";
// import { TextField } from "./fields/textField";

// export function CenterForm({
//   className,
//   ...props
// }: React.ComponentProps<"div">) {
//   const router = useRouter();
//   const form = useForm<MemberFormValues>({
//     resolver: zodResolver(memberSchema),
//     defaultValues: {
//       firstName: "",
//     },
//   });

//   async function onSubmit(values: MemberFormValues) {}

//   return (
//     <div
//       className={cn(
//         "w-full max-w-2xl h-full flex flex-col rounded-xl p-6 ",
//         className
//       )}
//       {...props}
//     >
//       <h2 className="text-2xl font-semibold tracking-tight mb-2">
//         Add new center
//       </h2>
//       <p className="text-muted-foreground mb-6 text-sm">
//         Fill out the form below to add a new center.
//       </p>
//       <Form {...form}>
//         <form
//           onSubmit={form.handleSubmit(onSubmit)}
//           className={cn("flex h-[calc(90%)] flex-col justify-between gap-6")}
//         >
//           <div className="grid h-min-full grid-cols-1 gap-4 md:grid-cols-2">
//             <TextField control={form.control} name="firstName" label="Name" />
//             <TextField
//               control={form.control}
//               name="firstName"
//               label="Address"
//             />
//           </div>

//           <div className="flex justify-end">
//             <Button type="submit">Add</Button>
//           </div>
//         </form>
//       </Form>
//     </div>
//   );
// }
