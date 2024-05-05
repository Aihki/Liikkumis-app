import {useUserContext} from '../hooks/ContextHooks';
import {
  TouchableOpacity,
  Text,
  View,
  Image,
  ScrollView,
  Modal,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Motivational from '../components/profile/Motivational';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/LocalTypes';
import React, {useState} from 'react';
import PersonalBestC from '../components/profile/PersonalBest';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {StatusBar} from 'expo-status-bar';


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
    }, []),
  );

  return (
      <ScrollView
        contentContainerStyle={{flexGrow: 1, justifyContent: 'space-between'}}
      >
        <View>
          <View className="flex justify-center w-full h-60 bg-black">
            <Motivational />
          </View>
          <View className="flex items-center">
          <TouchableOpacity onPress={() => navigation.navigate('ProfilePic')}>
              <Image
                source={{
                  uri: user?.user_profile_pic
                    ? `https://liikkumisapp.northeurope.cloudapp.azure.com/upload-api/uploads/${user.user_profile_pic}`
                    : 'https://via.placeholder.com/640x360/808080/FFFFFF?text=click+to+change+picture',
                }}
                resizeMode="cover"
                className="w-36 h-36 rounded-full -mt-14"
              />
          </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity onPress={() => navigation.navigate('Challenges')} className='absolute left-8 -top-[67px]'>
                <View>
                  <FontAwesome name="gamepad" size={32} color="black" />
                </View>
              </TouchableOpacity>
          </View>
          <View>
          <TouchableOpacity onPress={() => setModalVisible(true)} className='absolute right-8 -top-[67px]'>
            <View>
              <FontAwesome name="gear" size={32} color="black" />
            </View>
          </TouchableOpacity>
          </View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <StatusBar hidden={modalVisible} />
             <View className="bg-white p-3 items-center h-60 border-b border-gray-100">
              <View className="w-[90%] justify-center content-center h-full">
                <TouchableOpacity
                  onPress={handleLogout}
                  className="bg-red-500 p-2 rounded-md mb-2"
                >
                  <Text className="text-white font-bold text-lg text-center">
                    Logout
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <View className="bg-cyan-700 p-2 rounded-md">
                    <Text className="text-center text-white font-bold text-lg">
                      Close
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <View className="flex items-center justify-center">
            <Text className="text-xl text-[24px] pt-[5px]">
              {user?.username}
            </Text>
          </View>
          <PersonalBestC />
        </View>
        <View>
          <TouchableOpacity
            onPress={() => navigation.navigate('AddProgress')}
            className="bg-cyan-700 p-2 rounded-lg w-1/2 self-center m-1.5"
          >
            <Text className="text-white font-bold text-lg text-center">
              Add/update Progress
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('CompareProgress')}
            className="bg-cyan-700 p-2 rounded-lg w-1/2 self-center m-1.5 mb-7"
          >
            <Text className="text-white font-bold text-lg text-center">
              Compare Progress
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
  );
};

export default Profile;
