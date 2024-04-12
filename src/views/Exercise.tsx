import React, { useState, useEffect } from 'react';
import { SafeAreaView, View } from 'react-native';
import AddWorkout from '../components/AddWorkout';
import Workouts from '../components/Workouts';


const Exercise = () => {
  const [updateWorkouts, setUpdateWorkouts] = useState(false);

  const triggerWorkoutsUpdate = () => {
    setUpdateWorkouts(prevState => !prevState); // Toggle to trigger useEffect
  };



  return (
    <SafeAreaView style={{paddingTop: 20}}>
      <View>
        <AddWorkout onWorkoutAdded={triggerWorkoutsUpdate} />

        <Workouts updateWorkouts={updateWorkouts} />
      </View>
    </SafeAreaView>
  );
};

export default Exercise;
