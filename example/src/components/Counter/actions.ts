import { Dispatch } from 'react-epics';


export const createAddToCounter = (dispatch: Dispatch) => (): void => {
  dispatch({
    type: 'counter/plus',
    payload: {
      number: 1,
    },
  });
}