import { cn } from "@/lib/utils";

interface RoleBadgeProps {
  role: 'admin' | 'manager' | 'employee' | string;
  className?: string;
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const roleConfig = {
    admin: {
      label: 'Admin',
      className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    },
    manager: {
      label: 'Manager',
      className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    },
    employee: {
      label: 'Employee',
      className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    },
  };

  const config = roleConfig[role as keyof typeof roleConfig] || {
    label: role.charAt(0).toUpperCase() + role.slice(1),
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
