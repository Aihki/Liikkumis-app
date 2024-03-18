import {FlatList} from 'react-native';
import {NavigationProp, ParamListBase} from '@react-navigation/native';


const Home = ({navigation}: {navigation: NavigationProp<ParamListBase>}) => {


  return (
    <>
      <FlatList
        data={[]}
        renderItem={() => null}
        keyExtractor={() => ''}
      />
    </>
  );
};

export default Home;
