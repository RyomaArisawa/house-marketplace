import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navbar } from './components/Navbar';
import { PrivateRoute } from './components/PrivateRoute';
import {
  CATEGORY,
  CREATELISTING,
  EXPLORE,
  FORGOTPASSWORD,
  OFFERS,
  PROFILE,
  SIGNIN,
  SIGNUP,
} from './consts/routerPaths';
import { Category } from './pages/Category';
import { CreateListing } from './pages/CreateListing';
import { Explore } from './pages/Explore';
import { ForgotPassword } from './pages/ForgotPassword';
import { Offers } from './pages/Offers';
import { Profile } from './pages/Profile';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';

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
          <Route path={SIGNIN} element={<SignIn />} />
          <Route path={SIGNUP} element={<SignUp />} />
          <Route path={FORGOTPASSWORD} element={<ForgotPassword />} />
          <Route path={CREATELISTING} element={<CreateListing />} />
        </Routes>
        <Navbar />
      </Router>
      <ToastContainer />
    </>
  );
};

export default App;
