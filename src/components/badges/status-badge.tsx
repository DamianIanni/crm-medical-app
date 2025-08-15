import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: 'active' | 'pending' | 'inactive' | 'invited' | string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig = {
    active: {
      label: 'Active',
      className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    },
    pending: {
      label: 'Pending',
      className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    },
    invited: {
      label: 'Invited',
      className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    },
    inactive: {
      label: 'Inactive',
      className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || {
    label: status.charAt(0).toUpperCase() + status.slice(1),
    className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium min-w-[80px]',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
