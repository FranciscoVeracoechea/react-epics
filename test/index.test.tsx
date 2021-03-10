import * as React from 'react';
import { Epic, ofType, useEpic } from '../src';
import { map, withLatestFrom } from 'rxjs/operators';
import { merge } from 'rxjs';
import { useState } from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

type State = {
  counter: number;
};

type Payload = {
  value: number;
};

type Deps = {
  multiplier: number;
};

const couterEpic: Epic<Payload, State, Deps> = (action$, state$, deps) => {
  const { multiplier } = deps;
  const plus$ = action$.pipe(
    ofType('plus'),
    withLatestFrom(state$),
    map(([{ payload: { value } }, { counter }]) => ({
      counter: counter + value * multiplier,
    })),
  );
  const minus$ = action$.pipe(
    ofType('minus'),
    withLatestFrom(state$),
    map(([{ payload: { value } }, { counter }]) => ({
      counter: counter - value * multiplier,
    })),
  );
  return merge(plus$, minus$);
};

const initialState: State = {
  counter: 0,
};

function App() {
  const [multiplier, setMultiplier] = useState(1);
  const [state, dispatch, error] = useEpic(couterEpic, initialState, {
    multiplier,
  });

  return (
    <div>
      <p>multiplier</p>
      <input
        type="number"
        value={multiplier}
        onChange={e => setMultiplier(Number(e.target.value))}
      />
      <button onClick={() => dispatch({ type: 'plus', payload: { value: 1 } })}>
        plus
      </button>
      <button
        onClick={() => dispatch({ type: 'minus', payload: { value: 1 } })}>
        minus
      </button>
      <h3>{state.counter}</h3>
      <p>{JSON.stringify(error)}</p>
    </div>
  );
}

describe('React Epics App', () => {
  it('renders without crashing', () => {
    render(<App />);
  });
});
