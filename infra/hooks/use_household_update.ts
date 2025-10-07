import { useMutation, useQueryClient } from '@tanstack/react-query';
import { householdUpdate } from '../household_functions';
import { householdKeys } from './use_household';
import { householdWithTasksKeys } from './use_household_with_tasks';
import type { Household } from '../../types/household';

const useHouseholdUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (household: Household) => householdUpdate(household),

    onSuccess: (_data, household) => {
      if (!household.id) {
        return;
      }

      const householdId = household.id;

      queryClient.invalidateQueries({
        queryKey: householdKeys.detail(householdId),
      });

      queryClient.invalidateQueries({
        queryKey: householdWithTasksKeys.detail(householdId),
      });
    },
  });
};

export { useHouseholdUpdate };
