import { Observable } from 'rxjs';

export type Action<P = any> = {
  type: string;
  payload?: P;
};

export type Dispatch<P = any> = (action: Action<P>) => void;

export type Action$<P = any> = Observable<Action<P>>;

export type State$<T> = Observable<T>;

export type Epic<S, P = any> = ({
  action$,
  state$,
  dispatch,
  ofType,
}: {
  action$: Action$;
  state$: State$<S>;
  dispatch: Dispatch;
  ofType: (actionType: string) => Observable<[Action<P>, S]>;
}) => Observable<S>;

export type Store<S = any> = {
  state$: Observable<S>;
  dispatch: Dispatch;
  epics: Record<
    string,
    { initialState: S; epic: Epic<S>; onError?: (e: Error) => void }
  >;
};

export type EpicsStore<S = any> = {
  state$: Observable<S>;
  dispatch: Dispatch;
  epics: Record<
    string,
    { initialState: S; epic: Epic<S>; onError?: (e: Error) => void }
  >;
};
