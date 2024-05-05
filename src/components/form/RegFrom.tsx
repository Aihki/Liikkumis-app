import React from 'react';
import {Alert, Image, Platform, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import {useUser} from '../../hooks/apiHooks';

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
      <View className='h-[40%] w-min'>
      <Image className='h-full w-full absolute' source={require('../../assets/images/logo.png')} resizeMode='contain' />
    </View>
    <View className='w-full flex items-center border-t border-gray-200'>
    <Text className='text-3xl text-black font-bold text-center tracking-wider p-3'>Register</Text>
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
          <TextInput
            placeholder="Password"
            secureTextEntry
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
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
          <TextInput
            placeholder="Confirm Passowrd"
            secureTextEntry
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
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
          <TextInput
            placeholder="Email"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
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
        name="email"
      />
      <View className="flex items-center justify-center w-full">
        <TouchableOpacity
          className=" bg-indigo-500 p-2 rounded-lg w-full"
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
