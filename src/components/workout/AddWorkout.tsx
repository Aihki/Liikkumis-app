import { TouchableOpacity, Text, View, Platform } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/LocalTypes';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { StyleSheet } from 'react-native';

interface AddWorkoutProps {
  onWorkoutAdded: () => void;
}

const AddWorkout: React.FC<AddWorkoutProps> = ({ onWorkoutAdded }) => {

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const navigateToAddWorkout = () => {
    navigation.navigate('AddWorkoutScreen', { onWorkoutAdded });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={navigateToAddWorkout}
        style={styles.addButton}
        activeOpacity={0.7}
      >
        <FontAwesome name="plus" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1, // Ensuring a stacking context
  },
  addButton: {
    position: 'absolute',
    right: 13,
    top: Platform.OS === 'ios' ? 28 :  37,
    width: Platform.OS === 'ios' ? 47 : 44,
    height: Platform.OS === 'ios' ? 47 : 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6366f1',
    borderRadius: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 20, // High zIndex for the button
  }
});

export default AddWorkout;
