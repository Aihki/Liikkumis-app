// ContextHooks.ts
import {useContext} from 'react';
import {UserContext} from '../contexts/UserContext';
//import {UpdateContext} from '../contexts/UpdateContext';


const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within an UserProvider');
  }

  return context;
};

export {useUserContext};
