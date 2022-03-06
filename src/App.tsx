import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navbar } from './components/Navbar';
import { PrivateRoute } from './components/PrivateRoute';
import {
  CATEGORY,
  CONTACT,
  CREATE_LISTING,
  EDIT_LISTING,
  EXPLORE,
  FORGOT_PASSWORD,
  OFFERS,
  PROFILE,
  SIGN_IN,
  SIGN_UP,
} from './consts/routerPaths';
import { Category } from './pages/Category';
import { CreateListing } from './pages/CreateListing';
import { Listing } from './pages/Listing';
import { Explore } from './pages/Explore';
import { ForgotPassword } from './pages/ForgotPassword';
import { Offers } from './pages/Offers';
import { Profile } from './pages/Profile';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { Contact } from './pages/Contact';
import { EditListing } from './pages/EditListing';

export const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path={EXPLORE} element={<Explore />} />
          <Route path={OFFERS} element={<Offers />} />
          <Route path={`${CATEGORY}/:categoryName`} element={<Category />} />
          <Route path={PROFILE} element={<PrivateRoute />}>
            <Route path={PROFILE} element={<Profile />} />
          </Route>
          <Route path={SIGN_IN} element={<SignIn />} />
          <Route path={SIGN_UP} element={<SignUp />} />
          <Route path={FORGOT_PASSWORD} element={<ForgotPassword />} />
          <Route path={CREATE_LISTING} element={<CreateListing />} />
          <Route path={EDIT_LISTING} element={<EditListing />} />
          <Route
            path={`${CATEGORY}/:categoryName/:listingId`}
            element={<Listing />}
          />
          <Route path={`${CONTACT}/:landlordId`} element={<Contact />} />
        </Routes>
        <Navbar />
      </Router>
      <ToastContainer />
    </>
  );
};

export default App;
