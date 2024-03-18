import {useEffect, useState} from 'react';
import {Button, Card, Input} from '@rneui/themed';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {Controller, useForm} from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import {Alert, Keyboard, ScrollView, TouchableOpacity} from 'react-native';
import {Video} from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useBook, useFile} from '../hooks/apiHooks';
import {useUpdateContext} from '../hooks/UpdateHooks';

const Upload = () => {
  const [image, setImage] =
    useState<ImagePicker.ImagePickerSuccessResult | null>(null);
  const {postExpoFile} = useFile();
  const {postBook} = useBook();
  const {update, setUpdate} = useUpdateContext();
  const navigation: NavigationProp<ParamListBase> = useNavigation();

  const initValues = {title: '', description: ''};
  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({
    defaultValues: initValues,
  });

  const resetForm = () => {
    reset();
    setImage(null);
  };

  const doUpload = async (inputs: {title: string; description: string}) => {
    if (!image) {
      Alert.alert('No file selected', 'Please select a file');
      return;
    }
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const fileResponse = await postExpoFile(image.assets![0].uri, token);
        const mediaResponse = await postBook(fileResponse, inputs, token);
        setUpdate(!update);
        Alert.alert('Upload success', mediaResponse.message);
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
      <ScrollView>
        <Card>
          {image && image.assets![0].mimeType?.includes('video') ? (
            <Video
              source={{uri: image.assets![0].uri}}
              style={{height: 300}}
              useNativeControls
            />
          ) : (
            <Card.Image
              onPress={pickImage}
              style={{aspectRatio: 1, height: 300}}
              source={{
                uri: image
                  ? image.assets![0].uri
                  : 'https://via.placeholder.com/150?text=Choose+media',
              }}
            />
          )}
          <Card.Divider />
          <Controller
            control={control}
            rules={{
              required: {value: true, message: 'Title is required'},
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                placeholder="Title"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.title?.message}
              />
            )}
            name="title"
          />

          <Controller
            control={control}
            rules={{
              maxLength: 1000,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                placeholder="Description"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.description?.message}
                multiline={true}
                numberOfLines={5}
                style={{height: 120, textAlignVertical: 'top', padding: 1}}
              />
            )}
            name="description"
          />
          <Button title="Choose file" onPress={pickImage} />
          <Card.Divider />
          <Button
            title="Upload"
            onPress={handleSubmit(doUpload)}
            buttonStyle={{backgroundColor: 'green'}}
          />
        </Card>
        <Card.Divider />
        <Button
          title="Reset"
          onPress={resetForm}
          buttonStyle={{backgroundColor: 'red'}}
        />
      </ScrollView>
    </TouchableOpacity>
  );
};

export default Upload;
