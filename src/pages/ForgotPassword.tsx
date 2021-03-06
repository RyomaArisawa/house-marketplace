import { sendPasswordResetEmail } from 'firebase/auth';
import React, { FormEvent, VFC } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';
import { FAILED_RESET_EMAIL } from '../consts/errorMessages';
import { SUCCEEDED_RESET_EMAIL } from '../consts/messages';
import { SIGN_IN } from '../consts/routerPaths';
import { auth } from '../firebase.config';
export const ForgotPassword: VFC = () => {
  /* Local States */
  const [email, setEmail] = useState<string>('');

  /* Functions */
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success(SUCCEEDED_RESET_EMAIL);
    } catch (error) {
      toast.error(FAILED_RESET_EMAIL);
    }
  };

  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Forgot Password</p>
      </header>
      <main>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            className="emailInput"
            placeholder="Email"
            id="email"
            value={email}
            onChange={onChange}
          />
          <Link className="forgotPasswordLink" to={SIGN_IN}>
            Sign In
          </Link>
          <div className="signInBar">
            <div className="signInText">Send Reset Link</div>
            <button type="submit" className="signInButton">
              <ArrowRightIcon fill="#ffffff" width="34px" height="34px" />
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};
