import { Text, View } from "react-native"
import { useUserContext } from "../../hooks/ContextHooks"
import { useExercise } from "../../hooks/apiHooks";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PersonalBest } from "../../types/DBTypes";
import { useFocusEffect } from "@react-navigation/native";

const PersonalBestC = () => {

  const { user } = useUserContext();
  const { getPersonalBestForProfile } = useExercise();
  const [personalB, setPersonalB] = useState<PersonalBest[] | null>(null)


  const personalBestUser = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token || !user ) return
      const response = await getPersonalBestForProfile(user.user_id, token);
      console.log(response);

      setPersonalB(response)
    } catch (error) {
      console.error('error getting pb: ', error)
    }
  }


  useFocusEffect(
    React.useCallback(() => {
      personalBestUser();
      return () => {};
    }, [])
  );

  return (
    <View className="p-2 my-5 items-center">
      <Text className="text-center text-[18px] font-medium pb-2">Personal Bests</Text>
      {personalB && personalB.length > 0 ? personalB.map(pb => (
        <View key={pb.pb_id} className="p-2 m-2 w-[85%] bg-white rounded-lg shadow relative overflow-hidden">
          <View className="flex flex-row items-center justify-between z-10">
            <Text className="text-lg font-bold ml-2">{pb.exercise_name}</Text>
            <Text className="text-white text-[16px] font-bold mr-2">{pb.max_weight} KG</Text>
          </View>
          <View className="absolute bg-indigo-500 w-[250px] h-[250px] top-0 -right-28 transform rotate-45 translate-x-1/2 -translate-y-1/"></View>
        </View>
      )) : <Text className="text-center text-gray-500">No personal bests to display.</Text>}
    </View>
  );
}

export default PersonalBestC
