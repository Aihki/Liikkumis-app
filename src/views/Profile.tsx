import {useUserContext} from '../hooks/ContextHooks';
import {
  TouchableOpacity,
  Text,
  SafeAreaView,
  View,
  Image,
  ScrollView,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Motivational from '../components/Motivational';
import UserProgressList from '../components/UserProgress';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/LocalTypes';
import React, { useEffect } from 'react';


const Profile = () => {
  const {handleLogout, handleReloadUser} = useUserContext();
  const {user} = useUserContext();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    useFocusEffect(
      React.useCallback(() => {
        handleReloadUser();
        return () => {};
      }, [])
    );

  return (
    <>
      <SafeAreaView>
        <ScrollView>
          <View className=" flex justify-center w-full h-60 bg-black">
            <Motivational />
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('ProfilePic')}>
            <View className="flex items-center">
              <Image
                source={{
                  uri:
                  ('http://localhost:3002/uploads/' + user?.user_profile_pic) ||
                  'https://via.placeholder.com/150',
                }}
                resizeMode="cover"
                className="w-36 h-36 rounded-full -mt-14"
              />
            </View>
            <View className="flex items-center justify-center">
              <Text className="text-xl">{user?.username}</Text>
            </View>
          </TouchableOpacity>
          <View className="flex items-center justify-center">
            <Text className="text-2xl font-bold">Progress</Text>
          </View>
          <View className="flex items-center justify-center mb-5">
            <UserProgressList user_id={user?.user_id || 0} />
          </View>
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-500 p-2 rounded-lg w-1/2 self-center m-1.5"
          >
            <Text className="text-white font-bold text-lg text-center">
              Logout
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('AddProgress')}
            className="bg-green-500 p-2 rounded-lg w-1/2 self-center m-1.5"
          >
            <Text className="text-white font-bold text-lg text-center">
              Add Progress
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('CompareProgress')}
            className="bg-green-500 p-2 rounded-lg w-1/2 self-center m-1.5"
          >
            <Text className="text-white font-bold text-lg text-center">
              Compare Progress
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Profile;
