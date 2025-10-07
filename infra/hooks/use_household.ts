import { useQuery } from '@tanstack/react-query';
import { getHousehold } from '../household_functions';

const householdKeys = {
  detail: (householdId: string) => ['household', householdId] as const,
};

const useHousehold = (householdId: string) =>
  useQuery({
    queryKey: householdKeys.detail(householdId),
    queryFn: () => getHousehold(householdId),
    enabled: Boolean(householdId),
  });

export { useHousehold, householdKeys };
