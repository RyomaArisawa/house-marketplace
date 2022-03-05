import { doc, DocumentData, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import shareIcon from '../assets/svg/shareIcon.svg';
import { Spinner } from '../components/Spinner';
import { CATEGORY_NAME } from '../consts/consts';
import { CONTACT } from '../consts/routerPaths';
import { auth, db } from '../firebase.config';
import { formatDisplayPrice } from '../util/format';
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

export const Listing = () => {
  /* Local States */
  const [listing, setListing] = useState<DocumentData>();
  const [loading, setLoading] = useState<boolean>(false);
  const [shareLinkCopied, setShareLinkCopied] = useState<boolean>(false);

  /* Variables */
  const navigate = useNavigate();
  const params = useParams();

  /* useEffects */
  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, 'listings', params.listingId as string);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log(docSnap.data());
        setListing(docSnap.data());
        setLoading(false);
      }
    };

    setLoading(true);
    fetchListing();
  }, [navigate, params.listingId]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <main>
      <Swiper slidesPerView={1} pagination={{ clickable: true }}>
        {listing?.imgUrls.map((url: string, index: number) => (
          <SwiperSlide key={index}>
            <div
              style={{
                background: `url(${listing.imgUrls[index]}) center no-repeat`,
                backgroundSize: 'cover',
              }}
              className="swiperSlideDiv"
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div
        className="shareIconDiv"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setShareLinkCopied(true);
          setTimeout(() => {
            setShareLinkCopied(false);
          }, 2000);
        }}
      >
        <img src={shareIcon} alt="" />
      </div>
      {shareLinkCopied && <p className="linkCopied">Link Copied!</p>}

      {listing && (
        <div className="listingDetails">
          <p className="listingName">
            {`${listing.name} - ${
              listing.offer
                ? formatDisplayPrice(listing.discountedPrice)
                : formatDisplayPrice(listing.regularPrice)
            }`}
          </p>
          <p className="listingLocation">{listing.location}</p>
          <p className="listingType">
            For {listing.type === CATEGORY_NAME.RENT ? 'Rent' : 'Sale'}
          </p>
          {listing.offer && (
            <p className="discountPrice">
              {formatDisplayPrice(
                listing.regularPrice - listing.discountedPrice
              )}{' '}
              discount
            </p>
          )}

          <ul className="listingDetailsList">
            <li>
              {listing.bedrooms > 1
                ? `${listing.bedrooms} Bedrooms`
                : '1 Bedroom'}
            </li>
            <li>
              {listing.bathrooms > 1
                ? `${listing.bathrooms} Bathrooms`
                : '1 Bathroom'}
            </li>
            <li>{listing.parking && 'Parking Spot'}</li>
            <li>{listing.furnished && 'Furnished'}</li>
          </ul>
          <p className="listingLocationTitle">Location</p>

          <div className="leafletContainer">
            <MapContainer
              style={{ height: '100%', width: '100%' }}
              center={[listing.geolocation.lat, listing.geolocation.lng]}
              zoom={13}
              scrollWheelZoom={false}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png" />

              <Marker
                position={[listing.geolocation.lat, listing.geolocation.lng]}
              >
                <Popup>{listing.location}</Popup>
              </Marker>
            </MapContainer>
          </div>

          {auth.currentUser?.uid !== listing.userRef && (
            <Link
              to={`${CONTACT}/${listing.userRef}?listingName=${listing.name}`}
              className="primaryButton"
            >
              Contact Landlord
            </Link>
          )}
        </div>
      )}
    </main>
  );
};
