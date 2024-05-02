import { Image, Text, TouchableOpacity, View } from "react-native"
import { RootStackParamList } from "../../types/LocalTypes";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useUserContext } from "../../hooks/ContextHooks";
import { useChallenge } from "../../hooks/apiHooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Challenge } from "../../types/DBTypes";
import { useEffect, useState } from "react";

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


const ChallengeDetails = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'ChallengeDetails'>>();
  const { challengeId, completed } = route.params;


  const { user } = useUserContext();

  const { getChallengeByChallengeId, joinChallenge, leaveChallenge, checkIfUserIsInChallenge } = useChallenge();

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [joined, setJoined] = useState<boolean>(false);

  const getChallenge = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token || !user) return;
    try {
      const response = await getChallengeByChallengeId(challengeId);
      setChallenge(response);
    } catch (error) {
      console.error(error);
    }
  };

  const takePartInChallenge = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token || !user) {
      console.error('No token or user information available.');
      return;
    }
    try {
      const response = await joinChallenge(challengeId, user.user_id, token);
      if (response.hasOwnProperty('success')) {
        setJoined(response.success);
      } else {
        console.error('Unexpected response from the server:', response);
      }
    } catch (error) {
      console.error('Error joining challenge:', error);
      setJoined(false);
    }
  };

  const leaveFromChallenge = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token || !user) {
      console.error('No token or user information available.');
      return;
    }
    try {
      const response = await leaveChallenge(challengeId, user.user_id, token);
      if (response.hasOwnProperty('success')) {
        setJoined(false);
      } else {
        console.error('Unexpected response from the server:', response);
      }
    } catch (error) {
      console.error('Error leaving challenge:', error);
      setJoined(true);
    }
  };

  const checkIfUserJoinedChallenge = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token || !user) {
      console.log('No token or user available');
      return;
    }

    try {
      const response = await checkIfUserIsInChallenge(challengeId, user.user_id, token);
      if (response.success) {
        setJoined(response.hasJoined);
      } else {
        console.log('Failed to fetch join status from the server');
        setJoined(false);
      }
    } catch (error) {
      console.error('Error checking join status:', error);
      setJoined(false);
    }
  };


  useEffect(() => { getChallenge(), checkIfUserJoinedChallenge(); }, []);


  return (
    <View className="flex-1 bg-gray-100  items-center">
      {challenge && (
        <>

            <Image
              className="w-full h-64 object-cover"
              source={challengeImages[challenge.challenge_name] || challengeImages['default']}
            />


          <View className="bg-white p-4 rounded-lg shadow-md w-full">
            <Text className="text-[19px] font-bold mb-4">{challenge.challenge_name}</Text>
            <Text className="mb-4 text-[16px]">{challenge.description}</Text>
            <Text className="font-semibold">Target: {challenge.target_value} {challenge.target_type}</Text>
            {!joined ? (
              <TouchableOpacity className="mt-4 bg-blue-500 p-2 rounded-lg" onPress={takePartInChallenge}>
                <Text className="text-white text-center font-semibold">Join Challenge</Text>
              </TouchableOpacity>
            ) : (
              completed ? (
                <View className="mt-4 bg-green-500 p-2 rounded-lg">
                  <Text className="text-white text-center font-semibold">Challenge Completed</Text>
                </View>
              ) : (
                <TouchableOpacity className="mt-4 bg-red-500 p-2 rounded-lg" onPress={leaveFromChallenge}>
                  <Text className="text-white text-center font-semibold">Leave Challenge</Text>
                </TouchableOpacity>
              )
            )}

          </View>
        </>
      )}
    </View>
  );
}

export default ChallengeDetails
