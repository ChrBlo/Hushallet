import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createHousehold } from '../household_functions';
import { householdKeys } from './use_household';
import { householdWithTasksKeys } from './use_household_with_tasks';
import type { Household } from '../../types/household';

const useCreateHousehold = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<Household, 'id' | 'created_by'>) =>
      createHousehold(payload),
    onSuccess: createdHousehold => {
      queryClient.invalidateQueries({
        queryKey: householdKeys.detail(createdHousehold.id),
      });
      queryClient.invalidateQueries({
        queryKey: householdWithTasksKeys.detail(createdHousehold.id),
      });
    },
  });
};

export { useCreateHousehold };
