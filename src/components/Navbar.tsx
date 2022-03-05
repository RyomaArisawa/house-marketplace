import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ReactComponent as OfferIcon } from '../assets/svg/localOfferIcon.svg';
import { ReactComponent as ExploreIcon } from '../assets/svg/exploreIcon.svg';
import { ReactComponent as PersonOutlineIcon } from '../assets/svg/personOutlineIcon.svg';
import { EXPLORE, OFFERS, PROFILE } from '../consts/routerPaths';

export const Navbar = () => {
  /* Variables */
  const navigate = useNavigate();
  const location = useLocation();

  /* Functions */
  // パスが一致するかを判定
  const pathMatchRoute = (route: string): boolean => {
    if (route === location.pathname) return true;
    return false;
  };

  return (
    <footer className="navbar">
      <nav className="navbarNav">
        <ul className="navbarListItems">
          <li className="navbarListItem" onClick={() => navigate(EXPLORE)}>
            <ExploreIcon
              fill={pathMatchRoute(EXPLORE) ? '#2c2c2c' : '#8f8f8f'}
              width="36px"
              height="36px"
            />
            <p
              className={
                pathMatchRoute(EXPLORE)
                  ? 'navbarListItemNameActive'
                  : 'navbarListItemName'
              }
            >
              Explore
            </p>
          </li>
          <li className="navbarListItem" onClick={() => navigate(OFFERS)}>
            <OfferIcon
              fill={pathMatchRoute(OFFERS) ? '#2c2c2c' : '#8f8f8f'}
              width="36px"
              height="36px"
            />
            <p
              className={
                pathMatchRoute(OFFERS)
                  ? 'navbarListItemNameActive'
                  : 'navbarListItemName'
              }
            >
              Offer
            </p>
          </li>
          <li className="navbarListItem" onClick={() => navigate(PROFILE)}>
            <PersonOutlineIcon
              fill={pathMatchRoute(PROFILE) ? '#2c2c2c' : '#8f8f8f'}
              width="36px"
              height="36px"
            />
            <p
              className={
                pathMatchRoute(PROFILE)
                  ? 'navbarListItemNameActive'
                  : 'navbarListItemName'
              }
            >
              Profile
            </p>
          </li>
        </ul>
      </nav>
    </footer>
  );
};
