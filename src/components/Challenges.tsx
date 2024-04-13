import { Text, View, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { useUserContext } from "../hooks/ContextHooks";
import { useChallenge } from "../hooks/apiHooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Challenge } from "../types/DBTypes";
import { RootStackParamList } from "../types/LocalTypes";
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
      setChallenges(response);
    } catch (error) {
      console.error("Failed to fetch challenges:", error);
    }
  };

  useEffect(() => {
    getAllChallenges();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ChallengeDetails', { challengeId: item.challenge_id })}
    >
      <View className="bg-purple-200 m-2 p-4 rounded-lg shadow-md">
        <Text className="text-lg font-bold">{item.challenge_name}</Text>
        <Text className="py-2">{item.description}</Text>
        <Text>Target: {item.target_value} {item.target_type}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex mt-5 p-3">
      <FlatList
        className=" bg-[#f9c2ff] p-5 mx-2 rounded-lg"
        data={challenges}
        renderItem={renderItem}
        keyExtractor={item => item.challenge_id.toString()}
      />
    </View>
  );
};



export default Challenges;
