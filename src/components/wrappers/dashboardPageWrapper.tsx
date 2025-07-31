import { ReactNode } from "react";

type DashboardPageWrapperProps = {
  children: ReactNode;
};

export default function DashboardPageWrapper(
  props: DashboardPageWrapperProps
): ReactNode {
  const { children } = props;
  return (
    <div className="flex flex-grow h-full flex-col items-center bg-sidebar rounded-2xl">
      {children}
    </div>
  );
}
