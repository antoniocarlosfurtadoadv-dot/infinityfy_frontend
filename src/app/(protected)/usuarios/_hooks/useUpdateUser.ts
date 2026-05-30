import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppToast } from "@/core/hooks/useToast";
import { UserService } from "../_services/user.service";

export function useUpdateUser(id: string) {
  const toast = useAppToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: (data: Record<string, any>) => UserService.update({ id, ...data }),
    onSuccess: () => {
      toast.success("Usuário atualizado com sucesso!");

      // Invalidate user queries to refetch with updated data
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao atualizar usuário");
      }
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const execute = async (data: Record<string, any>) => {
    try {
      return await mutation.mutateAsync(data);
    } catch {
      return undefined;
    }
  };

  return { execute, isLoading: mutation.isPending };
}
