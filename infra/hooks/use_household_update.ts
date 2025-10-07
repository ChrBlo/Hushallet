import { useMutation, useQueryClient } from '@tanstack/react-query';
import { householdUpdate } from '../household_functions';
import { householdKeys } from './use_household';
import { householdWithTasksKeys } from './use_household_with_tasks';
import type { HouseholdUpdate } from '../../types/household';

const useHouseholdUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      householdId,
      updates,
    }: {
      householdId: string;
      updates: HouseholdUpdate;
    }) => householdUpdate(householdId, updates),

    onSuccess: (_data, variables) => {
      const { householdId } = variables;

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
