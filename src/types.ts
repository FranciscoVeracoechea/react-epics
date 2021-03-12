import { Observable } from 'rxjs';

export type Action<Payload> = {
  type: string;
  payload: Payload;
};

export type Dispatch<Payload> = (action: Action<Payload>) => void;

export type Action$<P> = Observable<Action<P>>;

export type State$<T> = Observable<T>;

export type Epic<Payload, State, Dependencies = {}> = (
  actions$: Action$<Payload>,
  state: State$<State>,
  dependecies: Dependencies,
) => State$<State>;
