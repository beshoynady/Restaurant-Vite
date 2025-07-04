import React, { useContext } from "react";
import { ToastContainer } from "react-toastify";
import "./Userscreen.css";
import Header from "./component/header/Header";
import Home from "./component/home/Home";
import Offers from "./component/offers/Offers";
import Menu from "./component/menu/Menu";
import Location from "./component/location/Location";
import Contact from "./component/contact/Contact";
import Reservation from "./component/reservations/Reservation";
import Footer from "./component/footer/Footer";
import { dataContext } from "../../App";

const Userscreen = () => {
  const {
    restaurantData,
    allProducts,
    productsOffer,
    sizesOffer, handleGetTokenAndConfig, apiUrl } = useContext(dataContext)

  return (
    <div className="userscreen" style={{ direction: "rtl" }}>
      <ToastContainer />
      <Header />
      <Home />
      {(productsOffer.length > 0 || sizesOffer.length > 0) && <Offers />}
      {allProducts.length > 0 && <Menu />}
      {restaurantData?.locationUrl && <Location />}
      {(restaurantData?.contact || restaurantData?.social_media) && <Contact />}
      {restaurantData?.usesReservationSystem && <Reservation />}
      <Footer />
    </div>
  );
};

export default Userscreen;
