import { useQuery } from "@tanstack/react-query";
import { useLocalStorage } from "usehooks-ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Project } from "@prisma/client";

export const useProject = () => {
  const queryClient = useQueryClient();
  const {
    data: projects,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: () => fetch("/api/get-all-projects").then((res) => res.json()),
  });
  const [projectId, setProjectId] = useLocalStorage("projectId", "");

  const project = projects?.find((project: Project) => project.id === projectId);

  const deleteProject = useMutation({
    mutationFn: (projectId: string) =>
      fetch(`/api/delete-project`, {
        method: "POST",
        body: JSON.stringify({ projectId }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project deleted successfully");
      router.refresh();
    },
  });

  return {
    projects,
    projectId,
    setProjectId,
    project,
    isLoading,
    isError,
    deleteProject,
  };
};
