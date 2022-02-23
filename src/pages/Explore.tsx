import React, { VFC } from 'react';
import { Link } from 'react-router-dom';
import rentCategoryImage from '../assets/jpg/rentCategoryImage.jpg';
import sellCategoryImage from '../assets/jpg/sellCategoryImage.jpg';
import { CATEGORY_NAME, TITLE_RENT, TITLE_SALE } from '../consts/consts';

export const Explore: VFC = () => {
  return (
    <div className="explore">
      <header>
        <p className="pageHeader">Explore</p>
      </header>
      <main>
        <p className="exploreCategoryHeading">Categories</p>
        <div className="exploreCategories">
          <Link to={`/category/${CATEGORY_NAME.RENT}`}>
            <img
              src={rentCategoryImage}
              alt="rent"
              className="exploreCategoryImg"
            />
            <p className="exploreCategoryName">{TITLE_RENT}</p>
          </Link>
          <Link to={`/category/${CATEGORY_NAME.SALE}`}>
            <img
              src={sellCategoryImage}
              alt="sale"
              className="exploreCategoryImg"
            />
            <p className="exploreCategoryName">{TITLE_SALE}</p>
          </Link>
        </div>
      </main>
    </div>
  );
};
