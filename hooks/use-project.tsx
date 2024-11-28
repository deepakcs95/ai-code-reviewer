import { useQuery } from "@tanstack/react-query";
import { useLocalStorage } from "usehooks-ts";

export const useProject = () => {
  const {
    data: projects,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: () => fetch("/api/get-all-projects").then((res) => res.json()),
  });
  const [projectId, setProjectId] = useLocalStorage("projectId", "");

  const project = projects?.find((project) => project.id === projectId);

  return {
    projects,
    projectId,
    setProjectId,
    project,
    isLoading,
    isError,
  };
};
