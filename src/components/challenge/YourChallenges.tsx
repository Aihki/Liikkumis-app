import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { useChallenge } from "../../hooks/apiHooks";
import { RouteProp, useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../types/LocalTypes";
import * as Progress from 'react-native-progress';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CombinedChallenge } from "../../types/DBTypes";

type ExerciseImageMap = {
  [key: string]: any;
}

const challengeImages: ExerciseImageMap = {
  'Bronze Running': require('../../assets/images/cardio_bronze.png'),
  'Silver Running': require('../../assets/images/cardio_silver.png'),
  'Gold Running': require('../../assets/images/cardio_gold.png'),
  'Platinum Running': require('../../assets/images/cardio_platinum.png'),
  'Bronze Strength': require('../../assets/images/gym_bronze.png'),
  'Silver Strength': require('../../assets/images/gym_silver.png'),
  'Gold Strength': require('../../assets/images/gym_gold.png'),
  'Platinum Strength': require('../../assets/images/gym_platinum.png'),
  'Bronze Bodyweight': require('../../assets/images/body_bronze.png'),
  'Silver Bodyweight': require('../../assets/images/body_silver.png'),
  'Gold Bodyweight': require('../../assets/images/body_gold.png'),
  'Platinum Bodyweight': require('../../assets/images/body_platinum.png'),

  'default': 'https://via.placeholder.com/640x360/000000/FFFFFF?text=+',
};


const YourChallenges = () => {
  const { getChallengeByUserId } = useChallenge();
  const route = useRoute<RouteProp<RootStackParamList, 'YourChallenges'>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { userId } = route.params;
  const [challenges, setChallenges] = useState<CombinedChallenge[]>([]);

  const getChallengesByUId = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token || !userId) return;
    try {
      const response = await getChallengeByUserId(userId);
      console.log(response);

      setChallenges(response);
    } catch (error) {
      console.error("Failed to fetch challenges:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getChallengesByUId();
      return () => {};
    }, [userId])
  );




  const renderItem = ({ item }: { item: CombinedChallenge }) => {

    const progressPercentage = Math.round(Math.min((item.progress / item.target_value) * 100, 100));



    return (

    <View className={` rounded-lg shadow my-1 relative ${progressPercentage === 100 ? 'bg-green-50 border border-green-400' : 'bg-white border-red-500'}`} >
      <View className="p-4 w-[65%] border-r border-gray-300 ">
        <Text className="text-lg font-bold">{item.challenge_name}</Text>
      </View>
      <View className={`w-[65%] border-t  ${progressPercentage === 100 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-300'}`}>
      <Text className="text-sm text-gray-500 pl-4 pt-2">
        Progress: {progressPercentage}%
      </Text>
        <View className="pl-4 pb-4 pt-[5px]">
          <Progress.Bar progress={item.progress / item.target_value}  indeterminateAnimationDuration={4000}  animated={true} width={200} height={11} color="#22C55E" borderColor="#9CA3AF" />
        </View>
      </View>
      <Image
        source={challengeImages[item.challenge_name] || challengeImages['default']}
          className={`w-[127px] h-full object-cover absolute right-0 top-0 rounded-r-lg  ${progressPercentage === 100 ? 'bg-green-100' : 'bg-white opacity-30'} `}
      />
  </View>
  )};

  return (
    <View className="flex-1 bg-gray-100 px-4 py-2">
      {challenges.length > 0 ? (
        <FlatList
          data={challenges}
          renderItem={renderItem}
          keyExtractor={item => item.user_challenge_id.toString()}
        />
      ) : (
        <Text className="text-center text-gray-500 text-lg">No challenges joined yet.</Text>
      )}
    </View>
  );
}

export default YourChallenges;
