import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskCreate } from '../task_functions';
import { taskKeys } from './use_task';
import { householdKeys } from './use_household';
import type { Task } from '../../types/task';

const useTaskCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Omit<Task, 'id' | 'created_by'>) =>
      taskCreate(payload),

    onSuccess: createdTask => {
      if (createdTask.id) {
        queryClient.invalidateQueries({
          queryKey: taskKeys.detail(createdTask.id),
        });
      }

      queryClient.invalidateQueries({
        queryKey: householdKeys.list(),
      });
    },
  });
};

export { useTaskCreate };
