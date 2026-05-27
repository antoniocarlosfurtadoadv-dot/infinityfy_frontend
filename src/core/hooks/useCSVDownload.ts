/**
 * useCSVDownload Hook
 * Reusable hook for generating and downloading CSV files
 */

import { useState } from 'react';
import { useAppToast } from '@/core/hooks/useToast';
import { downloadCSV } from '../utils/csv';

interface IUseCSVDownloadOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

interface IGenerateCSVParams {
  data: Record<string, unknown>[];
  filename: string;
}

export function useCSVDownload(hookOptions?: IUseCSVDownloadOptions) {
  const [isGenerating, setIsGenerating] = useState(false);
  const toast = useAppToast();

  const generateCSV = async (params: IGenerateCSVParams) => {
    setIsGenerating(true);
    try {
      if (!params.data || params.data.length === 0) {
        toast.error('Nenhum dado para exportar');
        return;
      }

      downloadCSV(params.filename, params.data);
      toast.success('CSV exportado com sucesso');
      hookOptions?.onSuccess?.();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao gerar CSV';
      toast.error(errorMessage);

      if (error instanceof Error) {
        hookOptions?.onError?.(error);
      }
      console.error('Error downloading CSV:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateCSV,
    isGenerating,
  };
}
