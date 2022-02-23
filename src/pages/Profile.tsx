import React, { VFC } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormData } from '../types/types';
import { auth, db } from '../firebase.config';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { FAILED_UPDATE_PROFILE } from '../consts/errorMessages';

export const Profile: VFC = () => {
  const [changeDetails, setChangeDetails] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<FormData>>({
    name: auth.currentUser?.displayName ?? '',
    email: auth.currentUser?.email ?? '',
  });

  const { name, email } = formData;

  const navigate = useNavigate();

  const onLogout = () => {
    auth.signOut();
    navigate('/');
  };

  const onSubmit = async () => {
    try {
      if (auth.currentUser && auth.currentUser?.displayName !== name) {
        //現在のユーザ名と異なる場合アップデート
        updateProfile(auth.currentUser, { displayName: name });

        //Firestoreの値をアップデート
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, { name: name });
      }
    } catch (error) {
      toast.error(FAILED_UPDATE_PROFILE);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };
  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>
        <button type="button" className="logOut" onClick={onLogout}>
          Logout
        </button>
      </header>
      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">Personal Details</p>
          <p
            className="changePersonalDetails"
            onClick={() => {
              changeDetails && onSubmit();
              setChangeDetails((prevState) => !prevState);
            }}
          >
            {changeDetails ? 'done' : 'change'}
          </p>
        </div>
        <div className="profileCard">
          <form>
            <input
              type="text"
              id="name"
              className={!changeDetails ? 'profileName' : 'profileNameActive'}
              disabled={!changeDetails}
              value={name}
              onChange={onChange}
            />
            <input
              type="text"
              id="email"
              className={!changeDetails ? 'profileEmail' : 'profileEmailActive'}
              disabled={!changeDetails}
              value={email}
              onChange={onChange}
            />
          </form>
        </div>
      </main>
    </div>
  );
};
