import { useMutation, useQueryClient } from '@tanstack/react-query';
import { householdDelete } from '../household_functions';
import { householdKeys } from './use_household';

const useHouseholdDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (householdId: string) => householdDelete(householdId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: householdKeys.list(),
      });
    },
  });
};

export { useHouseholdDelete };
