import { filter, map } from 'rxjs/operators';
import { Action } from './types';

export const ofType = <Payload = unknown>(actionType: string) =>
  filter((action: Action<Payload>) => action.type === actionType);

export const mapAction = <T, Payload = unknown>(
  actionType: string,
  mapFn: (action: Action<Payload>) => T,
) => {
  return map<Action<Payload>, T | Action<Payload>>(action => {
    return actionType === action.type ? mapFn(action) : action;
  });
};
