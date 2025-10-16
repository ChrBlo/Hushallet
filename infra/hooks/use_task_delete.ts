import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskDelete } from '../task_functions';
import { taskKeys } from './use_task';
import { householdKeys } from './use_household';

const useTaskDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => taskDelete(taskId),

    onSuccess: (_data, deletedTaskId) => {
      queryClient.invalidateQueries({
        queryKey: taskKeys.detail(deletedTaskId),
      });

      queryClient.invalidateQueries({
        queryKey: householdKeys.list(),
      });
    },
  });
};

export { useTaskDelete };