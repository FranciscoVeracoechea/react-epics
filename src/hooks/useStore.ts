import { useContext } from "react"
import { StoreContext } from '../store/Context';


const useStore = () => {
  const contextValue = useContext(StoreContext);

  if (!contextValue) {
    throw new Error(
      'could not find react-epic context value; please ensure the component is wrapped in a <StoreProvider>'
    )
  }

  return contextValue;
}

export default useStore;