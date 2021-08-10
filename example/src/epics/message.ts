
import { map } from 'rxjs/operators';
import { Epic } from 'react-epics';
import { IMessage } from '../types';

export const initialState: IMessage = {
  value: '',
  loading: false,
};

export const epic: Epic<IMessage> = ({ action$, ofType }) => {

  return ofType('message/updated').pipe(
    map(([action, state]) => {
      return {
        ...state,
        value: action.payload.value,
      };
    }),
  );
};

export const onError = (e: Error) => console.log(e);
