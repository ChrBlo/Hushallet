import { useMutation, useQueryClient } from '@tanstack/react-query';
import { householdCreate } from '../household_functions';
import { householdKeys } from './use_household';
import type { Household } from '../../types/household';

const useHouseholdCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Omit<Household, 'id' | 'created_by'>) =>
      householdCreate(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: householdKeys.list(),
      });
    },
  });
};

export { useHouseholdCreate };
