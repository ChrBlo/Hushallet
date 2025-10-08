import { useQuery } from '@tanstack/react-query';
import { householdWithTasksGet } from '../household_functions';

const householdWithTasksKeys = {
  detail: (householdId: string) =>
    ['household-with-tasks', householdId] as const,
};

const useHouseholdWithTasksGet = (householdId: string) =>
  useQuery({
    queryKey: householdWithTasksKeys.detail(householdId),
    queryFn: () => householdWithTasksGet(householdId),
    enabled: Boolean(householdId),
  });

export { useHouseholdWithTasksGet, householdWithTasksKeys };
