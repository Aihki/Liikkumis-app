import { useUserContext} from '../hooks/ContextHooks';
import {
  TouchableOpacity,
  Text,
  SafeAreaView,
  View,
  Image,
  ScrollView,

} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Motivational from '../components/profile/Motivational';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/LocalTypes';
import React, { useState } from 'react';
import PersonalBestC from '../components/profile/PersonalBest';
import FontAwesome from "react-native-vector-icons/FontAwesome";

const Profile = () => {
    const {handleLogout, handleReloadUser} = useUserContext();
    const {user} = useUserContext();
    const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [modalVisible, setModalVisible] = useState(false);

    useFocusEffect(
      React.useCallback(() => {
        handleReloadUser();
        return () => {};
      }, [])
    );

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}>
          <View>

            <View className="flex justify-center w-full h-60 bg-black">
              <Motivational />
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('ProfilePic')}>
              <View className="flex items-center">
                <Image
                  source={{
                    uri: user?.user_profile_pic
                      ? `http://10.0.2.2:3002/uploads/${user.user_profile_pic}`
                      : 'https://via.placeholder.com/640x360/808080/FFFFFF?text=click+to+change+picture',
                  }}
                  resizeMode="cover"
                  className="w-36 h-36 rounded-full -mt-14"
                />
              </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Challenges')}>
              <View className='absolute left-8 -top-[67px]'>
                <FontAwesome
                  name="gamepad"
                  size={32}
                  color="black"
                />
            </View>
            </TouchableOpacity>

            <View className="flex items-center justify-center">
              <Text className="text-xl text-[24px] pt-[5px]">{user?.username}</Text>
            </View>
            <PersonalBestC />
          </View>
          <View>
            <TouchableOpacity
              onPress={() => navigation.navigate('AddProgress')}
              className="bg-green-500 p-2 rounded-lg w-1/2 self-center m-1.5"
            >
              <Text className="text-white font-bold text-lg text-center">
                Add/update Progress
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
            <TouchableOpacity
              onPress={handleLogout}
              className="bg-red-500 p-2 rounded-lg w-1/2 self-center m-1.5 mb-4"
            >
              <Text className="text-white font-bold text-lg text-center">
                Logout
              </Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </SafeAreaView>
    );
};

export default Profile;
