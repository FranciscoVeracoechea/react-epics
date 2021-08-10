import { FC, useEffect } from 'react';
import { useDispatch, useEpic } from 'react-epics';
import { ICat } from 'src/types';


const Cats: FC = () => {
  const cats = useEpic<ICat>('cats');
  const dispatch = useDispatch();

  const fetchNewCat = () => dispatch({ type: 'cats/fetch' });

  useEffect(() => fetchNewCat(), []);

  if (cats.loading) {
    return (
      <div>
        <h3>Loading cats...</h3>
      </div>
    );
  }

  return (
    <div>
      <br />
      <h2>Cats</h2>

      <button onClick={fetchNewCat}>
        Load cats
      </button>
      
      <img style={{ maxHeight: 400 }} src={cats.image} alt="cat" />
      <br />
      <hr />
    </div>
  );
};


export default Cats;