import {useCallback, useEffect, useState} from "react"
import {Alert, FlatList, TouchableOpacity, View} from "react-native"
import {Exercise} from "../types/DBTypes"
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useUserContext} from "../hooks/ContextHooks";
import {useExcersise} from "../hooks/apiHooks";
import {Text} from "react-native";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "../types/LocalTypes";

type AddExerciseProps =  {
  workoutId: number;
}

const Exercises: React.FC<AddExerciseProps> = ({ workoutId }) => {

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [userExercises, setuserExercises] = useState<Exercise[] | []>([]);
  const { user } = useUserContext();
  const { getUsersExcersisesByWorkoutId } = useExcersise();

  const getExercisesByWorkoutId = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token || !user) return;

    try {
      const exercisesResponse = await getUsersExcersisesByWorkoutId(user.user_id, workoutId, token);
      console.log(exercisesResponse);
      if (exercisesResponse) {
        setuserExercises(exercisesResponse);
      }
    } catch (error) {
      console.error(error);
    }
  };


  const deleteExercise = async (exerciseId: number) => {
    Alert.alert("Delete Exercise", "Are you sure you want to delete this exercise?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", onPress: () => console.log("Delete Exercise"), style: "destructive" },
    ]);
  };

  useFocusEffect(
    useCallback(() => {
      getExercisesByWorkoutId();
    }, [])
  );


  return (
    <View className="px-4 pb-2 h-[92%]">
      <Text className="w-full text-center  text-[22px] pb-3">Exercises</Text>
      {userExercises && userExercises.length > 0 ? (
        <FlatList
          data={userExercises}
          keyExtractor={(item) => item.exercise_id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('EditExerciseScreen', { exerciseId: item.exercise_id, refresh: true  })
              }}
            >
              <View className="bg-white p-4 mb-4 rounded-lg shadow">
                <TouchableOpacity className="absolute top-4 right-4 p-2 z-10">
                  <FontAwesome
                    name="trash"
                    size={24}
                    color="black"
                    onPress={() => deleteExercise(item.exercise_id)}
                  />
                </TouchableOpacity>
                <Text className="text-xl font-bold mb-2">{item.exercise_name}</Text>
                <Text className="text-gray-800 mb-1">Reps: {item.exercise_reps}</Text>
                <Text className="text-gray-600 mb-3">Weight: {item.exercise_weight}</Text>
                <Text className="text-gray-400">
                  Created at: {new Date(item.created_at).toISOString().split('T')[0]}
                </Text>
            </View>
          </TouchableOpacity>

          )}
          className="mt-2"
        />
      ) : (
        <View className="items-center">
          <Text className="text-lg text-gray-500 pt-5 ">No Exercises added.</Text>
        </View>
      )}
    </View>
  )
}

export default Exercises
