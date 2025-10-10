import { useQuery } from '@tanstack/react-query';
import { householdGet } from '../household_functions';
import type { HouseholdWithTasks } from '../../types/household';

const householdKeys = {
  list: () => ['households', 'for-member'] as const,
};

const useHouseholdGet = () =>
  useQuery<HouseholdWithTasks[]>({
    queryKey: householdKeys.list(),
    queryFn: () => householdGet(),
  });

export { useHouseholdGet, householdKeys };
