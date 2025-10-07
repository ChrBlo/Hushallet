import { useQuery } from '@tanstack/react-query';
import { householdGet } from '../household_functions';

const householdKeys = {
  detail: (householdId: string) => ['household', householdId] as const,
};

const useHouseholdGet = (householdId: string) =>
  useQuery({
    queryKey: householdKeys.detail(householdId),
    queryFn: () => householdGet(householdId),
    enabled: Boolean(householdId),
  });

export { useHouseholdGet, householdKeys };
