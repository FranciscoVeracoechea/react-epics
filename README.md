# react-epics
Strongly typed functions as state management using [RxJS](https://rxjs.dev/) for your [React](https://reactjs.org/) Components.

## 🚀 Epics

An **Epic** is a function which takes an stream of actions (```action$```), an stream of the current state (```state$```), and an optional object of ```dependencies```, this function returns an Observable of the new state.

Once you're inside your Epic, use any Observable patterns you desire as long as any output from the final, returned stream, is the new state.

This idea, which is based on **redux** allow us to use all RxJS awesome abilites in our React components with a simple but powerful API.


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
    map(([action, state]) => ({ counter: state.counter + action.payload }))
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