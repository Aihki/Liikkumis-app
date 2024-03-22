import {Text} from '@rneui/themed';
import {useEffect, useState} from 'react';
import {Keyboard, TouchableOpacity} from 'react-native';
import LoginForm from '../components/LoginFrom';
import RegisterForm from '../components/RegFrom';
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
      <Text>
  {!toggleReg ? 'Dont have a account yet? ' : 'Have account already'}
  <Text onPress={handleToggle} style={{color: 'blue'}}>
    {!toggleReg ? 'Register here!' : 'Login'}
  </Text>
</Text>
    </TouchableOpacity>
  );
};

export default Login;
