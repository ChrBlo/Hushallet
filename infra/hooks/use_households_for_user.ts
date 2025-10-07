import { useQuery } from '@tanstack/react-query';
import { householdsForUserGet } from '../household_functions';
import type { Household } from '../../types/household';

const householdsForUserKeys = {
  list: () => ['households', 'for-current-user'] as const,
};

const useHouseholdsForUserGet = () =>
  useQuery<Household[]>({
    queryKey: householdsForUserKeys.list(),
    queryFn: () => householdsForUserGet(),
    initialData: [],
  });

export { useHouseholdsForUserGet, householdsForUserKeys };
