import { useDispatch, useEpic } from 'react-epics';
import * as React from 'react';
import { createAddToCounter } from './actions';
import { ICounter } from '../../types';

const Test: React.FC = () => {
  const dispatch = useDispatch();
  const counter = useEpic<ICounter>('counter');

  // actions
  const addToCounter = createAddToCounter(dispatch);

  return (
    <div className="couter-wrapper">
      <h2>Couter: {counter.number}</h2>
      <button onClick={() => addToCounter()}>+</button>
      <button
        onClick={() =>
          dispatch({
            type: 'counter/minus',
            payload: {
              number: 1,
            },
          })
        }>
        -
      </button>
      <br />
      <hr />
    </div>
  );
};

export default Test;
