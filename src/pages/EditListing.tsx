import { onAuthStateChanged } from 'firebase/auth';
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Spinner } from '../components/Spinner';
import { v4 as uuidv4 } from 'uuid';
import { CATEGORY_NAME } from '../consts/consts';
import {
  ERROR_ADDRESS,
  ERROR_DISCOUNT_PRICE,
  ERROR_IMAGES,
  FAILED_FETCH_EDIT_LISTING,
  FAILED_UPLOAD_IMAGES,
  UNAUTHORIZED_EDIT_LISTING,
} from '../consts/errorMessages';
import { CATEGORY, SIGN_IN } from '../consts/routerPaths';
import { auth, db, storage } from '../firebase.config';
import {
  ListingFormData,
  Geolocation,
  GeocodingResponse,
} from '../types/types';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import {
  doc,
  DocumentData,
  getDoc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { SUCCEEDED_ADD_LISTING } from '../consts/messages';

export const EditListing = () => {
  const initialState: ListingFormData = {
    type: CATEGORY_NAME.RENT,
    name: '',
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: '',
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    images: [],
    latitude: 0,
    longitude: 0,
    userRef: '',
  };

  /* Local States */
  const [geolocationEnabled] = useState<boolean>(false);
  const [listing, setListing] = useState<DocumentData>();
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<ListingFormData>(initialState);

  /* Variables */
  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    offer,
    regularPrice,
    discountedPrice,
    images,
    latitude,
    longitude,
  } = formData;
  const navigate = useNavigate();
  const params = useParams();
  const isMounted = useRef(true);

  /* useEffects */
  // Redirect if listing is not user's
  useEffect(() => {
    if (listing && listing.userRef !== auth.currentUser?.uid) {
      toast.error(UNAUTHORIZED_EDIT_LISTING);
      navigate('/');
    }
  });

  // Fetch listing to edit
  useEffect(() => {
    setLoading(true);
    const fetchListing = async () => {
      const docRef = doc(db, 'listings', params.listingId as string);
      const docSnap = await getDoc(docRef);

      console.log(docSnap.data());
      if (docSnap.exists()) {
        const data = docSnap.data();
        setListing(data);
        if (data) {
          const defaltFormData: ListingFormData = {
            type: data.type,
            name: data.name,
            bedrooms: data.bedrooms,
            bathrooms: data.bathrooms,
            parking: data.parking,
            furnished: data.furnished,
            address: data.location,
            offer: data.offer,
            regularPrice: data.regularPrice,
            discountedPrice: data.discountedPrice,
            images: data.images,
            latitude: data.latitude,
            longitude: data.longitude,
          };
          setFormData(defaltFormData);
        }
        setLoading(false);
      } else {
        navigate('/');
        toast.error(FAILED_FETCH_EDIT_LISTING);
      }
    };

    fetchListing();
  }, [params.listingId, navigate]);

  // Sets userRef
  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({ ...formData, userRef: user.uid });
        } else {
          navigate(SIGN_IN);
        }
      });
    }
    return () => {
      isMounted.current = false;
    };
    //eslint-disable-next-line
  }, [isMounted]);

  /* Functions */
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);

    //??????????????????
    if (discountedPrice <= regularPrice) {
      setLoading(false);
      toast.error(ERROR_DISCOUNT_PRICE);
      return;
    }

    if (images.length > 6) {
      setLoading(false);
      toast.error(ERROR_IMAGES);
    }

    let geolocation: Geolocation = {
      lat: 0,
      lng: 0,
    };

    let location: string;

    if (!geolocationEnabled) {
      // Geocoding API ???????????????
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`
      );
      const data = (await response.json()) as GeocodingResponse;

      // ????????????????????????
      if (data.results && data.results.length !== 0) {
        geolocation.lat = data.results[0].geometry.location.lat ?? 0;
        geolocation.lng = data.results[0].geometry.location.lng ?? 0;

        location = data.results[0].formatted_address;
      } else {
        geolocation.lat = 0;
        geolocation.lng = 0;

        location = '';
      }

      if (!location) {
        setLoading(false);
        toast.error(ERROR_ADDRESS);
        return;
      }
    } else {
      geolocation.lat = latitude;
      geolocation.lng = longitude;
      location = address;
    }

    // ???????????????Firestorage?????????
    const storeImage = async (image: File) => {
      return new Promise((resolve, reject) => {
        //?????????????????????
        const fileName = `${auth.currentUser?.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, `images/${fileName}`);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Uploads is ${progress}% done`);
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
            }
          },
          (error) => {
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
              resolve(downloadURL)
            );
          }
        );
      });
    };

    const imgUrls: any = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch(() => {
      setLoading(false);
      toast.error(FAILED_UPLOAD_IMAGES);
    });

    const formDataCopy: Partial<ListingFormData> = {
      ...formData,
      imgUrls,
      geolocation,
      timestamp: serverTimestamp(),
    };

    delete formDataCopy.images;
    delete formDataCopy.address;
    location && (formDataCopy.location = location);
    !formDataCopy.offer && delete formDataCopy.discountedPrice;

    // Update Listing
    const docRef = doc(db, 'listings', params.listingId as string);
    await updateDoc(docRef, formDataCopy);

    setLoading(false);
    toast.success(SUCCEEDED_ADD_LISTING);
    navigate(`${CATEGORY}/${formDataCopy.type}/${docRef.id}`);
  };

  const onMutate = (e: any) => {
    let boolean: boolean;
    //boolean
    if (e.target.value === 'true') {
      boolean = true;
    }
    if (e.target.value === 'false') {
      boolean = false;
    }
    //????????????
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }
    //????????????
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="profile">
      <header>
        <p className="pageHeader">Edit Listing</p>
      </header>
      <main>
        <form onSubmit={onSubmit}>
          <label className="formLabel">Sell / Rent</label>
          <div className="formButtons">
            <button
              type="button"
              className={
                type === CATEGORY_NAME.SALE ? 'formButtonActive' : 'formButton'
              }
              id="type"
              value={CATEGORY_NAME.SALE}
              onClick={onMutate}
            >
              Sell
            </button>
            <button
              type="button"
              className={
                type === CATEGORY_NAME.RENT ? 'formButtonActive' : 'formButton'
              }
              id="type"
              value={CATEGORY_NAME.RENT}
              onClick={onMutate}
            >
              Rent
            </button>
          </div>

          <label className="formLabel">Name</label>
          <input
            className="formInputName"
            type="text"
            id="name"
            value={name}
            onChange={onMutate}
            maxLength={32}
            minLength={10}
            required
          />

          <div className="formRooms flex">
            <div>
              <label className="formLabel">Bedrooms</label>
              <input
                type="number"
                className="formInputSmall"
                id="bedrooms"
                value={bedrooms}
                onChange={onMutate}
                min={1}
                max={50}
                required
              />
            </div>
            <div>
              <label className="formLabel">Bathrooms</label>
              <input
                type="number"
                className="formInputSmall"
                id="bathrooms"
                value={bathrooms}
                onChange={onMutate}
                min={1}
                max={50}
                required
              />
            </div>
          </div>

          <label className="formLabel">Parking spot</label>
          <div className="formButtons">
            <button
              className={parking ? 'formButtonActive' : 'formButton'}
              type="button"
              id="parking"
              value="true"
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={
                !parking && parking !== null ? 'formButtonActive' : 'formButton'
              }
              type="button"
              id="parking"
              value="false"
              onClick={onMutate}
            >
              No
            </button>
          </div>

          <label className="formLabel">Furnished</label>
          <div className="formButtons">
            <button
              className={furnished ? 'formButtonActive' : 'formButton'}
              type="button"
              id="furnished"
              value="true"
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={
                !furnished && furnished !== null
                  ? 'formButtonActive'
                  : 'formButton'
              }
              type="button"
              id="furnished"
              value="false"
              onClick={onMutate}
            >
              No
            </button>
          </div>

          <label className="formLabel">Address</label>
          <textarea
            className="formInputAddress"
            id="address"
            value={address}
            onChange={onMutate}
            required
          />

          {geolocationEnabled && (
            <div className="formLatLng flex">
              <div>
                <label className="formLabel">Latitude</label>
                <input
                  type="number"
                  className="formInputSmall"
                  id="latitude"
                  value={latitude}
                  onChange={onMutate}
                  required
                />
              </div>
              <div>
                <label className="formLabel">Longitude</label>
                <input
                  type="number"
                  className="formInputSmall"
                  id="longitude"
                  value={longitude}
                  onChange={onMutate}
                  required
                />
              </div>
            </div>
          )}

          <label className="formLabel">Offer</label>
          <div className="formButtons">
            <button
              className={offer ? 'formButtonActive' : 'formButton'}
              type="button"
              id="offer"
              value="true"
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={
                !offer && offer !== null ? 'formButtonActive' : 'formButton'
              }
              type="button"
              id="offer"
              value="false"
              onClick={onMutate}
            >
              No
            </button>
          </div>

          <label className="formLabel">Regular Price</label>
          <div className="formPriceDiv">
            <input
              type="number"
              className="formInputSmall"
              id="regularPrice"
              value={regularPrice}
              onChange={onMutate}
              min={50}
              max={75000000}
              required
            />
            {type === CATEGORY_NAME.RENT && (
              <p className="formPriceText">$ / Month</p>
            )}
          </div>

          {offer && (
            <>
              <label className="formLabel">Discounted Price</label>
              <div className="formPriceDiv">
                <input
                  type="number"
                  className="formInputSmall"
                  id="discountedPrice"
                  value={discountedPrice}
                  onChange={onMutate}
                  min={50}
                  max={75000000}
                  required={offer}
                />
                {type === CATEGORY_NAME.RENT && (
                  <p className="formPriceText">$ / Month</p>
                )}
              </div>
            </>
          )}

          <label className="formLabel">Images</label>
          <p className="imagesInfo">
            The first image will be the cover (max 6).
          </p>
          <input
            type="file"
            className="formInputFile"
            id="images"
            onChange={onMutate}
            max={6}
            accept=".jpg,.png,.jpeg"
            multiple
            required
          />
          <button className="primaryButton createListingButton">
            Edit Listing
          </button>
        </form>
      </main>
    </div>
  );
};
