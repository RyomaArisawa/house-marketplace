import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { CATEGORY_NAME } from '../consts/consts';
import { CATEGORY } from '../consts/routerPaths';
import { db } from '../firebase.config';
import { Listing } from '../types/types';
import { formatDisplayPrice } from '../util/format';
import { Spinner } from './Spinner';
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

export const Slider = () => {
  /* Local States */
  const [loading, setLoading] = useState<boolean>(false);
  const [listings, setListings] = useState<Listing[]>();

  /* Variables */
  const navigate = useNavigate();

  /* useEffects */
  useEffect(() => {
    const fetchListings = async () => {
      const listingRef = collection(db, 'listings');
      const q = query(listingRef, orderBy('timestamp', 'desc'), limit(5));
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

    fetchListings();
  });

  if (loading) return <Spinner />;

  return listings ? (
    <>
      <p className="exploreHeading">Recommended</p>{' '}
      <Swiper slidesPerView={1} pagination={{ clickable: true }}>
        {listings.map(({ data, id }) => (
          <SwiperSlide
            key={id}
            onClick={() => navigate(`${CATEGORY}/${data.type}/${id}`)}
          >
            <div
              style={{
                background: `url(${data.imgUrls[0]}) center no-repeat`,
                backgroundSize: 'cover',
              }}
              className="swiperSlideDiv"
            >
              <p className="swiperSlideText">{data.name}</p>
              <p className="swiperSlidePrice">
                {data.discountedPrice
                  ? formatDisplayPrice(data.discountedPrice)
                  : formatDisplayPrice(data.regularPrice)}
                {data.type === CATEGORY_NAME.RENT && ' / month'}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  ) : (
    <div>No Data</div>
  );
};
