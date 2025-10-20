import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskCompletionDelete } from '../task_completion_functions';
import { householdKeys } from './use_household';
import type { TaskCompletion } from '../../types/task_completion';

export const useTaskCompletionDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      completion,
    }: {
      taskId: string;
      completion: TaskCompletion;
    }) => taskCompletionDelete(taskId, completion),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: householdKeys.list(),
      });
    },
  });
};
