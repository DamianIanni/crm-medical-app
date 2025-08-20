import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

type Status = 'active' | 'inactive' | 'pending' | 'blocked';

interface StatusBadgeProps {
  status: Status | string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const t = useTranslations('Badges.status');
  
  const statusConfig = {
    active: {
      label: t('active'),
      className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    },
    inactive: {
      label: t('inactive'),
      className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
    },
    pending: {
      label: t('pending'),
      className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    },
    blocked: {
      label: t('blocked'),
      className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    },
  };

  const config = statusConfig[status as Status] || {
    label: status,
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
