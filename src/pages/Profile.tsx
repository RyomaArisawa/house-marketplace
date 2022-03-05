import React, { useEffect, VFC } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserFormData } from '../types/types';
import { auth, db } from '../firebase.config';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { FAILED_UPDATE_PROFILE } from '../consts/errorMessages';
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg';
import homeIcon from '../assets/svg/homeIcon.svg';
import { CREATELISTING, EXPLORE } from '../consts/routerPaths';

export const Profile: VFC = () => {
  /* Local States */
  const [changeDetails, setChangeDetails] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<UserFormData>>({
    name: auth.currentUser?.displayName ?? '',
    email: auth.currentUser?.email ?? '',
  });

  /* Variables */
  const { name, email } = formData;
  const navigate = useNavigate();

  /* useEffects */
  useEffect(() => {}, []);

  /* Functions */
  const onLogout = () => {
    auth.signOut();
    navigate(EXPLORE);
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
        <Link to={CREATELISTING} className="createListing">
          <img src={homeIcon} alt="home" />
          <p>Sell or rent your home</p>
          <img src={arrowRight} alt="arrow right" />
        </Link>
      </main>
    </div>
  );
};
