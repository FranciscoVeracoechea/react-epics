import { filter, map, withLatestFrom } from 'rxjs/operators';
import { Action$, State$, Action } from './types';

// export const ofType = (actionType: string) =>
//   filter((action: Action) => action.type === actionType);

export const createOfType =
  <S, P = any>(action$: Action$<P>, state$: State$<S>) =>
  (actionType: string) =>
    action$.pipe(
      filter((action: Action<P>) => action.type === actionType),
      withLatestFrom(state$),
    );

export const mapAction = <T>(
  actionType: string,
  mapFn: (action: Action) => T,
) => {
  return map<Action, T | Action>((action) => {
    return actionType === action.type ? mapFn(action) : action;
  });
};
