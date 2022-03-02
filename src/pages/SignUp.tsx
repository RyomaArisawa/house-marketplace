import React, { FormEvent, VFC } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { db, auth } from '../firebase.config';
import { UserFormData } from '../types/types';
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';
import visibilityIcon from '../assets/svg/visibilityIcon.svg';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { FAILED_SIGN_UP } from '../consts/errorMessages';
import { toast } from 'react-toastify';
import { Oauth } from '../components/Oauth';
import { EXPLORE, FORGOTPASSWORD, SIGNIN } from '../consts/routerPaths';

export const SignUp: VFC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    password: '',
  });

  const { name, email, password } = formData;

  const navigate = useNavigate();

  //フォームのユーザ情報を設定
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  //firebaseにユーザ情報を登録
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      //emailとpasswordでユーザを新規作成
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;
      if (auth.currentUser) {
        updateProfile(auth.currentUser, { displayName: name });
      }

      //DB登録用データ生成
      const formDataCopy: Partial<UserFormData> = formData;
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();

      //DB登録
      //setDoc(doc(firestoreインスタンス, コレクション名, id名), 登録データ)
      await setDoc(doc(db, 'users', user.uid), formDataCopy);

      //トップへ遷移
      navigate(EXPLORE);
    } catch (error) {
      toast.error(FAILED_SIGN_UP);
    }
  };

  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Welcome Back!</p>
        </header>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            className="nameInput"
            placeholder="Name"
            id="name"
            value={name}
            onChange={onChange}
          />
          <input
            type="email"
            className="emailInput"
            placeholder="Email"
            id="email"
            value={email}
            onChange={onChange}
          />
          <div className="passwordInputDiv">
            <input
              type={showPassword ? 'text' : 'password'}
              className="passwordInput"
              placeholder="Password"
              id="password"
              value={password}
              onChange={onChange}
            />
            <img
              src={visibilityIcon}
              alt="show password"
              className="showPassword"
              onClick={() => setShowPassword((prevState) => !prevState)}
            />
          </div>
          <Link to={FORGOTPASSWORD} className="forgotPasswordLink">
            Forgot Password
          </Link>
          <div className="signUpBar">
            <p className="signUpText">Sign Up</p>
            <button className="signUpButton">
              <ArrowRightIcon fill="#ffffff" width="34px" height="34px" />
            </button>
          </div>
        </form>

        <Oauth />

        <Link to={SIGNIN} className="registerLink">
          Sign In Instead
        </Link>
      </div>
    </>
  );
};
