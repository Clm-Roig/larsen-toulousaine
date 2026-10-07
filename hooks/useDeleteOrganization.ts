import { deleteOrganization } from "@/domain/Organization/Organization.webService";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useDeleteOrganization(
  afterDeletionCallback?: () => void,
) {
  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: async (organizationId: string) => {
      await deleteOrganization(organizationId);
    },
    onError: (error) =>
      notifications.show({
        color: "red",
        title: "Erreur à la suppression de l'association",
        message: error.message,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["organizations"] });
      notifications.show({
        color: "green",
        message: "Association supprimée avec succès !",
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
