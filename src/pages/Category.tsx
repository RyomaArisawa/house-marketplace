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
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ListingItem } from '../components/ListingItem';
import { Spinner } from '../components/Spinner';
import { CATEGORY_NAME } from '../consts/consts';
import { FAILED_FETCH_LISTINGS } from '../consts/errorMessages';
import { db } from '../firebase.config';
import { Listing } from '../types/types';

export const Category = () => {
  /* Local States */
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  /* Variables */
  const params = useParams();

  /* useEffects */
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingsRef = collection(db, 'listings');

        //クエリの生成(categoryNameに合致するデータを10件取得)
        const q = query(
          listingsRef,
          where('type', '==', params.categoryName),
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
  }, [params.categoryName]);

  return (
    <div className="category">
      <header>
        <p className="pageHeader">
          {params.categoryName === CATEGORY_NAME.RENT
            ? 'Places for rent'
            : 'Places for sale'}
        </p>
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
        <p>No listings for {params.categoryName}</p>
      )}
    </div>
  );
};
