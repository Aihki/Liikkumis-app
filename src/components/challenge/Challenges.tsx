import { Text, View, FlatList, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useEffect, useState } from "react";
import { useUserContext } from "../../hooks/ContextHooks";
import { useChallenge } from "../../hooks/apiHooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Challenge } from "../../types/DBTypes";
import { RootStackParamList } from "../../types/LocalTypes";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

const Challenges = () => {

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { user } = useUserContext();
  const { getChallenges } = useChallenge();
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  const getAllChallenges = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token || !user) return;
    try {
      const response = await getChallenges();
      console.log(response);

      setChallenges(response);
    } catch (error) {
      console.error("Failed to fetch challenges:", error);
    }
  };

  const truncateText = (text: string, limit: number) => {
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  };

  useEffect(() => {
    getAllChallenges();
  }, []);

  const renderItem = ({ item }: { item: Challenge }) => (
    <TouchableOpacity onPress={() => navigation.navigate('ChallengeDetails', { challengeId: item.challenge_id })}>
      <View className="bg-white rounded-lg shadow my-2 relative flex-row items-center ">
        <View className="flex-1 p-4">
          <Text className="text-lg font-bold">{item.challenge_name}</Text>
          <Text className="py-2">{truncateText(item.description, 65)}</Text>
        </View>
        <Image
          source={{ uri: 'https://via.placeholder.com/640x360/000000/FFFFFF?text=+' }}
          className="w-[127px] h-full object-cover rounded-r-lg"
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <>
    <View className="flex mt-3 py-3  h-[90%]">
      <FlatList
        className="p-2 mx-2 rounded-lg"
        data={challenges}
        renderItem={renderItem}
        keyExtractor={item => item.challenge_id.toString()}
      />
    </View>
    <View className="flex items-center justify-center">
      <TouchableOpacity
        className="px-4 py-2 bg-blue-500 rounded-xl w-[90%]"
        onPress={() => navigation.navigate('YourChallenges', {userId: Number(user?.user_id)})}
      >
        <Text className="text-white text-center font-semibold">Your Challenges</Text>
      </TouchableOpacity>
    </View>
    </>
  );
};



export default Challenges;
