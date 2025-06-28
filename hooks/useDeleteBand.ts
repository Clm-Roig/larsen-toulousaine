import { deleteBand } from "@/domain/Band/Band.webService";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useDeleteBand(afterDeletionCallback?: () => void) {
  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: async (bandId: string) => {
      await deleteBand(bandId);
    },
    onError: (error) =>
      notifications.show({
        color: "red",
        title: "Erreur à la suppression du groupe",
        message: error.message,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["bands"] });
      notifications.show({
        color: "green",
        message: "Groupe supprimé avec succès !",
      });
      if (afterDeletionCallback) {
        afterDeletionCallback();
      }
    },
  });

  return {
    isPending,
    mutate,
  };
}
