import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskUpdate } from '../task_functions';
import { taskKeys } from './use_task';
import { householdWithTasksKeys } from './use_household_with_tasks';
import type { Task } from '../../types/task';

const useTaskUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (task: Task) => taskUpdate(task),

    onSuccess: (_data, updatedTask) => {
      if (!updatedTask.id) {
        return;
      }

      const taskId = updatedTask.id;

      queryClient.invalidateQueries({
        queryKey: taskKeys.detail(taskId),
      });

      queryClient.invalidateQueries({
        queryKey: householdWithTasksKeys.detail(updatedTask.household_id),
      });
    },
  });
};

export { useTaskUpdate };
