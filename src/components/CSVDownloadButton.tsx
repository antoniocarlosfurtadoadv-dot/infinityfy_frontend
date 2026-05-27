/**
 * CSVDownloadButton Component
 * Reusable button component for CSV export functionality
 */

import { Download } from 'lucide-react';
import { Button } from './ui/Button';

interface ICSVDownloadButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  label?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  className?: string;
}

export function CSVDownloadButton({
  onClick,
  isLoading = false,
  disabled = false,
  label = 'Exportar CSV',
  variant = 'secondary',
  className,
}: ICSVDownloadButtonProps) {
  return (
    <Button
      onClick={onClick}
      isLoading={isLoading}
      disabled={disabled}
      variant={variant}
      leftIcon={<Download className="h-4 w-4" />}
      className={className}
    >
      {label}
    </Button>
  );
}
