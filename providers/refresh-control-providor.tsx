import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from 'react';

interface ContextValue {
  refreshing: boolean;
  setRefreshing: (refreshing: boolean) => void;
  onRefresh: () => void;
}

const RefreshControlContext = createContext({} as ContextValue);

export default function RefreshControlProvider(props: PropsWithChildren) {
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <RefreshControlContext.Provider
      value={{ refreshing, setRefreshing, onRefresh }}
    >
      {props.children}
    </RefreshControlContext.Provider>
  );
}

export const useRefreshControl = () => useContext(RefreshControlContext);
