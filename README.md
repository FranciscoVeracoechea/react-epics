# react-epics

Predictable state management solution for [React](https://reactjs.org/) applications.
React-Epics is a valuable tool for organizing your state. Inspired by [Redux](https://github.com/reduxjs/redux) it uses the power of [RxJS](https://rxjs.dev/) observables and react hooks to manage state changes.

[![MIT](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](https://github.com/FranciscoVeracoechea/react-epics/blob/master/LICENSE)
![Typescript](https://img.shields.io/badge/Typescript-100%25-blue)
![Pull Requests](https://img.shields.io/badge/PRs-welcome-blue)
![GitHub last commit](https://img.shields.io/github/last-commit/FranciscoVeracoechea/react-epics?color=blue)
[![npm version](https://img.shields.io/badge/npm%20version-0.1.2-blue)](https://badge.fury.io/js/react-epics)

## 🚀 Epics

An **Epic** is a function which takes an stream of actions (`action$`), an stream of the current state (`state$`), and function returns an Observable of the new state.

Once you're inside your Epic, use any Observable patterns you desire as long as any output from the final, returned stream, is the new state.

This idea, which is based on **redux** allows us to use all RxJS awesome abilities in our React components with a powerful API.

## 🛠 Installation

`react-epics` needs both **react** and **rxjs** as peer dependencies.

### npm

    npm install react-epics rxjs react

### yarn

    yarn add react-epics rxjs react

## 🔧 Usage

### 1. Create your state types: `src/types.ts`

```ts
export type ICounter = {
  value: number;
};
```

### 2. Setup your epic: `src/epics/counter.ts`

```ts
import { map } from 'rxjs/operators';
import { merge } from 'rxjs';
import { Epic } from 'react-epics';
import { ICounter } from '../types';

export const initialState: ICounter = {
  value: 0,
};

export const epic: Epic<ICounter> = ({ ofType }) => {
  // plus action
  const plus$ = ofType('counter/plus').pipe(
    map(([action, state]) => {
      return { value: state.value + action.payload };
    }),
  );
  // minus action
  const minus$ = ofType('counter/minus').pipe(
    map(([action, state]) => {
      return { value: state.value - action.payload };
    }),
  );
  // merge all actions into one observable
  return merge(plus$, minus$);
};
```

### 3. Register your epics in the store: `src/App.tsx`

```ts
import * as React from 'react';
import { createStore, StoreProvider } from 'react-epics';
// epics
import * as counter from './epics/counter';
// components
import Counter from './components/Counter';

// store
const store = createStore({
  counter,
});

const App: React.FC = () => {
  return (
    <StoreProvider store={store}>
      <div className="App">
        <Counter />
      </div>
    </StoreProvider>
  );
};
```

### 4. Use it on any component: `src/components/Counter.tsx`

```ts
import * as React from 'react';
import { useDispatch, useEpic } from 'react-epics';
import { ICounter } from '../types.ts';

const Counter: React.FC = () => {
  const dispatch = useDispatch();
  const { value } = useEpic<ICounter>('counter'); // name of the registered epic

  // actions
  const plus = () =>
    dispatch({
      type: 'counter/plus',
      payload: 1,
    });
  const minus = () =>
    dispatch({
      type: 'counter/minus',
      payload: 1,
    });

  return (
    <div className="counter-wrapper">
      <h2>Couter: {value}</h2>
      <button onClick={plus}>+</button>
      <button onClick={minus}>-</button>
    </div>
  );
};
```

## 📖 Documentation - Deprecated!!!

### `useEpic()`

This is a [React hook](https://reactjs.org/docs/hooks-intro.html) that allows us to use RxJS Observables for state management.

```ts
type State = {...}
type Payload = {...}

type Dispatch = (action: Action<Payload>) => void;

type useEpic = (
  epic: Epic<Payload, State, Dependencies>,
  initialState: State,
  dependecies?: Dependencies,
) => [State, Dispatch, Error | null]
```

The `useEpic()` hook, accepts an **epic** function, the initial state and an optional dependency object. It returns an array with the current state, dispatch callback and a nullable error.

### `epic()`

An **Epic** is a function which takes an stream of actions (`action$`), an stream of the current state (`state$`), and an optional object of `dependencies`, this function returns an Observable of the new state.

The idea of the Epic comes from [redux-observable](https://redux-observable.js.org/), but because redux-observable is redux middleware, the observable returned from the Epic emits new actions, `react-epics` expects the Epic to return an observable of state updates.

```ts
type State = {...}
type Payload = {...}

type Action = {
  type: string;
  payload: Payload;
};

type Action$<P> = Observable<Action>;

type State$ = Observable<State>;

type Epic<Payload, State, Dependencies = {}> = (
  actions$: Action$<Payload>,
  state: State$,
  dependecies: Dependencies,
) => State$;
```

### Operators

#### ofType

This operator filters the actions emited by the actions obserbable (`action$`) depeding if the emited action type match with the
action type parameter.

```ts
  type ofType(actionType: string) => OperatorFunction<Action<Payload>>
```

##### example:

```ts
type State = 'foo' | 'bar';
type Payload = {...}
const FooBarEpic: Epic<Payload, State> = (action$) => {

  const foo$ = action$.pipe(
    ofType('FOO'),
    mapTo('foo')
  );

  const bar$ = action$.pipe(
    ofType('BAR'),
    mapTo('bar')
  );

  return merge(foo$, bar$);
}
```

#### mapAction

The mapAction operator maps the emited value if the action match the action type parameter, notice that it doesn't apply a filter
so the next actions emited won't be filtered out of the stream.

```ts
  type mapCallback(action: Action<Payload>) => State
  type mapAction(actionType: string, mapCallback) => OperatorFunction<State>
```

##### example:

```ts
type State = 'foo' | 'bar';
type Payload = {...}
const FooBarEpic: Epic<Payload, State> = (action$) => {
  return action$.pipe(
    mapAction(
      'FOO', (action) => 'foo'
    ),
    mapAction(
      'BAR', (action) => 'bar'
    ),
  );
}
```
