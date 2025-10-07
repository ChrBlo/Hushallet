import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskUpdate } from '../task_functions';
import { taskKeys } from './use_task';
import { householdWithTasksKeys } from './use_household_with_tasks';
import type { Task, TaskUpdate } from '../../types/task';

const useTaskUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: {
      taskId: string;
      updates: TaskUpdate;
      householdId?: string;
    }) => taskUpdate(variables.taskId, variables.updates),

    onSuccess: (_data, variables) => {
      const { taskId, updates, householdId: providedHouseholdId } = variables;

      queryClient.invalidateQueries({
        queryKey: taskKeys.detail(taskId),
      });

      const cachedTask = queryClient.getQueryData<
        (Task & { id: string }) | undefined
      >(taskKeys.detail(taskId));

      const householdToInvalidate =
        providedHouseholdId ?? updates.household_id ?? cachedTask?.household_id;

      if (householdToInvalidate) {
        queryClient.invalidateQueries({
          queryKey: householdWithTasksKeys.detail(householdToInvalidate),
        });
      }
    },
  });
};

export { useTaskUpdate };
