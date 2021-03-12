# react-epics
Strongly typed functions as state management using [RxJS](https://rxjs.dev/) for your [React](https://reactjs.org/) Components.

[![MIT](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](https://github.com/FranciscoVeracoechea/react-epics/blob/master/LICENSE)
![Typescript](https://img.shields.io/badge/Typescript-100%25-blue)
![GitHub last commit](https://img.shields.io/github/last-commit/FranciscoVeracoechea/react-epics?color=blue)
[![npm version](https://img.shields.io/badge/npm%20version-0.1.2-blue)](https://badge.fury.io/js/react-epics)

## 🚀 Epics

An **Epic** is a function which takes an stream of actions (```action$```), an stream of the current state (```state$```), and an optional object of ```dependencies```, this function returns an Observable of the new state.

Once you're inside your Epic, use any Observable patterns you desire as long as any output from the final, returned stream, is the new state.

This idea, which is based on **redux** allows us to use all RxJS awesome abilities in our React components with a simple but powerful API.


## 🛠 Installation
```react-epics``` needs both **react** and **rxjs** as peer dependencies.
### npm
    npm install react-epics rxjs react
### yarn
    yarn add react-epics rxjs react

## 🔧 Usage

```ts
type State = {
  counter: number;
}
type Payload = number;

const initialState: State = {
  counter: 0
}

const couterEpic: Epic<Payload, State> = (action$, state$) => {

  const plus$ = action$.pipe(
    ofType('plus'),
    withLatestFrom(state$),
    map(([action, state]) => ({ counter: state.counter + action.payload }))
  );

  const minus$ = action$.pipe(
    ofType('minus'),
    withLatestFrom(state$),
    map(([action, state]) => ({ counter: state.counter - action.payload }))
  );

  return merge(plus$, minus$);
}

function Counter() {
  const [value, setValue] = useState(1);
  const [state, dispatch] = useEpic(couterEpic, initialState);
  return (
    <div>
      <p>Value</p>
      <input type="number" value={value} onChange={e => setValue(Number(e.target.value))} />
      <button onClick={() => dispatch({ type: 'plus', payload: value })}>
        plus
      </button>
      <button onClick={() => dispatch({ type: 'minus', payload: value })}>
        minus
      </button>
      <h3>
        Counter: {state.counter}
      </h3>
    </div>
  )
}
```

## 📖 Documentation

### ```useEpic()```

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

The ```useEpic()``` hook, accepts an **epic** function, the initial state and an optional dependency object. It returns an array with the current state, dispatch callback and a nullable error.

### ```epic()```

An **Epic** is a function which takes an stream of actions (```action$```), an stream of the current state (```state$```), and an optional object of ```dependencies```, this function returns an Observable of the new state.

The idea of the Epic comes from [redux-observable](https://redux-observable.js.org/), but because redux-observable is redux middleware, the observable returned from the Epic emits new actions, ```react-epics``` expects the Epic to return an observable of state updates.

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

