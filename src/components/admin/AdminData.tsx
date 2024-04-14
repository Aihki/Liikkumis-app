import { View, Text, TouchableOpacity } from "react-native";
import { useUser, useWorkouts } from "../../hooks/apiHooks";
import { useEffect, useState } from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const AdminData = () => {
  const { getUserCount } = useUser();
  const { getCompletedWorkoutsCount, getMostPopularWorkoutType } = useWorkouts();
  const [completedWorkouts, setCompletedWorkouts] = useState<number>();
  const [mostPopularType, setMostPopularType] = useState<Array<{ workout_type: string; count: number }> | null>(null);
  const [isOpen, setIsOpen] = useState(false)

  const toggleDataList = () => {
    setIsOpen(!isOpen);
  }



  const fetchCompletedWorkoutsCount = async () => {
    try {
      const completedCount = await getCompletedWorkoutsCount();
      console.log(completedCount);

      setCompletedWorkouts(completedCount.count)
    } catch (error) {
      console.log("Failed to fetch completed workout count", error);

    }
  };

  const fetchMostPopularWorkoutType = async () => {
    try {
      const response = await getMostPopularWorkoutType();
      setMostPopularType(response.length > 0 ? [response[0]] : null);
    } catch (error) {
      console.error("Failed to fetch most popular workout type", error)
    }
  }


  useEffect(() => {
    fetchCompletedWorkoutsCount();

    fetchMostPopularWorkoutType();
  }, []);

  console.log(mostPopularType);

  return (
    <>
      {mostPopularType && (
        <>
        <View className="pt-5 px-4">
          <TouchableOpacity
            className="flex flex-row items-center bg-white border border-gray-400 p-2 rounded-lg w-full"
            onPress={toggleDataList}
          >
            <Text className="text-xl font-bold mr-3 flex-1 text-center">Data</Text>
            <FontAwesome
              name={isOpen ? 'caret-up' : 'caret-down'}
              size={25}
              color="black"
              style={{ alignSelf: 'center' }} // Center align if needed
            />
          </TouchableOpacity>
        </View>
        {isOpen && (
          <View className="flex w-screen gap-4 py-2 px-4 ">
            <View className="bg-green-100 w-full border border-green-300 p-2 rounded-lg">
              <Text className="text-xl font-normal text-center">
                Completed Workouts: <Text className="font-bold">{completedWorkouts}</Text>
              </Text>
            </View>

            <View className="bg-green-100 w-full border border-green-300 p-3 rounded-lg">
              <Text className="text-xl font-normal text-center mb-2">Most Popular Workout Type:</Text>
              <View className="flex items-center justify-center">
                <Text className="text-lg text-green-900 font-bold">{mostPopularType[0].workout_type}</Text>
                <Text className="text-lg text-green-900 font-bold">({mostPopularType[0].count})</Text>
              </View>
            </View>
            <View className="border-b w-full border-gray-300"/>
          </View>
        )}

        </>
      )}
    </>

  );
};

export default AdminData;
