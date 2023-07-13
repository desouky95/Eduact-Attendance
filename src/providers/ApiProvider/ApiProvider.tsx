import {PropsWithChildren, useEffect} from 'react';
import {api} from 'src/api/api';
import {useAppSelector} from 'src/store';

export const ApiProvider = ({children}: PropsWithChildren) => {
  const {isLogged, token} = useAppSelector(s => s.auth);


  return <>{children}</>;
};
