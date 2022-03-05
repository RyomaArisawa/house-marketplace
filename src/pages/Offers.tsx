import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { ListingItem } from '../components/ListingItem';
import { Spinner } from '../components/Spinner';
import { FAILED_FETCH_LISTINGS } from '../consts/errorMessages';
import { db } from '../firebase.config';
import { Listing } from '../types/types';

export const Offers = () => {
  /* Local States */
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  /* useEffects */
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingsRef = collection(db, 'listings');

        //クエリの生成(categoryNameに合致するデータを10件取得)
        const q = query(
          listingsRef,
          where('offer', '==', true),
          orderBy('timestamp', 'desc'),
          limit(10)
        );

        //クエリの実行
        const querySnap = await getDocs(q);

        //結果を格納
        let listings: Listing[] = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        setListings(listings);
        setLoading(false);
      } catch (error) {
        toast.error(FAILED_FETCH_LISTINGS);
      }
    };

    fetchListings();
  }, []);

  return (
    <div className="category">
      <header>
        <p className="pageHeader">Offers</p>
      </header>
      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className="categoryListings">
              {listings.map((listing) => (
                <ListingItem key={listing.id} {...listing} />
              ))}
            </ul>
          </main>
        </>
      ) : (
        <p>There are no current offers</p>
      )}
    </div>
  );
};
