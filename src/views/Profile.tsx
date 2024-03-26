import React from 'react';
import {useUserContext} from '../hooks/ContextHooks';
import {TouchableOpacity, Text, SafeAreaView, View, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const Profile = () => {
  const {handleLogout} = useUserContext();
  const {user} = useUserContext();

  const navigation = useNavigation();

  return (
    <>
      <SafeAreaView>
        <TouchableOpacity onPress={() => navigation.navigate('BannerPic')}>
        <View className="w-full">
          <Image
            source={{
              uri: 'https://media.timeout.com/images/106041640/image.jpg',
            }}
            className="h-60 w-full"
            resizeMode="cover"
          />
        </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ProfilePic')}>
          <View className="flex items-center">
            <Image
              source={{
                uri: 'https://i.pinimg.com/originals/37/37/03/373703ed3f43d5908cdfc4662eb75b9b.jpg',
              }}
              resizeMode="cover"
              className="w-36 h-36 rounded-full -mt-20"
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
