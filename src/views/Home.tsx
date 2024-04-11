import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import { useUserContext } from '../hooks/ContextHooks';


const Home = ({navigation}: {navigation: NavigationProp<ParamListBase>}) => {

  const { handleLogout } = useUserContext();

  return (
    <View>
      <TouchableOpacity
        onPress={handleLogout}
      >
        <Text>Logout</Text>
      </TouchableOpacity>


    </View>
  );
};

export default Home;
