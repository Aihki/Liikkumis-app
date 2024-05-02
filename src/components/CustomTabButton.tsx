import React from 'react';
import { TouchableOpacity, View, StyleSheet, GestureResponderEvent } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs'; // Importing types
import { Entypo } from '@expo/vector-icons'; // Ensure to import Icon if used inside
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/LocalTypes';

interface CustomTabButtonProps extends BottomTabBarButtonProps {
  children: React.ReactNode;
}

const CustomTabButton: React.FC<CustomTabButtonProps> = ({ accessibilityState, children }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handlePress = (e: GestureResponderEvent) => {
    e.preventDefault();
    navigation.navigate('AddWorkoutScreen', { onWorkoutAdded: () => console.log("Workout Added") });
  };

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={accessibilityState}
      onPress={handlePress}
      style={styles.button}
    >
      <View style={styles.innerCircle}>
        {children}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
});

export default CustomTabButton;
