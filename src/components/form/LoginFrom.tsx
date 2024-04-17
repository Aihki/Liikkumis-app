import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import {useUserContext} from '../../hooks/ContextHooks';
import {Credentials} from '../../types/LocalTypes';
import {View,  TouchableOpacity, Text, Image, TextInput} from 'react-native';



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
    <View className='h-1/2 w-full'>
    <Image className='h-full w-full absolute' source={require('../../assets/images/testi_logo.png')} resizeMode='contain' />
    </View>
    <View className='w-full flex items-center P-3'>
    <Text className='text-3xl text-black font-bold text-center tracking-wider'>Login</Text>
      </View>
    <View className='flex items-center mx-4 space-y-4'>
      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'is required'},
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput  className='border-2 border-gray-500 w-full p-2 rounded-xl'
            placeholder="Username"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
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
          <TextInput className='border-2 border-gray-500 w-full p-2 rounded-xl mt-2'
            placeholder="Password"
            secureTextEntry
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="password"
      />
       <View className="flex items-center justify-center">
        <TouchableOpacity
          className=" bg-blue-500 p-2 rounded-lg w-1/2"
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
