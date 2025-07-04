import React from 'react';
import './Location.css';
import { dataContext } from '../../../../App'



const Location = () => {
  return (
    <dataContext.Consumer>
      {
        ({ restaurantData, askingForHelp, userLoginInfo }) => {
          return (
            <section id='location'>
              <div className="container">
                <div className='section-title'>
                  <h2>موقعنا</h2>
                </div>

                <div className='location-content'>
                  <div className="right">
                    <h1>منتظرنكم في  <br />{restaurantData.name}</h1>
                    {restaurantData.address && 
                    <p>
                      العنوان :{`محافظة: ${restaurantData.address.state || ''} -مدينة: ${restaurantData.address.city || ''} -شارع: ${restaurantData.address.street || ''}`}
                    </p>
                    }
                  </div>
                  <div className="left">
                    {restaurantData.locationUrl&&
                    <iframe
                      src={restaurantData.locationUrl&&restaurantData.locationUrl}
                      width="100%"
                      height="100%"
                      style={{ border: '0', allowfullscreen: '', referrerpolicy: 'no-referrer-when-downgrade' }}
                      loading="async"
                      title="Google Map"
                    ></iframe>
                    }
                  </div>

                </div>
              </div>
            </section>
          )
        }
      }
    </dataContext.Consumer>

  );
};

export default Location;
