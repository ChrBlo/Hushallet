import { useMutation, useQueryClient } from '@tanstack/react-query';
import { householdCreate } from '../household_functions';
import { householdKeys } from './use_household';
import { householdWithTasksKeys } from './use_household_with_tasks';
import type { Household } from '../../types/household';

const useHouseholdCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Omit<Household, 'id' | 'created_by'>) =>
      householdCreate(payload),

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

export { useHouseholdCreate };
