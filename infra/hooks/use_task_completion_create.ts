import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskCompletionCreate } from '../task_completion_functions';
import { householdKeys } from './use_household';
import type { TaskCompletion } from '../../types/task_completion';

export const useTaskCompletionCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      completion,
    }: {
      taskId: string;
      completion: TaskCompletion;
    }) => taskCompletionCreate(taskId, completion),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: householdKeys.list(),
      });
    },
  });
};
