import {useEffect, useState} from 'react';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import {Alert, Image, Keyboard, SafeAreaView, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFile, useProfileUpdate} from '../hooks/apiHooks';
import {useUpdateContext} from '../hooks/UpdateHooks';
import { useUserContext } from '../hooks/ContextHooks';

const ChangeProfilePic = () => {
  const [image, setImage] =
    useState<ImagePicker.ImagePickerSuccessResult | null>(null);
  const {postExpoFile} = useFile();
  const {postPicture} = useProfileUpdate();
  const {user} = useUserContext();


  const {update, setUpdate} = useUpdateContext();
  const navigation: NavigationProp<ParamListBase> = useNavigation();


  const resetForm = () => {
    setImage(null);
  };


  const doUpload = async () => {
    if (!image) {
      Alert.alert('No file selected', 'Please select a file');
      return;
    }
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token || !user) {
        return;
      }
      const fileResponse = await postExpoFile(image.assets![0].uri, token);
      const pictureResponse = await postPicture(user?.user_id, fileResponse.data.user_profile_pic, token);
      setUpdate(!update);
      Alert.alert('Profile picture updated successfully');
      navigation.navigate('Profile');
      resetForm();
    } catch (error) {
      Alert.alert('Error', (error as Error).message);
    }
  };


  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.6,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      resetForm();
    });
    return unsubscribe;
  }, []);


  return (

    <TouchableOpacity
      onPress={() => Keyboard.dismiss()}
      style={{flex: 1}}
      activeOpacity={1}
    >
  <SafeAreaView>
      <ScrollView>
        <View className='flex items-center justify-center m-5'>
        <Text className='text-xl'>Profile picture</Text>
            <TouchableOpacity onPress={pickImage}>
            <Image
             className='w-36 h-36 rounded-full'
              source={{
                uri: image
                  ?  image.assets![0].uri
                  : 'https://via.placeholder.com/150?text=Choose+media',
              }}
            />
          </TouchableOpacity>
        </View>
        <View className='flex items-center justify-center'>
          <TouchableOpacity
            onPress={doUpload}
            className='bg-blue-500 p-2 rounded-lg w-1/2'
          >
            <Text className='text-white font-bold text-lg text-center'>
              Upload
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
    </TouchableOpacity>
  );
};

export default ChangeProfilePic;