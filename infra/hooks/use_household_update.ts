import { useMutation, useQueryClient } from '@tanstack/react-query';
import { householdUpdate } from '../household_functions';
import { householdKeys } from './use_household';
import type { Household } from '../../types/household';

const useHouseholdUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (household: Household) => householdUpdate(household),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: householdKeys.list(),
      });
    },
  });
};

export { useHouseholdUpdate };
