import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import googleIcon from '../assets/svg/googleIcon.svg';
import { FAILED_AUTH_WITH_GOOGLE } from '../consts/errorMessage';
import { auth, db } from '../firebase.config';
export const Oauth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const onGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      //ログインしたユーザがFirestoreにあるか確認
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      //存在しない場合新規登録
      if (!docSnap.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }
      navigate('/');
    } catch (error) {
      toast.error(FAILED_AUTH_WITH_GOOGLE);
    }
  };

  return (
    <div className="socialLogin">
      <p>Sign {location.pathname === '/sign-up' ? 'Up' : 'In'} with </p>
      <button className="socialIconDiv" onClick={onGoogleClick}>
        <img className="socialIconImg" src={googleIcon} alt="google" />
      </button>
    </div>
  );
};
