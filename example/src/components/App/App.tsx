import './App.css';
import { StoreProvider } from 'react-epics';
// containers
import Counter from '../Counter';
import Message from '../Message';
import Cats from '../Cats';
// store
import store from '../../store';

function App() {
  return (
    <StoreProvider store={store}>
      <div className="App">
        <Cats />
        <Message />
        <Counter />
      </div>
    </StoreProvider>
  );
}

export default App;
