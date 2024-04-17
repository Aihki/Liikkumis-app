import {useEffect, useState} from 'react';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import {
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFile, useProfileUpdate} from '../../hooks/apiHooks';
import {useUpdateContext} from '../../hooks/UpdateHooks';
import {useUserContext} from '../../hooks/ContextHooks';

const ChangeProfilePic = () => {
  const [image, setImage] =
    useState<ImagePicker.ImagePickerSuccessResult | null>(null);
  const {postExpoFile} = useFile();
  const {postPicture} = useProfileUpdate();
  const { user } = useUserContext();

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
      const pictureResponse = await postPicture(
        user?.user_id,
        fileResponse.data.user_profile_pic,
        token,
      );
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
    <>
    <View className='bg-white shadow-lg h-[50%] rounded-lg p-4 m-2'>
      <View className='flex items-center justify-center m-5'>
        <Text className='text-2xl'>Profile picture</Text>
        {user && (
          <TouchableOpacity onPress={pickImage}>
          <Image
            className='w-36 h-36 rounded-full'
            source={{
              uri: image
                ? image.assets![0].uri
                : (user.user_profile_pic
                  ? 'http://10.0.2.2:3002/uploads/' + user.user_profile_pic
                  : 'https://via.placeholder.com/150'),
            }}
          />
        </TouchableOpacity>
        )}

      </View>
      <View className='flex items-center justify-center'>
        <TouchableOpacity
          onPress={doUpload}
          className='bg-blue-500 p-2 rounded-lg w-1/2'
        >
          <Text className='text-white font-bold text-lg text-center'>
            update
          </Text>
        </TouchableOpacity>
      </View>
    </View>
    </>

  );
};

export default ChangeProfilePic;
