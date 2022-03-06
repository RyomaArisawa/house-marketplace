import { doc, DocumentData, getDoc } from 'firebase/firestore';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FAILED_GET_LANDLORD_DATA } from '../consts/errorMessages';
import { db } from '../firebase.config';

export const Contact = () => {
  /* Local States */
  const [message, setMessage] = useState<string>('');
  const [landlord, setLandlord] = useState<DocumentData>();
  const [searchParams] = useSearchParams();

  /* Variables */
  const params = useParams();

  /* useEffects */
  useEffect(() => {
    const getLandlord = async () => {
      const docRef = doc(db, 'users', params.landlordId as string);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setLandlord(docSnap.data());
      } else {
        toast.error(FAILED_GET_LANDLORD_DATA);
      }
    };

    getLandlord();
  }, [params.landlordId]);

  /* Functions */
  const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Contact Landlord</p>
      </header>

      {landlord && (
        <main>
          <div className="contactLandlord">
            <p className="landlordName">Contact {landlord.name}</p>
          </div>

          <form className="messageForm">
            <div className="messageDiv">
              <label htmlFor="message" className="messageLable">
                Message
              </label>
              <textarea
                name="message"
                id="message"
                className="textarea"
                value={message}
                onChange={onChange}
              ></textarea>
            </div>

            <a
              href={`mailto:${landlord.email}?Subject=${searchParams.get(
                'listingName'
              )}&body=${message}`}
            >
              <button type="button" className="primaryButton">
                Send Message
              </button>
            </a>
          </form>
        </main>
      )}
    </div>
  );
};
