import { createStore } from 'react-epics';
// epics
import * as message from './epics/message';
import * as counter from './epics/counter';
import * as cats from './epics/cats';

const store = createStore({
  message,
  counter,
  cats,
});

export default store;