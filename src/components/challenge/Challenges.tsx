import { Text, View, FlatList, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useEffect, useState } from "react";
import { useUserContext } from "../../hooks/ContextHooks";
import { useChallenge } from "../../hooks/apiHooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Challenge, UserChallenge } from "../../types/DBTypes";
import { RootStackParamList } from "../../types/LocalTypes";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

type ExerciseImageMap = {
  [key: string]: any;
}

type CombinedChallenge = Challenge & UserChallenge;

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

const Challenges = () => {

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { user } = useUserContext();
  const { getChallenges, getChallengeByUserId } = useChallenge();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [yourChallenges, setYourChallenges] = useState<Challenge[]>([]);
  const [filterType, setFilterType] = useState('All'); // 'Running', 'Strength', 'Bodyweight', 'All'
  const [filterCompleted, setFilterCompleted] = useState<boolean | null>(null);

  const fetchChallenges = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token || !user) return;

    try {
      const allChallenges = await getChallenges();
      const userChallenges = await getChallengeByUserId(user?.user_id);

      const markedChallenges = allChallenges.map(challenge => {
        let type = 'Other'; // Default type for uncategorized challenges
        if (challenge.challenge_name.includes('Running')) {
          type = 'Running';
        } else if (challenge.challenge_name.includes('Strength')) {
          type = 'Strength';
        } else if (challenge.challenge_name.includes('Bodyweight')) {
          type = 'Bodyweight';
        }

        // Check if there's a corresponding userChallenge and extract completion
        const userChallenge = userChallenges.find(uc => uc.challenge_id === challenge.challenge_id);
        return {
          ...challenge,
          type: type,
          completed: userChallenge ? userChallenge.completed : 0,
        };
      });

      setChallenges(markedChallenges);
    } catch (error) {
      console.error("Failed to fetch challenges:", error);
    }
  };

  const truncateText = (text: string, limit: number) => {
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  };

  useEffect(() => {
    fetchChallenges();
  }, [filterType, filterCompleted]);

  const filteredChallenges = challenges.filter(challenge => {
    return filterType === 'All' || challenge.type === filterType;
  });

  const renderItem = ({ item }: { item: CombinedChallenge }) => {

    console.log('Challenge ID: ddd', item.completed);

    return  (
    <TouchableOpacity onPress={() => navigation.navigate('ChallengeDetails', { challengeId: item.challenge_id, completed: item.completed})}>
      <View className={`${item.completed ? 'bg-green-100' : 'bg-white'} rounded-lg shadow my-2 relative flex-row items-center min-h-[125px] `}>
        <View className="flex-1 p-4">
          <Text className="text-lg font-bold">{item.challenge_name}</Text>
          <Text className="py-2">{truncateText(item.description, 65)}</Text>
        </View>
        <Image
          source={challengeImages[item.challenge_name] || challengeImages['default']}
          className="w-[127px] h-full object-cover rounded-r-lg bg-gray-400 opacity-30"
        />
      </View>
    </TouchableOpacity>
  );
  };

  return (
    <>
    <View className="flex flex-row space-x-2 justify-center pt-4">
      <TouchableOpacity onPress={() => setFilterType('All')} className={`border py-[6px] px-4 rounded-xl ${filterType === 'All' ? 'bg-green-100 border-[#4ade80]' : 'bg-gray-100 border-[#6ccf91]'}`}>
        <Text>All</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setFilterType('Running')} className={`border py-[6px] px-4 rounded-xl ${filterType === 'Running' ? 'bg-green-100 border-[#4ade80]' : 'bg-gray-100 border-[#6ccf91]'}`}>
        <Text>Running</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setFilterType('Strength')} className={`border py-[6px] px-4 rounded-xl ${filterType === 'Strength' ? 'bg-green-100 border-[#4ade80]' : 'bg-gray-100 border-[#6ccf91]'}`}>
        <Text>Strength</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setFilterType('Bodyweight')} className={`border py-[6px] px-4 rounded-xl ${filterType === 'Bodyweight' ? 'bg-green-100 border-[#4ade80]' : 'bg-gray-100 border-[#6ccf91]'}`}>
        <Text>Bodyweight</Text>
      </TouchableOpacity>
    </View>
    <View className="flex mt-1 py-1  h-[83%]">
      <FlatList
        className="p-2 mx-2 rounded-lg"
        data={filteredChallenges}
        renderItem={renderItem}
        keyExtractor={item => item.challenge_id.toString()}
      />
    </View>
    <View className="flex items-center justify-center">
      <TouchableOpacity
        className="px-4 py-2 bg-[#4ade80] rounded-md w-[90%] mt-3"
        onPress={() => navigation.navigate('YourChallenges', {userId: Number(user?.user_id)})}
      >
        <Text className="text-white text-[16px] text-center font-semibold">Your Challenges</Text>
      </TouchableOpacity>
    </View>
    </>
  );
};



export default Challenges;
