/**
 * Card Component
 * Reusable card container for forms and content
 */

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
  title?: string;
  description?: string;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, hover, title, description, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800",
          hover && "transition-all hover:shadow-md hover:border-primary-500 dark:hover:border-primary-400",
          className
        )}
        {...props}
      >
        {(title || description) && (
          <div className="mb-4">
            {title && (
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
            )}
            {description && (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export { Card };
