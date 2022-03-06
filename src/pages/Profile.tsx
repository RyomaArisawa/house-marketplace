import React, { useEffect, VFC } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Listing, UserFormData } from '../types/types';
import { auth, db } from '../firebase.config';
import { updateProfile } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { toast } from 'react-toastify';
import { FAILED_UPDATE_PROFILE } from '../consts/errorMessages';
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg';
import homeIcon from '../assets/svg/homeIcon.svg';
import { CREATELISTING, EXPLORE } from '../consts/routerPaths';
import { Spinner } from '../components/Spinner';
import { ListingItem } from '../components/ListingItem';
import {
  CONFIRM_DELETE_LISTING,
  SUCCEEDED_DELETE_LISTING,
} from '../consts/messages';

export const Profile: VFC = () => {
  /* Local States */
  const [changeDetails, setChangeDetails] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [listings, setListings] = useState<Listing[]>([]);
  const [formData, setFormData] = useState<Partial<UserFormData>>({
    name: auth.currentUser?.displayName ?? '',
    email: auth.currentUser?.email ?? '',
  });

  /* Variables */
  const { name, email } = formData;
  const navigate = useNavigate();

  /* useEffects */
  useEffect(() => {
    const fetchUserListings = async () => {
      const listingsRef = collection(db, 'listings');

      const q = query(
        listingsRef,
        where('userRef', '==', auth.currentUser?.uid),
        orderBy('timestamp', 'desc')
      );

      const querySnap = await getDocs(q);

      let listings: Listing[] = [];

      querySnap.forEach((doc) => {
        listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListings(listings);
      setLoading(false);
    };

    setLoading(true);
    fetchUserListings();
  }, [auth.currentUser?.uid]);

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

  const onDelete = async (listingId: string) => {
    if (window.confirm(CONFIRM_DELETE_LISTING)) {
      setLoading(true);
      await deleteDoc(doc(db, 'listings', listingId));
      const updatedListings: Listing[] = listings.filter(
        (listing) => listing.id !== listingId
      );
      setListings(updatedListings);
      setLoading(false);
      toast.success(SUCCEEDED_DELETE_LISTING);
    }
  };

  if (loading) return <Spinner />;

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

        {!loading && listings?.length > 0 && (
          <>
            <p className="listingText">Your Listings</p>
            <ul className="listingsList">
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  {...listing}
                  onDelete={() => onDelete(listing.id)}
                />
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
};
