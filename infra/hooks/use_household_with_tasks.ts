import { useQuery } from '@tanstack/react-query';
import { getHouseholdWithTasks } from '../household_functions';

const householdWithTasksKeys = {
  detail: (householdId: string) =>
    ['household-with-tasks', householdId] as const,
};

const useHouseholdWithTasks = (householdId: string) =>
  useQuery({
    queryKey: householdWithTasksKeys.detail(householdId),
    queryFn: () => getHouseholdWithTasks(householdId),
    enabled: Boolean(householdId),
  });

export { useHouseholdWithTasks, householdWithTasksKeys };
