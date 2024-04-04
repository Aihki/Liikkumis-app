import React from 'react';
import {Alert, Image, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import {useUser} from '../hooks/apiHooks';

const RegisterForm = ({handletoggle}: {handletoggle: () => void}) => {
  const {postUser, getUsernameAvailability, getEmailAvailable} = useUser();
  const initValues = {
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
  };
  const {
    control,
    handleSubmit,
    formState: {errors},
    getValues,
  } = useForm({
    defaultValues: initValues,
    mode: 'onBlur',
  });

  const doRegister = async (inputs: {
    username: string;
    password: string;
    confirmPassword?: string;
    email: string;
  }) => {
    delete inputs.confirmPassword;
    try {
      await postUser(inputs);
      Alert.alert('User created', 'You can now login');
      handletoggle();
    } catch (error) {
      Alert.alert('Error', (error as Error).message);
    }
  };

  return (
    <>
      <View className='h-1/2 w-full'>
      <Image className='h-full w-full absolute' source={require('../assets/merkkari.png')} />
    </View>
    <View className='w-full flex items-center'>
    <Text className='text-3xl text-black font-bold text-center tracking-wider'>Register</Text>
      </View>
    <View className='flex items-center mx-4 space-y-4'>
      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'is required'},
          validate: async (value) => {
            try {
              const {available} = await getUsernameAvailability(value);
              return available ? available : 'Username taken';
            } catch (error) {
              console.log((error as Error).message);
            }
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput className='border-2 border-gray-500 w-full p-2 rounded-xl'
            placeholder="Username"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
          />
        )}
        name="username"
      />

      <Controller
        control={control}
        rules={{
          maxLength: 100,
          // minLength: 8,
          // pattern: {
          //   value:
          //     /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
          //   message:
          //     'Must contain at least 8 characters, one letter, one number, and one special character from the set @$!%*#?&',
          // },
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
      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'is required'},
          validate: (value) => {
            const {password} = getValues();
            if (value !== password) {
              return 'Passwords do not match';
            }
            return true;
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput className='border-2 border-gray-500 w-full p-2 rounded-xl mt-2'
            placeholder="Confirm Passowrd"
            secureTextEntry
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="confirmPassword"
      />
      <Controller
        control={control}
        rules={{
          maxLength: 100,
          required: {value: true, message: 'is required'},
          pattern: {
            value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
            message: 'Invalid email address',
          },
          validate: async (value) => {
            try {
              const {available} = await getEmailAvailable(value);
              return available ? available : 'email taken';
            } catch (error) {
              console.log((error as Error).message);
            }
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput className='border-2 border-gray-500 w-full p-2 rounded-xl mt-2'
            placeholder="Email"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
          />
        )}
        name="email"
      />
      <View className="flex items-center justify-center">
        <TouchableOpacity
          className=" bg-blue-500 p-2 rounded-lg w-1/2"
          onPress={handleSubmit(doRegister)}
        >
          <Text className="text-white font-bold text-lg text-center">
            Register
          </Text>
        </TouchableOpacity>
      </View>
    </View>
    </>
  );
};

export default RegisterForm;
