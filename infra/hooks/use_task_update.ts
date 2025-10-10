import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskUpdate } from '../task_functions';
import { taskKeys } from './use_task';
import { householdKeys } from './use_household';
import type { Task } from '../../types/task';

const useTaskUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (task: Task) => taskUpdate(task),

    onSuccess: (_data, updatedTask) => {
      if (updatedTask.id) {
        queryClient.invalidateQueries({
          queryKey: taskKeys.detail(updatedTask.id),
        });
      }

      queryClient.invalidateQueries({
        queryKey: householdKeys.list(),
      });
    },
  });
};

export { useTaskUpdate };
