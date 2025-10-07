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

      const cachedTask = queryClient.getQueryData<Task | undefined>(
        taskKeys.detail(taskId)
      );

      queryClient.invalidateQueries({
        queryKey: taskKeys.detail(taskId),
      });

      const householdIds = new Set<string>();

      if (cachedTask?.household_id) {
        householdIds.add(cachedTask.household_id);
      }

      if (updatedTask.household_id) {
        householdIds.add(updatedTask.household_id);
      }

      householdIds.forEach(householdId => {
        queryClient.invalidateQueries({
          queryKey: householdWithTasksKeys.detail(householdId),
        });
      });
    },
  });
};

export { useTaskUpdate };
