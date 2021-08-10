import { BehaviorSubject, isObservable, Subject } from 'rxjs';
import { Action } from '..';
import { Epic, Dispatch } from '../types';
import { createOfType } from '../operators';
import { distinctUntilChanged } from 'rxjs/operators';

type Inputs = Record<
  string,
  { initialState: any; epic: Epic<any>; onError?: (e: Error) => void }
>;

const getInitialState = <T extends Inputs>(inputs: T) => {
  const state = {} as {
    [Property in keyof T]: T[Property]['initialState'];
  };

  for (const prop in inputs) {
    if (inputs.hasOwnProperty(prop)) {
      const { initialState } = inputs[prop];
      state[prop] = initialState;
    }
  }

  return state;
};

export const createStore = <T extends Inputs>(epics: T) => {
  const initialStoreState = getInitialState(epics);
  const action$ = new Subject<Action>();
  const store$ = new BehaviorSubject(initialStoreState);

  const dispatch: Dispatch = action => {
    if (!action.type) {
      throw new Error('ReactEpic: Invalid action type');
    }
    action$.next(action);
  };

  for (const prop in epics) {
    if (epics.hasOwnProperty(prop)) {
      const { initialState, epic, onError } = epics[prop];
      const epicState$ = new BehaviorSubject(initialState);
      const _state$ = epicState$.asObservable();
      const ofType = createOfType(action$, _state$);

      const params = {
        action$: action$.asObservable(),
        state$: _state$,
        dispatch,
        ofType,
      };

      const epic$ = epic(params);
      if (!isObservable(epic$)) {
        throw new Error(`The ${prop} epic returns a invaid observable`);
      }

      epic$.pipe(distinctUntilChanged()).subscribe({
        next: state => epicState$.next(state),
        error: onError,
      });

      epicState$.subscribe(state => {
        const currentState = store$.getValue();
        store$.next({
          ...currentState,
          [prop]: state,
        });
      });
    }
  }

  const store = { state$: store$.asObservable(), dispatch, epics };

  return store;
};

