// import React, { forwardRef } from "react";
// import { cn } from "@/lib/utils";

// const createComponent = <T extends HTMLElement>(
//   tag: keyof JSX.IntrinsicElements,
//   defaultClassName: string
//   // displayName: string
// ) =>
//   forwardRef<T, React.HTMLAttributes<T>>((props, ref) =>
//     React.createElement(
//       tag,
//       { ...props, ref, className: cn(defaultClassName, props.className) },
//       props.children
//     )
//   );

// export const H3 = createComponent<HTMLHeadingElement>(
//   "h3",
//   "text-2xl font-bold tracking-tight",
//   "H3"
// );
// export const Small = createComponent<HTMLParagraphElement>(
//   "p",
//   "text-sm font-medium leading-none",
//   "Small"
// );
// export const Muted = createComponent<HTMLSpanElement>(
//   "span",
//   "text-sm font-semibold text-muted-foreground",
//   "Muted"
// );
