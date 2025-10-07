import { useQuery } from '@tanstack/react-query';
import { getTask } from '../task_functions';

const taskKeys = {
  detail: (taskId: string) => ['task', taskId] as const,
};

const useTask = (taskId: string) =>
  useQuery({
    queryKey: taskKeys.detail(taskId),
    queryFn: () => getTask(taskId),
    enabled: Boolean(taskId),
  });

export { useTask, taskKeys };
