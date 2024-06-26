import React, { useState, useEffect } from 'react';
import { SafeAreaView, View } from 'react-native';
import AddWorkout from '../components/workout/AddWorkout';
import Workouts from '../components/workout/Workouts';


const Exercise = () => {
  const [updateWorkouts, setUpdateWorkouts] = useState(false);

  const triggerWorkoutsUpdate = () => {
    setUpdateWorkouts(prevState => !prevState);
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
