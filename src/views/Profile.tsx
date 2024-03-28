import React, { useEffect, useState } from 'react';
import {useUserContext} from '../hooks/ContextHooks';
import {TouchableOpacity, Text, SafeAreaView, View, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Motivational from '../components/Motivational';




const Profile = () => {
  const {handleLogout} = useUserContext();
  const {user} = useUserContext();
  const navigation = useNavigation();




  return (
    <>
      <SafeAreaView>
      <View className=" flex justify-center w-full h-60 bg-black">
        <Motivational />
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('ProfilePic')}>
          <View className="flex items-center">
            <Image
              source={{
                uri:
             'http://localhost:3002/uploads/' + user?.user_profile_pic || 'https://via.placeholder.com/150',
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

        <TouchableOpacity
          onPress={handleLogout}
          className="bg-red-500 p-2 rounded-lg w-1/2 self-center m-3"
        >
          <Text className="text-white font-bold text-lg text-center">
            Logout
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
};


export default Profile;
