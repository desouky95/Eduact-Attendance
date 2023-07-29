import React, {useEffect, useState} from 'react';
import {Observable} from 'rxjs';

export const useObservable = <T>(observable: Observable<T>) => {
  const [state, setState] = useState<T>();

  useEffect(() => {
    const sub = observable.subscribe(value => {
      setState(value);
    });
    return () => sub.unsubscribe();
  }, [observable.source]);

  return state;
};
