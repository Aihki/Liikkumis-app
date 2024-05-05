import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import {useUserContext} from '../../hooks/ContextHooks';
import {Credentials} from '../../types/LocalTypes';
import {View,  TouchableOpacity, Text, Image, TextInput, Platform} from 'react-native';



const LoginForm = () => {
  const {handleLogin} = useUserContext();
  const initValues: Credentials = {username: '', password: ''};
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: initValues,
  });

  const doLogin = async (inputs: Credentials) => {
    handleLogin(inputs);
  };

  return (
    <>
    <View className='h-[40%] w-full'>
    <Image className='h-full w-full absolute' source={require('../../assets/images/logo.png')} resizeMode='contain' />
    </View>
    <View className='w-full flex items-center border-t border-gray-200'>
    <Text className='text-3xl text-black font-bold text-center tracking-wider p-3 mb-3'>Login</Text>
      </View>
    <View className='flex items-center mx-4 space-y-4'>
      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'is required'},
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            placeholder="Username"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
            style={{
              paddingVertical: Platform.OS === 'ios' ? 18 : 11,
              marginBottom: 10,
              paddingHorizontal: 10,
              borderStyle: 'solid',
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 10,
              width: '100%',
              backgroundColor: '#F3F4F6',
            }}
          />
        )}
        name="username"
      />
      {errors.username && <Text style={{ color: 'red' }}>{errors.username.message}</Text>}

      <Controller
        control={control}
        rules={{
          maxLength: 100,
          minLength: 2,
          required: {value: true, message: 'is required'},
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            placeholder="Password"
            secureTextEntry
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            style={{
              paddingVertical: Platform.OS === 'ios' ? 18 : 11,
              paddingHorizontal: 10,
              borderStyle: 'solid',
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 10,
              width: '100%',
              backgroundColor: '#F3F4F6',
            }}
          />
        )}
        name="password"
      />
       <View className="flex items-center justify-center w-full">
        <TouchableOpacity
          className=" bg-indigo-500 p-2 rounded-lg w-[100%]"
          onPress={handleSubmit(doLogin)}
        >
          <Text className="text-white font-bold text-lg text-center">
            Login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
    </>
  );
};

export default LoginForm;
