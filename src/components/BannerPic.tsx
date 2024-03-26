import {useEffect, useState} from 'react';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import {Alert, Image, Keyboard, SafeAreaView, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFile} from '../hooks/apiHooks';
import {useUpdateContext} from '../hooks/UpdateHooks';

const ChangeBannerPic = () => {
  const [bannerImage, setBannerImage] =
    useState<ImagePicker.ImagePickerSuccessResult | null>(null);
  const {postExpoFile} = useFile();

  const {update, setUpdate} = useUpdateContext();
  const navigation: NavigationProp<ParamListBase> = useNavigation();

  const resetForm = () => {
    setBannerImage(null);
  };


  const doUpload = async () => {
    if (!bannerImage) {
      Alert.alert('No file selected', 'Please select a file');
      return;
    }
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const fileResponse = await postExpoFile(bannerImage.assets![0].uri, token);
        setUpdate(!update);
        Alert.alert( 'Profile picture updated successfully');
        navigation.navigate('Home');
        resetForm();
      }
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
      setBannerImage(result);
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
        <Text className='text-xl'>Banner picture</Text>
            <TouchableOpacity onPress={pickImage}>
            <Image
              className='w-36 h-36'
              source={{
                uri: bannerImage
                  ? bannerImage.assets![0].uri
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

export default ChangeBannerPic;
