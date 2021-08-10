import { useState, useLayoutEffect, useMemo } from 'react';
import useStore from './useStore';
import { distinctUntilChanged, map } from 'rxjs/operators';

const useEpic = <S = any>(name: string): S => {

  const store = useStore();

  if (!store.epics.hasOwnProperty(name)) {
    throw new Error(`${name} epic was not found in the store`);
  }

  const { initialState, onError } = useMemo(() => store.epics[name], [name]);

  const [state, setState] = useState(initialState);

  useLayoutEffect(() => {
    const sub = store.state$
      .pipe(
        map(storeState => (storeState as any)?.[name]),
        distinctUntilChanged(),
      )
      .subscribe({
        next: (value: S) => setState(value),
        error: onError,
      });

    () => sub.unsubscribe();
  }, []);

  const cachedState = useMemo(() => state, [state]);

  return cachedState;
};

export default useEpic;
