import { createContext, PropsWithChildren, useContext, useState } from 'react';

interface ContextValue {
  selectedHouseholdId: string;
  setSelectedHouseholdId: (id: string) => void;
}

const HouseholdContext = createContext({} as ContextValue);

export default function HouseholdProvider(props: PropsWithChildren) {
  const [selectedHouseholdId, setSelectedHouseholdId] = useState<string>('');

  return (
    <HouseholdContext.Provider
      value={{ selectedHouseholdId, setSelectedHouseholdId }}
    >
      {props.children}
    </HouseholdContext.Provider>
  );
}

export const useSelectedHouseholdId = () => useContext(HouseholdContext);
