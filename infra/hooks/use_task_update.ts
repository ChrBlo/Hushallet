import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskUpdate } from '../task_functions';
import { taskKeys } from './use_task';
import { householdWithTasksKeys } from './use_household_with_tasks';
import type { Task } from '../../types/task';

const useTaskUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, updates }: { taskId: string; updates: Partial<Task> }) => 
      taskUpdate(taskId, updates),

    onSuccess: (_data, { taskId, updates }) => {
      queryClient.invalidateQueries({
        queryKey: taskKeys.detail(taskId),
      });

      if (updates.household_id) {
        queryClient.invalidateQueries({
          queryKey: householdWithTasksKeys.detail(updates.household_id),
        });
      }
    },
  });
};

export { useTaskUpdate };
