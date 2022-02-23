import React from 'react';
import { ReactComponent as DeleteIcon } from '../assets/svg/deleteIcon.svg';
import bedIcon from '../assets/svg/bedIcon.svg';
import bathtubIcon from '../assets/svg/bathtubIcon.svg';
import { VFC } from 'react';
import { ListingItemProps } from '../types/types';
import { Link } from 'react-router-dom';
import { formatDisplayPrice } from '../util/format';
import { CATEGORY_NAME } from '../consts/consts';

export const ListingItem: VFC<ListingItemProps> = ({ id, data, onDelete }) => {
  return (
    <li className="categoryListing">
      <Link to={`/category/${data.type}/${id}`} className="categoryListingLink">
        <img
          src={data.imageUrls[0]}
          alt={data.name}
          className="categoryListingImg"
        />
        <div className="categoryListingDetails">
          <p className="categoryListingLocation">{data.location}</p>
          <p className="categoryListingName">{data.name}</p>
          <p className="categoryListingPrice">
            {data.offer
              ? formatDisplayPrice(data.discountedPrice)
              : formatDisplayPrice(data.regularPrice)}
            {data.type === CATEGORY_NAME.RENT && ' / Month'}
          </p>
          <div className="categoryListingInfoDiv">
            <img src={bedIcon} alt="bed" />
            <p className="categoryListingInfoText">
              {data.bedrooms > 1 ? `${data.bedrooms} Bedrooms` : `1 Bedroom`}
            </p>
            <img src={bathtubIcon} alt="bath" />
            <p className="categoryListingInfoText">
              {data.bathrooms > 1
                ? `${data.bathrooms} Bathrooms`
                : `1 Bathroom`}
            </p>
          </div>
        </div>
      </Link>
      {onDelete && (
        <DeleteIcon
          className="removeIcon"
          fill="rgb(231, 76, 60)"
          onClick={() => onDelete(data.id, data.name)}
        />
      )}
    </li>
  );
};
