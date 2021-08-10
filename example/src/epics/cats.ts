import { Epic } from 'react-epics';
import { map, merge, switchMap, tap } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { ICat } from 'src/types';

export const initialState: ICat = {
  apiUrl: 'https://cataas.com/cat',
  loading: false,
  image: '',
};

export const onError = (e: Error) => console.log(e);

export const epic: Epic<ICat> = ({ ofType, dispatch }) => {

  const isLoading$ = ofType('cats/loadingUpdate').pipe(
    map(([action, state]) => {
      return {
        ...state,
        loading: true,
      };
    }),
  );

  const fetch$ = ofType('cats/fetch').pipe(
    tap(() => dispatch({ type: 'cats/loadingUpdate', payload: {} })),
    switchMap(([action, state]) =>
      fromFetch(state.apiUrl + `?query=${Math.round(Math.random() * 1000)}`, {
        selector: (res) => res.blob(),
      }).pipe(
        map((blob) => {
          return {
            ...state,
            loading: false,
            image: URL.createObjectURL(blob),
          };
        }),
      ),
    ),
  );

  return merge(fetch$, isLoading$);
};

