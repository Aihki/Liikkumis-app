import {StatusBar} from 'expo-status-bar';
import Navigator from './src/navigators/Navigator';
import {UserProvider} from './src/contexts/UserContext';
import {UpdateProvider} from './src/contexts/UpdateContext';

const App = () => {
  return (
    <UserProvider>
      <UpdateProvider>
        <Navigator />
        <StatusBar style="auto" />
      </UpdateProvider>
    </UserProvider>
  );
};

export default App;
