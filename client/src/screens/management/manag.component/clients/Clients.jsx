import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useShared } from "../../../../context/SharedContext";
import { useAuth } from "../../../../context/AuthContext";
import { useSocket } from "../../../../context/SocketContext";
import { useManagementData } from "../../../../context/ManagementDataContext";
import { useCartCard } from "../../../../context/CartCardContext";
import { useInvoice } from "../../../../context/InvoiceContext";
import { useClient } from "../../../../context/ClientContext";
import "../orders/Orders.css";

const Clients = () => {
  const {
    setStartDate,
    setEndDate,
    filterByDateRange,
    filterByTime,
    restaurantData,
    formatDateTime,
    permissionsList,
    setIsLoading,
    formatDate,
    formatTime,
    EditPagination,
    startPagination,
    endPagination,
    setStartPagination,
    setEndPagination,
    apiUrl,
    handleGetTokenAndConfig,
  } = useContext(dataContext);

  const permissionClient = permissionsList?.filter(
    (permission) => permission.resource === "Clients"
  )[0];

  const [allClients, setAllClients] = useState([]);
  const [clientId, setclientId] = useState("");
  const [clientData, setClientData] = useState({
    name: "",
    phone: "",
    deliveryArea: "",
    address: "",
    notes: "",
    isVarified: false,
    refusesOrders: false,
  });

  useEffect(() => {
    getAllClients();
  }, []);

  const getAllClients = async () => {
    // setIsLoading(true);
    try {
      const config = await handleGetTokenAndConfig();

      const response = await axios.get(`${apiUrl}/api/client`, config);
      console.log({ AllClients: response });
      const data = await response.data;
      setAllClients(data);
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast.error("حدث خطأ أثناء جلب العملاء.");
    } finally {
      // setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClientData({ ...clientData, [name]: value });
  };

  const createClient = async (e) => {
    e.preventDefault();
    try {
      const config = await handleGetTokenAndConfig();

      if (
        !clientData.name &&
        !clientData.phone &&
        !clientData.deliveryArea &&
        !clientData.address
      ) {
        toast.warn("تاكد من الاسم و الموبايل و منطقه التوصل و العنوان ");
      }
      const response = await axios.post(
        `${apiUrl}/api/client`,
        clientData,
        config
      );
      console.log({ clientData, response });
      getAllClients();
      toast.success("تم إنشاء العميل بنجاح.");
    } catch (error) {
      console.error("Error creating client:", error);
      toast.error("حدث خطأ أثناء إنشاء العميل.");
    }
  };

  const handelEditclient = (client) => {
    setClientData({
      name: client.name,
      phone: client.phone,
      deliveryArea: client.deliveryArea ? client.deliveryArea._id : "",
      addresses: client.addresses,
      notes: client.notes,
      isVarified: client.isVarified,
      refusesOrders: client.refusesOrders,
    });
  };

  const updateClient = async (e) => {
    e.preventDefault();
    try {
      const config = await handleGetTokenAndConfig();

      const response = await axios.put(
        `${apiUrl}/api/client/${clientId}`,
        clientData,
        config
      );
      getAllClients();
      toast.success("تم تحديث العميل بنجاح.");
    } catch (error) {
      console.error("Error updating client:", error);
      toast.error("حدث خطأ أثناء تحديث العميل.");
    }
  };

  const deleteClient = async (id) => {
    try {
      const config = await handleGetTokenAndConfig();

      await axios.delete(`${apiUrl}/api/client/${clientId}`, config);
      getAllClients();
      toast.success("تم حذف العميل بنجاح.");
    } catch (error) {
      console.error("Error deleting client:", error);
      toast.error("حدث خطأ أثناء حذف العميل.");
    }
  };

  const getClientByPhone = async (phone) => {
    if (!phone) {
      getAllClients();
      return;
    }
    if (phone.length < 11) {
      return;
    }

    try {
      const config = await handleGetTokenAndConfig();

      const response = await axios.get(
        `${apiUrl}/api/client/phone/${phone}`,
        config
      );
      const data = response.data;
      if (data) {
        setClientData(data);
        toast.success("تم تحديث العميل بنجاح.");
      } else {
        setClientData({
          name: "",
          phone: "",
          deliveryArea: "",
          address: "",
          notes: "",
          isVarified: false,
          refusesOrders: false,
        });
      }
    } catch (error) {
      if (error.message === "Client not found") {
        console.info(error);
        toast.info("هذا العميل ليس له بيانات.");
      } else {
        console.error("Error updating client:", error);
        toast.error("حدث خطأ أثناء جلب بيانات العميل.");
      }
    }
  };

  const [Areas, setAreas] = useState([]);
  const getAllDeliveryAreas = async () => {
    const config = await handleGetTokenAndConfig();
    try {
      const response = await axios.get(`${apiUrl}/api/deliveryarea`);
      const data = await response.data;
      // console.log({ data })
      if (data) {
        setAreas(data);
      } else {
        toast.error(
          "لا يوجد بيانات لمنطقه التوصيل ! اضف بيانات منطقه التوصيل "
        );
      }
    } catch (error) {
      toast.error("حدث خطأ اثناء جلب بيانات منطقه التوصيل! اعد تحميل الصفحة");
    }
  };

  useEffect(() => {
    getAllClients();
    getAllDeliveryAreas();
  }, []);

  return (
    <div className="w-100 px-3 d-flex align-itmes-center justify-content-start">
      <div className="table-responsive">
        <div className="table-wrapper p-3 mw-100">
          <div className="table-title">
            <div className="w-100 d-flex flex-wrap align-items-center justify-content-between">
              <div className="text-right">
                <h2>
                  ادارة <b>العملاء</b>
                </h2>
              </div>
              <div className="col-12 col-md-6 p-0 m-0 d-flex flex-wrap aliegn-items-center justify-content-end print-hide">
                <a
                  href="#addclientModal"
                  className="d-flex align-items-center justify-content-center h-100 m-0 btn btn-success"
                  data-toggle="modal"
                >
                  {" "}
                  <span>اضافة موظف جديد</span>
                </a>
                {/* <a href="#deleteclientModal" className="d-flex align-items-center justify-content-center h-100 m-0 btn btn-danger" data-toggle="modal"> <span>حذف الكل</span></a> */}
              </div>
            </div>
          </div>
          <div className="table-filter print-hide">
            <div className="w-100 d-flex flex-row flex-wrap align-items-center justify-content-start text-dark">
              <div className="filter-group d-flex flex-wrap align-items-center justify-content-between p-0 mb-1">
                <label className="form-label text-wrap text-right fw-bolder p-0 m-0">
                  عرض
                </label>
                <select
                  className="form-control border-primary m-0 p-2 h-auto"
                  onChange={(e) => {
                    setStartPagination(0);
                    setEndPagination(e.target.value);
                  }}
                >
                  {(() => {
                    const options = [];
                    for (let i = 5; i < 100; i += 5) {
                      options.push(
                        <option key={i} value={i}>
                          {i}
                        </option>
                      );
                    }
                    return options;
                  })()}
                </select>
              </div>
              <div className="filter-group d-flex flex-wrap align-items-center justify-content-between p-0 mb-1">
                <label className="form-label text-wrap text-right fw-bolder p-0 m-0">
                  الموبايل
                </label>
                <input
                  type="text"
                  className="form-control border-primary m-0 p-2 h-auto"
                  onChange={(e) => getClientByPhone(e.target.value)}
                />
              </div>
              <div className="col-12 text-dark d-flex flex-wrap align-items-center justify-content-start p-0 m-0 mt-3">
                <div className="filter-group d-flex flex-wrap align-items-center justify-content-between p-0 mb-1">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">
                    فلتر حسب الوقت
                  </label>
                  <select
                    className="form-control border-primary m-0 p-2 h-auto"
                    onChange={(e) =>
                      setAllClients(
                        filterByTime(e.target.value, allClients)
                      )
                    }
                  >
                    <option value="">اختر</option>
                    <option value="today">اليوم</option>
                    <option value="week">هذا الأسبوع</option>
                    <option value="month">هذا الشهر</option>
                    <option value="month">هذه السنه</option>
                  </select>
                </div>

                <div className="d-flex align-items-stretch justify-content-between flex-nowrap p-0 m-0 px-1">
                  <label className="form-label text-nowrap d-flex align-items-center justify-content-center p-0 m-0 ml-1">
                    <strong>مدة محددة:</strong>
                  </label>

                  <div className="filter-group d-flex flex-wrap align-items-center justify-content-between p-0 mb-1">
                    <label className="form-label text-wrap text-right fw-bolder p-0 m-0">
                      من
                    </label>
                    <input
                      type="date"
                      className="form-control border-primary m-0 p-2 h-auto"
                      onChange={(e) => setStartDate(e.target.value)}
                      placeholder="اختر التاريخ"
                    />
                  </div>

                  <div className="filter-group d-flex flex-wrap align-items-center justify-content-between p-0 mb-1">
                    <label className="form-label text-wrap text-right fw-bolder p-0 m-0">
                      إلى
                    </label>
                    <input
                      type="date"
                      className="form-control border-primary m-0 p-2 h-auto"
                      onChange={(e) => setEndDate(e.target.value)}
                      placeholder="اختر التاريخ"
                    />
                  </div>

                  <div className="filter-group d-flex flex-wrap align-items-center justify-content-between p-0 mb-1">
                    <button
                      type="button"
                      className="btn btn-primary h-100 p-2 "
                      onClick={() =>
                        setAllClients(filterByDateRange(allClients))
                      }
                    >
                      <i className="fa fa-search"></i>
                    </button>
                    <button
                      type="button"
                      className="btn btn-warning h-100 p-2"
                      onClick={getAllClients}
                    >
                      استعادة
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>م</th>
                <th>الاسم</th>
                <th>الموبايل</th>
                <th>المنطقه</th>
                <th>العنوان</th>
                <th>موثق</th>
                <th>رفض الاوردر</th>
                <th>ملاحظات</th>
                <th>التاريخ</th>
                <th>اجراءات</th>
              </tr>
            </thead>
            <tbody>
              {allClients &&
                allClients.map((client, i) => {
                  if ((i >= startPagination) & (i < endPagination)) {
                    return (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{client.name}</td>
                        <td>{client.phone}</td>
                        <td>{client.deliveryArea?.name}</td>
                        <td>{client.address}</td>
                        <td>{client.isVarified ? "موثق" : "غير موثق"}</td>
                        <td>{client.refusesOrders ? "رفض" : "لم يرفض "}</td>
                        <td>{client.notes}</td>
                        <td>{formatDateTime(client.createdAt)}</td>
                        <td>
                          <button
                            data-target="#editclientModal"
                            className="btn btn-sm btn-primary ml-2 "
                            data-toggle="modal"
                          >
                            <i
                              className="material-icons"
                              data-toggle="tooltip"
                              title="Edit"
                              onClick={() => {
                                handelEditclient(client);
                                setclientId(client._id);
                              }}
                            >
                              &#xE254;
                            </i>
                          </button>
                          <button
                            data-target="#deleteclientModal"
                            className="btn btn-sm btn-danger"
                            data-toggle="modal"
                          >
                            <i
                              className="material-icons"
                              data-toggle="tooltip"
                              title="Delete"
                              onClick={() => {
                                setclientId(client._id);
                              }}
                            >
                              &#xE872;
                            </i>
                          </button>
                        </td>
                      </tr>
                    );
                  }
                })}
            </tbody>
          </table>
          <div className="clearfix">
            <div className="hint-text text-dark">
              عرض{" "}
              <b>
                {allClients.length > endPagination
                  ? endPagination
                  : allClients.length}
              </b>{" "}
              من <b>{allClients.length}</b> عنصر
            </div>
            <ul className="pagination">
              <li onClick={EditPagination} className="page-item disabled">
                <a href="#">السابق</a>
              </li>
              <li
                onClick={EditPagination}
                className={`page-item ${endPagination === 5 ? "active" : ""}`}
              >
                <a href="#" className="page-link">
                  1
                </a>
              </li>
              <li
                onClick={EditPagination}
                className={`page-item ${endPagination === 10 ? "active" : ""}`}
              >
                <a href="#" className="page-link">
                  2
                </a>
              </li>
              <li
                onClick={EditPagination}
                className={`page-item ${endPagination === 15 ? "active" : ""}`}
              >
                <a href="#" className="page-link">
                  3
                </a>
              </li>
              <li
                onClick={EditPagination}
                className={`page-item ${endPagination === 20 ? "active" : ""}`}
              >
                <a href="#" className="page-link">
                  4
                </a>
              </li>
              <li
                onClick={EditPagination}
                className={`page-item ${endPagination === 25 ? "active" : ""}`}
              >
                <a href="#" className="page-link">
                  5
                </a>
              </li>
              <li
                onClick={EditPagination}
                className={`page-item ${endPagination === 30 ? "active" : ""}`}
              >
                <a href="#" className="page-link">
                  التالي
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div id="addclientModal" className="modal fade">
        <div className="modal-dialog modal-lg">
          <div className="modal-content shadow-lg border-0 rounded ">
            <form onSubmit={createClient}>
              <div className="modal-header d-flex flex-wrap align-items-center text-light bg-primary">
                <h4 className="modal-title">اضافة عميل</h4>
                <button
                  type="button"
                  className="close m-0 p-1"
                  data-dismiss="modal"
                  aria-hidden="true"
                >
                  &times;
                </button>
              </div>
              <div className="modal-body d-flex flex-wrap align-items-center p-3 text-right">
                <div className="form-group px-3 d-flex align-items-center justify-content-start col-12 col-md-6">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">
                    الاسم
                  </label>
                  <input
                    type="text"
                    className="form-control border-primary m-0 p-2 h-auto"
                    required
                    pattern="[A-Za-z\u0600-\u06FF\s]+"
                    name="name"
                    onChange={handleInputChange}
                  />
                  <div className="invalid-feedback">الرجاء إدخال اسم صالح.</div>
                </div>

                <div className="form-group px-3 d-flex align-items-center justify-content-start col-12 col-md-6">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">
                    الموبايل
                  </label>
                  <input
                    type="text"
                    className="form-control border-primary m-0 p-2 h-auto"
                    required
                    pattern="[0-9]{11}"
                    name="phone"
                    onChange={handleInputChange}
                  />
                  <div className="invalid-feedback">
                    الرجاء إدخال رقم هاتف صالح (11 رقم).
                  </div>
                </div>

                <div className="form-group px-3 d-flex align-items-center justify-content-start col-12 col-md-6">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">
                    المنطقة
                  </label>
                  <select
                    name="deliveryArea"
                    required
                    className="form-control border-primary m-0 p-2 h-auto"
                    onChange={handleInputChange}
                  >
                    <option value="">اختر</option>
                    {Areas &&
                      Areas.map((area) => (
                        <option key={area._id} value={area._id}>
                          {area.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="form-group px-3 d-flex align-items-center justify-content-start col-12 col-md-6">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">
                    العنوان
                  </label>
                  <input
                    type="text"
                    className="form-control border-primary m-0 p-2 h-auto"
                    required
                    pattern="[A-Za-z\u0600-\u06FF\s]+"
                    name="address"
                    value={clientData.address}
                    onChange={handleInputChange}
                  />
                  <div className="invalid-feedback">
                    الرجاء إدخال عنوان صالح.
                  </div>
                </div>

                <div className="form-group px-3 d-flex align-items-center justify-content-start col-12 col-md-6">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">
                    الحالة
                  </label>
                  <select
                    name="isVarified"
                    required
                    className="form-control border-primary m-0 p-2 h-auto"
                    onChange={handleInputChange}
                  >
                    <option value="">اختر</option>
                    <option value={true}>متاح</option>
                    <option value={false}>ليس متاح</option>
                  </select>
                </div>

                {/* <div className="form-group px-3 d-flex align-items-center justify-content-start col-12 col-md-6">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">الحالة</label>
                  <select name='refusesOrders' required className="form-control border-primary m-0 p-2 h-auto"   onChange={handleInputChange}>
                    <option value="">اختر</option>
                    <option value={true}>رفض اخر اوردر</option>
                    <option value={false}>لم يرفض الاوردر</option>
                  </select>
                </div> */}

                <div className="form-group px-3 d-flex align-items-center justify-content-start col-12 col-md-6">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">
                    ملاحظات
                  </label>
                  <textarea
                    className="form-control border-primary m-0 p-2 h-auto"
                    name="notes"
                    onChange={handleInputChange}
                  />
                  <div className="invalid-feedback">
                    الرجاء إدخال ملاحظات صالحة.
                  </div>
                </div>
              </div>

              <div className="modal-footer d-flex flex-nowrap align-items-center justify-content-between m-0 p-1">
                <input
                  type="submit"
                  className="btn btn-success col-6 h-100 px-2 py-3 m-0"
                  value="اضافة"
                />
                <input
                  type="button"
                  className="btn btn-danger col-6 h-100 px-2 py-3 m-0"
                  data-dismiss="modal"
                  value="اغلاق"
                />
              </div>
            </form>
          </div>
        </div>
      </div>

      <div id="editclientModal" className="modal fade">
        <div className="modal-dialog modal-lg">
          <div className="modal-content shadow-lg border-0 rounded ">
            <form onSubmit={updateClient}>
              <div className="modal-header d-flex flex-wrap align-items-center text-light bg-primary">
                <h4 className="modal-title">تعديل عميل</h4>
                <button
                  type="button"
                  className="close m-0 p-1"
                  data-dismiss="modal"
                  aria-hidden="true"
                >
                  &times;
                </button>
              </div>
              <div className="modal-body d-flex flex-wrap align-items-center p-3 text-right">
                <div className="form-group px-3 d-flex align-items-center justify-content-start col-12 col-md-6">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">
                    الاسم
                  </label>
                  <input
                    type="text"
                    className="form-control border-primary m-0 p-2 h-auto"
                    required
                    pattern="[A-Za-z\u0600-\u06FF\s]+"
                    name="name"
                    value={clientData.name}
                    onChange={handleInputChange}
                  />
                  <div className="invalid-feedback">الرجاء إدخال اسم صالح.</div>
                </div>

                <div className="form-group px-3 d-flex align-items-center justify-content-start col-12 col-md-6">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">
                    الموبايل
                  </label>
                  <input
                    type="text"
                    className="form-control border-primary m-0 p-2 h-auto"
                    required
                    pattern="[0-9]{11}"
                    name="phone"
                    value={clientData.phone}
                    onChange={handleInputChange}
                  />
                  <div className="invalid-feedback">
                    الرجاء إدخال رقم هاتف صالح (11 رقم).
                  </div>
                </div>

                <div className="form-group px-3 d-flex align-items-center justify-content-start col-12 col-md-6">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">
                    المنطقة
                  </label>
                  <select
                    name="deliveryArea"
                    required
                    className="form-control border-primary m-0 p-2 h-auto"
                    value={clientData.deliveryArea}
                    onChange={handleInputChange}
                  >
                    <option value="">
                      {
                        Areas.find(
                          (area) => area._id === clientData.deliveryArea
                        )?.nema
                      }
                    </option>
                    {Areas &&
                      Areas.map((area) => (
                        <option key={area._id} value={area._id}>
                          {area.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="form-group px-3 d-flex align-items-center justify-content-start col-12 col-md-6">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">
                    العنوان
                  </label>
                  <input
                    type="text"
                    className="form-control border-primary m-0 p-2 h-auto"
                    required
                    pattern="[A-Za-z\u0600-\u06FF\s]+"
                    name="address"
                    value={clientData.address}
                    onChange={handleInputChange}
                  />
                  <div className="invalid-feedback">
                    الرجاء إدخال عنوان صالح.
                  </div>
                </div>

                <div className="form-group px-3 d-flex align-items-center justify-content-start col-12 col-md-6">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">
                    التوثيق
                  </label>
                  <select
                    name="isVarified"
                    required
                    className="form-control border-primary m-0 p-2 h-auto"
                    value={clientData.isVarified}
                    onChange={handleInputChange}
                  >
                    <option value="">
                      {clientData.isVarified ? "موثق" : "غير موثق"}
                    </option>
                    <option value={true}>موثق</option>
                    <option value={false}>غير موثق</option>
                  </select>
                </div>

                <div className="form-group px-3 d-flex align-items-center justify-content-start col-12 col-md-6">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">
                    رفض الاوردرات
                  </label>
                  <select
                    name="refusesOrders"
                    required
                    className="form-control border-primary m-0 p-2 h-auto"
                    value={clientData.refusesOrders}
                    onChange={handleInputChange}
                  >
                    <option value="">
                      {clientData.refusesOrders
                        ? "رفض اوردر"
                        : "لم يرفض الاوردر"}
                    </option>
                    <option value={true}>رفض اوردر</option>
                    <option value={false}>لم يرفض الاوردر</option>
                  </select>
                </div>

                <div className="form-group px-3 d-flex align-items-center justify-content-start col-12 col-md-6">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">
                    ملاحظات
                  </label>
                  <textarea
                    className="form-control border-primary m-0 p-2 h-auto"
                    name="notes"
                    value={clientData.notes}
                    onChange={handleInputChange}
                  />
                  <div className="invalid-feedback">
                    الرجاء إدخال ملاحظات صالحة.
                  </div>
                </div>
              </div>

              <div className="modal-footer d-flex flex-nowrap align-items-center justify-content-between m-0 p-1">
                <input
                  type="submit"
                  className="btn btn-success col-6 h-100 px-2 py-3 m-0"
                  value="تحديث"
                />
                <input
                  type="button"
                  className="btn btn-danger col-6 h-100 px-2 py-3 m-0"
                  data-dismiss="modal"
                  value="اغلاق"
                />
              </div>
            </form>
          </div>
        </div>
      </div>

      <div id="deleteclientModal" className="modal fade">
        <div className="modal-dialog modal-lg">
          <div className="modal-content shadow-lg border-0 rounded ">
            <form onSubmit={deleteClient}>
              <div className="modal-header d-flex flex-wrap align-items-center text-light bg-primary">
                <h4 className="modal-title">حذف موظف</h4>
                <button
                  type="button"
                  className="close m-0 p-1"
                  data-dismiss="modal"
                  aria-hidden="true"
                >
                  &times;
                </button>
              </div>
              <div className="modal-body text-center">
                <p className="text-right text-dark fs-3 fw-800 mb-2">
                  هل أنت متأكد من حذف هذا السجل؟
                </p>
                <p className="text-warning text-center mt-3">
                  <small>لا يمكن الرجوع في هذا الإجراء.</small>
                </p>
              </div>
              <div className="modal-footer d-flex flex-nowrap align-items-center justify-content-between m-0 p-1">
                <input
                  type="submit"
                  className="btn btn-warning col-6 h-100 px-2 py-3 m-0"
                  value="حذف"
                />
                <input
                  type="button"
                  className="btn btn-danger col-6 h-100 px-2 py-3 m-0"
                  data-dismiss="modal"
                  value="اغلاق"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clients;
