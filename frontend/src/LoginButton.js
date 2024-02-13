import React from 'react';
import { useGoogleLogin } from 'react-google-login';

const LoginButton = ({ onSuccess, onFailure }) => {
  const clientId = '492147582846-cnvmg9au6p1e92mjelabvk7h2io7coii.apps.googleusercontent.com';

  const onSuccessHandler = (response) => {
    console.log('Login Success:', response);
    onSuccess(response);
  };

  const onFailureHandler = (error) => {
    console.log('Login Failure:', error);
    onFailure(error);
  };

  const { signIn } = useGoogleLogin({
    onSuccess: onSuccessHandler,
    onFailure: onFailureHandler,
    clientId,
    isSignedIn: true,
    accessType: 'offline',
  });

  return <button onClick={signIn}>Login with Google</button>;
};

export default LoginButton;
