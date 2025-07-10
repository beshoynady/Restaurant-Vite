import React from "react";
import "bootstrap/dist/css/bootstrap.rtl.min.css";

const Offline = () => {
  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light text-center">
      <div className="p-5 bg-white shadow rounded-4" style={{ maxWidth: "500px" }}>
        <h1 className="text-danger mb-3">🚧 الموقع غير متاح الآن</h1>
        <p className="mb-4 text-muted">نقوم حاليًا ببعض التحديثات والصيانة.</p>
        <hr />
        <h1 className="text-danger mt-4 mb-3">🚧 Site is Currently Unavailable</h1>
        <p className="text-muted">We are performing some updates and maintenance.</p>
        <p className="text-secondary mt-4">
          يرجى المحاولة مرة أخرى لاحقًا<br />
          Please try again later
        </p>
      </div>
    </div>
  );
};

export default Offline;
