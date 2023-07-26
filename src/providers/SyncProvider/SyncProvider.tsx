import React, {
  createContext,
  Dispatch,
  PropsWithChildren,
  useContext,
} from 'react';

type SyncContextArgs = {
  setIsSyncing: Dispatch<boolean>;
  isSyncing: boolean;
  setSyncSuccess: Dispatch<boolean>;
  syncSuccess: boolean;
  setSyncFailed: Dispatch<boolean>;
  syncFailed: boolean;
};
const SyncContext = createContext<SyncContextArgs | null>(null);

export const SyncProvider = ({
  children,
  ...props
}: PropsWithChildren<SyncContextArgs>) => {
  return <SyncContext.Provider value={props}>{children}</SyncContext.Provider>;
};

export const useSyncProvider = () => {
  const context = useContext(SyncContext);
  if (!context) throw new Error('No SyncProvider found !!!');
  return context;
};
