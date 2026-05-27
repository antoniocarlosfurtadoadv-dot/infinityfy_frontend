"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type TipProps = {
  content: string | undefined;
  variant: "error" | "info" | "success";
  /** Auto-dismiss delay in ms. Set to 0 to disable. Defaults to 3000. */
  duration?: number;
} & React.HTMLAttributes<HTMLDivElement>;

const Tip = ({ content, variant, className, duration = 3000, ...props }: TipProps) => {
  const [visible, setVisible] = useState(true);
  const [prevContent, setPrevContent] = useState(content);

  // Reset visibility during render when content changes (avoids setState in effect)
  if (prevContent !== content) {
    setPrevContent(content);
    setVisible(true);
  }

  useEffect(() => {
    if (!duration) return;
    const id = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(id);
  }, [content, duration]);

  if (!visible) return null;

  const variants = {
    error: "bg-feedback-error-light text-feedback-error-main",
    info: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
  };

  return (
    <div
      className={cn(
        variants[variant],
        "w-full py-3 px-2 rounded-md font-normal",
        className,
      )}
      {...props}
    >
      {content}
    </div>
  );
};

export default Tip;
