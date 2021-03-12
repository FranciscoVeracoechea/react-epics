import { useCallback, useLayoutEffect, useMemo, useState } from 'react';

import { BehaviorSubject, Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { Epic, Action, Dispatch } from './types';

export const useEpic = <Payload, State, Dependencies = {}>(
  epic: Epic<Payload, State, Dependencies>,
  initialState: State,
  dependecies?: Dependencies,
): [State, Dispatch<Payload>, Error | null] => {
  const [state, setState] = useState(initialState);
  const [error, setErrorState] = useState<Error | null>(null);

  const state$ = useMemo(() => new BehaviorSubject(initialState), []);
  const actions$ = useMemo(() => new Subject<Action<Payload>>(), []);
  const deps = useMemo(() => (dependecies || {}) as Dependencies, [dependecies]);

  const newState$ = useMemo(
    () =>
      epic(
        actions$.asObservable(),
        state$.asObservable(),
        deps,
      ),
    [actions$, state$, deps],
  );

  const dispatch = useCallback<Dispatch<Payload>>(
    (action) => {
      actions$.next(action);
    },
    [actions$],
  );

  useLayoutEffect(() => {
    const sub = state$
      .pipe(distinctUntilChanged())
      .subscribe(setState, setErrorState);
    return () => sub.unsubscribe();
  }, []);

  useLayoutEffect(() => {
    const sub = newState$
      .pipe(distinctUntilChanged())
      .subscribe(state => state$.next(state), setErrorState);
    return () => sub.unsubscribe();
  }, [newState$]);

  return [state, dispatch, error];
};
