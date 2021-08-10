import { map } from 'rxjs/operators';
import { merge } from 'rxjs';
import { Epic } from 'react-epics';
import { ICounter } from '../types';

export const initialState: ICounter = {
  number: 0,
  loading: false,
};

export const epic: Epic<ICounter> = ({ ofType }) => {

  const plus$ = ofType('counter/plus').pipe(
    map(([action, state]) => {
      return {
        ...state,
        number: state.number + action.payload.number,
      };
    }),
  );

  const minus$ = ofType('counter/minus').pipe(
    map(([action, state]) => {
      return {
        ...state,
        number: state.number - action.payload.number,
      };
    }),
  );

  return merge(plus$, minus$);
};

export const onError = (e: Error) => console.log(e);