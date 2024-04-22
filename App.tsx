import {StatusBar} from 'expo-status-bar';
import Navigator from './src/navigators/navigator';
import React from 'react';
import {UserProvider} from './src/contexts/UserContext';
import {UpdateProvider} from './src/contexts/UpdateContext';
import { MenuProvider } from 'react-native-popup-menu';


const App = () => {
  return (
    <MenuProvider>
    <UserProvider>
      <UpdateProvider>
        <Navigator />
        <StatusBar style="auto" />
      </UpdateProvider>
    </UserProvider>
    </MenuProvider>
  );
};

export default App;
