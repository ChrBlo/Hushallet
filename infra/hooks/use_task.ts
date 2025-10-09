import { useQuery } from '@tanstack/react-query';
import { taskGet } from '../task_functions';

const taskKeys = {
  detail: (taskId: string) => ['task', taskId] as const,
};

const useTaskGet = (taskId: string) =>
  useQuery({
    queryKey: taskKeys.detail(taskId),
    queryFn: () => taskGet(taskId),
  });

export { useTaskGet, taskKeys };
