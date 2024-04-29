import { TouchableOpacity, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/LocalTypes';
import FontAwesome from "react-native-vector-icons/FontAwesome";

interface AddWorkoutProps {
  onWorkoutAdded: () => void;
}

const AddWorkout: React.FC<AddWorkoutProps> = ({ onWorkoutAdded }) => {

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const navigateToAddworkout = () => {
    navigation.navigate('AddWorkoutScreen', { onWorkoutAdded });
  };

  return (
    <View className='relative'>
      <TouchableOpacity
        onPress={navigateToAddworkout}
        className='absolute right-4 top-9 w-11 h-11 flex justify-center items-center bg-[#4ade80]  rounded-full shadow-lg z-10'
        activeOpacity={0.7}
      >
        <FontAwesome
            name="plus"
            size={24}
            color="#FFFFFF"
        />
      </TouchableOpacity>
    </View>
  );
}

export default AddWorkout
