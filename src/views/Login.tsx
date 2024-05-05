import {useEffect, useState} from 'react';
import {Keyboard, TouchableOpacity, View, Text} from 'react-native';
import LoginForm from '../components/form/LoginFrom';
import RegisterForm from '../components/form/RegFrom';
import {useUserContext} from '../hooks/ContextHooks';

const Login = () => {
  const [toggleReg, setToggleReg] = useState(false);
  const handleToggle = () => {
    setToggleReg(!toggleReg);
  };
  const {handleAutoLogin} = useUserContext();

  useEffect(() => {
    handleAutoLogin();
  }, []);

  return (
    <TouchableOpacity
      onPress={() => Keyboard.dismiss()}
      style={{flex: 1}}
      activeOpacity={1}
    >
      {!toggleReg ? (
        <LoginForm />
      ) : (
        <RegisterForm handletoggle={handleToggle} />
      )}
      <View className='flex items-center justify-center pt-2 mt-1'>
        <Text>
          {!toggleReg ? 'Dont have a account yet? ' : 'Have account already? '}
          <Text onPress={handleToggle} className='color-sky-600'>
            {!toggleReg ? 'Register here!' : 'Login'}
          </Text>
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Login;
