import React from 'react';
import './LoadingPage.css';
import { useContext } from 'react';
import { dataContext } from '../../../../App';


const LoadingPage = () => {
  return (
    <div className='loadingPage'>
      <div className="loading">ْ
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}

export default LoadingPage;
