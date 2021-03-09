# react-epics
Strong typed functions as state management using RxJS for your React Components.

## Epics

An Epic is a function which takes an stream of actions **(action$)**, an stream of the current state **(state$)**, and an optional object of dependencies, this function returns an Observable of the new state.

Once you're inside your Epic, use any Observable patterns you desire as long as any output from the final, returned stream, is the new state.

This idea, which is based on **redux** allow us to use all RxJS awesome abilites in our React components with a simple but powerful API.

## Usage

```ts
import React from 'react';
import { Epic, ofType, useEpic } from 'react-epics';
import { map, withLatestFrom } from 'rxjs/operators';
import { merge } from 'rxjs';
import { useState } from 'react';

type State = {
  counter: number;
}
type Payload = {
  value: number
}
type Deps = {
  multiplier: number
}

const initialState: State = {
  counter: 0
}

const couterEpic: Epic<Payload, State, Deps> = (action$, state$, deps) => {
  const { multiplier } = deps;

  const plus$ = action$.pipe(
    ofType('plus'),
    withLatestFrom(state$),
    map(([{ payload: { value } }, { counter }]) => ({ counter: counter + (value * multiplier) }))
  );

  const minus$ = action$.pipe(
    ofType('minus'),
    withLatestFrom(state$),
    map(([{ payload: { value } }, { counter }]) => ({ counter: counter - (value * multiplier) }))
  );

  return merge(plus$, minus$);
}

function App() {
  const [multiplier, setMultiplier] = useState(1);
  const [state, dispatch, error] = useEpic(couterEpic, initialState, { multiplier });
  return (
    <div>
      <p>multiplier</p>
      <input type="number" value={multiplier} onChange={e => setMultiplier(Number(e.target.value))} />
      <button onClick={() => dispatch({ type: 'plus', payload: { value: 1 } })}>
        plus
      </button>
      <button onClick={() => dispatch({ type: 'minus', payload: { value: 1 } })}>
        minus
      </button>
      <h3>
        {state.counter}
      </h3>
      <p>
        {JSON.stringify(error)}
      </p>
    </div>
  )
}


```