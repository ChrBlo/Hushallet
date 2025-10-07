import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask } from '../task_functions';
import { taskKeys } from './use_task';
import { householdWithTasksKeys } from './use_household_with_tasks';
import type { Task } from '../../types/task';

const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<Task, 'id' | 'created_by'>) =>
      createTask(payload),
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

export { useCreateTask };
