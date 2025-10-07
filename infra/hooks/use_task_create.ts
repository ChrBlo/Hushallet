import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskCreate } from '../task_functions';
import { taskKeys } from './use_task';
import { householdWithTasksKeys } from './use_household_with_tasks';
import type { Task } from '../../types/task';

const useTaskCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Omit<Task, 'id' | 'created_by'>) =>
      taskCreate(payload),

    onSuccess: createdTask => {
      queryClient.invalidateQueries({
        queryKey: taskKeys.detail(createdTask.id),
      });

      queryClient.invalidateQueries({
        queryKey: householdWithTasksKeys.detail(createdTask.household_id),
      });
    },
  });
};

export { useTaskCreate };
