import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppToast } from "@/core/hooks/useToast";
import { ApiError } from "@/core/api/interceptors/error.interceptor";
import { UserService } from "../_services/user.service";
import type { CreateUserInput } from "../_schemas/employee.schema";

export function useCreateUser() {
  const toast = useAppToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateUserInput) => UserService.create(data),
    onSuccess: () => {

      toast.success("Usuário criado com sucesso!");

      // Invalidate all user queries to refetch with updated data
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
    onError: (error: unknown) => {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao criar usuário");
      }
    },
  });

  const execute = async (data: CreateUserInput) => {
    try {
      return await mutation.mutateAsync(data);
    } catch {
      return undefined;
    }
  };

  return { execute, isLoading: mutation.isPending };
}
