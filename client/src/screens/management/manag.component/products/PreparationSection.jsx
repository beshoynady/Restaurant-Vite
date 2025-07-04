import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { dataContext } from "../../../../App";
import "../orders/Orders.css";

const PreparationSection = () => {
  const {
    allProducts,
    setIsLoading,
    EditPagination,
    startPagination,
    endPagination,
    setStartPagination,
    setEndPagination,
    handleGetTokenAndConfig,
    apiUrl,
  } = useContext(dataContext);

  const [preparationSectionName, setpreparationSectionName] = useState("");
  const [isActive, setisActive] = useState(false);

  const [PreparationSectionId, setPreparationSectionId] = useState("");

  const [allPreparationSections, setAllPreparationSections] = useState([]);

  const createPreparationSection = async (event) => {
    event.preventDefault();

    const config = await handleGetTokenAndConfig();

    const PreparationSectionData = {
      name: preparationSectionName,
      isActive,
    };

    try {
      const response = await axios.post(
        `${apiUrl}/api/preparationsection/`,
        PreparationSectionData,
        config
      );
      if (response.status === 409) {
        toast.error("هذا القسم موجود بالفعل تاكد من الاسم.");
      }
      console.log({
        newPreparationSection: response.data.data,
        PreparationSectionData,
      });
      if (response.status === 201) {
        await getAllPreparationSections();
        toast.success("تم إنشاء قسم الاعداد بنجاح.");
      } else {
        throw new Error("حدث خطأ أثناء إنشاء قسم الاعداد.");
      }
    } catch (error) {
      console.error("حدث خطأ أثناء إرسال الطلب:", error);
      if (error.response) {
        handleErrorResponse(error.response);
      } else {
        toast.error("حدث خطأ أثناء الاتصال بالخادم.");
      }
    }
  };

  const handleErrorResponse = (response) => {
    if (
      response.status === 400 &&
      response.data.message === "Preparation Section name already exists"
    ) {
      toast.error("اسم قسم الاعداد موجود بالفعل. الرجاء اختيار اسم آخر.");
    } else if (response.status === 401) {
      toast.error("انتهت صلاحية الجلسة، رجاء تسجيل الدخول مره أخرى.");
    } else {
      toast.error("حدث خطأ أثناء إنشاء قسم الاعداد. الرجاء المحاولة مرة أخرى.");
    }
  };

  const getAllPreparationSections = async () => {
    const config = await handleGetTokenAndConfig();

    try {
      const res = await axios.get(`${apiUrl}/api/preparationsection`, config);
      if (res.status === 200) {
        const PreparationSections = res.data.data;
        console.log({ PreparationSections });
        setAllPreparationSections(PreparationSections);
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (error) {
      console.error("حدث خطأ أثناء استلام البيانات:", error);
      toast.error("حدث خطأ أثناء جلب البيانات، يرجى المحاولة مرة أخرى لاحقًا.");
    }
  };

  const editPreparationSection = async (event) => {
    event.preventDefault();

    const config = await handleGetTokenAndConfig();

    const bodyData = {
      name: preparationSectionName,
      isActive,
    };

    try {
      const editResponse = await axios.put(
        `${apiUrl}/api/preparationsection/${PreparationSectionId}`,
        bodyData,
        config
      );

      if (editResponse.status === 200) {
        getAllPreparationSections();
        toast.success("تم تعديل قسم الاعداد بنجاح.");
      } else {
        throw new Error("فشل تعديل قسم الاعداد");
      }
    } catch (error) {
      console.error("حدث خطأ أثناء تعديل قسم الاعداد:", error);
      toast.error("حدث خطأ أثناء تعديل قسم الاعداد. الرجاء المحاولة لاحقًا.");
    }
  };

  const deletePreparationSection = async (event) => {
    event.preventDefault();

    const config = await handleGetTokenAndConfig();

    try {
      const deleted = await axios.delete(
        `${apiUrl}/api/preparationsection/${PreparationSectionId}`,
        config
      );
      if (deleted.status === 200) {
        getAllPreparationSections();
        toast.success("تم حذف قسم الاعداد بنجاح.");
      } else {
        throw new Error("فشل حذف قسم الاعداد");
      }
    } catch (error) {
      console.error("حدث خطأ أثناء حذف قسم الاعداد:", error);
      toast.error("حدث خطأ أثناء حذف قسم الاعداد. الرجاء المحاولة لاحقًا.");
    }
  };

  const searchByPreparationSectionName = (name) => {
    if (!name) {
      getAllPreparationSections();
    } else {
      const preparationSection = allPreparationSections
        ? allPreparationSections.filter(
            (PreparationSection) =>
              PreparationSection.name.startsWith(name) === true
          )
        : [];
      setAllPreparationSections(preparationSection);
    }
  };

  const handlePreparationSectionData = (PreparationSection) => {
    setPreparationSectionId(PreparationSection._id);
    setpreparationSectionName(PreparationSection.name);
    setisActive(PreparationSection.isActive);
  };

  useEffect(() => {
    getAllPreparationSections();
  }, []);

  return (
    <div className="w-100 px-3 d-flex align-itmes-center justify-content-start">
      <div className="table-responsive">
        <div className="table-wrapper p-3 mw-100">
          <div className="table-title">
            <div className="w-100 d-flex flex-wrap align-items-center justify-content-between">
              <div className="col-sm-6 text-right">
                <h2>
                  ادارة <b>اقسام اعداد الطلبات</b>
                </h2>
              </div>
              <div className="col-12 col-md-6 p-0 m-0 d-flex flex-wrap align-items-center justify-content-end print-hide">
                <a
                  href="#addPreparationSectionModal"
                  className="btn btn-success w-100 d-flex align-items-center justify-content-center text-nowrap"
                  data-toggle="modal"
                >
                  <span>اضافه قسم اعداد</span>
                </a>
              </div>
            </div>
          </div>

          <div className="table-filter print-hide">
            <div className="col-12 text-dark d-flex flex-wrap align-items-center justify-content-start p-0 m-0">
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
                  اسم قسم الاعداد
                </label>
                <input
                  type="text"
                  className="form-control border-primary m-0 p-2 h-auto"
                  onChange={(e) =>
                    searchByPreparationSectionName(e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          <table className="table table-striped table-hover">
            <thead>
              <tr>
                {/* <th>
                          <span className="custom-checkbox">
                            <input type="checkbox" className="form-check-input form-check-input-lg" id="selectAll" />
                            <label htmlFor="selectAll"></label>
                          </span>
                        </th> */}
                <th>م</th>
                <th>الاسم</th>
                <th>الحالة</th>
                <th>بواسطة</th>
                <th>تعديل</th>
                <th>اجراءات</th>
              </tr>
            </thead>
            <tbody>
              {allPreparationSections &&
                allPreparationSections.map((PreparationSection, i) => {
                  if ((i >= startPagination) & (i < endPagination)) {
                    return (
                      <tr key={i}>
                        {/* <td>
                                  <span className="custom-checkbox">
                                    <input type="checkbox" className="form-check-input form-check-input-lg" id="checkbox1" name="options[]" value="1" />
                                    <label htmlFor="checkbox1"></label>
                                  </span>
                                </td> */}
                        <td>{i + 1}</td>
                        <td>{PreparationSection.name}</td>
                        <td>
                          {PreparationSection.isActive ? "متاحة" : "ليست متاحة"}
                        </td>

                        <td>
                          {PreparationSection.createdBy
                            ? PreparationSection.createdBy?.username
                            : "غير معروف"}
                        </td>
                        <td>
                          {PreparationSection.updatedBy
                            ? PreparationSection.updatedBy?.username
                            : "لا يوجد"}
                        </td>
                        <td>
                          <button
                            data-target="#editPreparationSectionModal"
                            className="btn btn-sm btn-primary ml-2 "
                            data-toggle="modal"
                            onClick={() =>
                              handlePreparationSectionData(PreparationSection)
                            }
                          >
                            <i
                              className="material-icons"
                              data-toggle="tooltip"
                              title="Edit"
                            >
                              &#xE254;
                            </i>
                          </button>

                          <button
                            data-target="#deletePreparationSectionModal"
                            className="btn btn-sm btn-danger"
                            data-toggle="modal"
                            onClick={() =>
                              setPreparationSectionId(PreparationSection._id)
                            }
                          >
                            <i
                              className="material-icons"
                              data-toggle="tooltip"
                              title="Delete"
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
                {allPreparationSections.length > endPagination
                  ? endPagination
                  : allPreparationSections.length}
              </b>{" "}
              من <b>{allPreparationSections.length}</b> عنصر
            </div>
            <ul className="pagination">
              <li onClick={EditPagination} className="page-item disabled">
                <a href="#">السابق</a>
              </li>
              <li onClick={EditPagination} className="page-item">
                <a href="#" className="page-link">
                  1
                </a>
              </li>
              <li onClick={EditPagination} className="page-item">
                <a href="#" className="page-link">
                  2
                </a>
              </li>
              <li onClick={EditPagination} className="page-item true">
                <a href="#" className="page-link">
                  3
                </a>
              </li>
              <li onClick={EditPagination} className="page-item">
                <a href="#" className="page-link">
                  4
                </a>
              </li>
              <li onClick={EditPagination} className="page-item">
                <a href="#" className="page-link">
                  5
                </a>
              </li>
              <li onClick={EditPagination} className="page-item">
                <a href="#" className="page-link">
                  التالي
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div id="addPreparationSectionModal" className="modal fade">
        <div className="modal-dialog modal-lg">
          <div className="modal-content shadow-lg border-0 rounded ">
            <form onSubmit={(e) => createPreparationSection(e, setIsLoading)}>
              <div className="modal-header d-flex flex-wrap align-items-center text-light bg-primary">
                <h4 className="modal-title">اضافه قسم اعداد</h4>
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
                <div className="form-group col-12 col-md-6">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">
                    الاسم
                  </label>
                  <input
                    type="text"
                    className="form-control border-primary m-0 p-2 h-auto"
                    required
                    value={preparationSectionName}
                    onChange={(e) => setpreparationSectionName(e.target.value)}
                  />
                </div>
                <div className="form-group col-12 col-md-6">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">
                    الحالة
                  </label>
                  <select
                    className="form-control border-primary m-0 p-2 h-auto"
                    value={isActive.toString()}
                    onChange={(e) => setisActive(e.target.value === "true")}
                  >
                    <option value="">اختر الحالة</option>
                    <option value="true">متاح</option>
                    <option value="false">غير متاح</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer d-flex flex-nowrap align-items-center justify-content-between m-0 p-1">
                <input
                  type="submit"
                  className="btn btn-success col-6 h-100 px-2 py-3 m-0"
                  value="اضافه"
                />
                <input
                  type="button"
                  className="btn btn-danger col-6 h-100 px-2 py-3 m-0"
                  data-dismiss="modal"
                  value="إغلاق"
                />
              </div>
            </form>
          </div>
        </div>
      </div>

      <div id="editPreparationSectionModal" className="modal fade">
        <div className="modal-dialog modal-lg">
          <div className="modal-content shadow-lg border-0 rounded ">
            <form onSubmit={editPreparationSection}>
              <div className="modal-header d-flex flex-wrap align-items-center text-light bg-primary">
                <h4 className="modal-title">تعديل قسم الاعداد</h4>
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
                <div className="form-group col-12 col-md-6">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">
                    الاسم
                  </label>
                  <input
                    type="text"
                    className="form-control border-primary m-0 p-2 h-auto"
                    required
                    value={preparationSectionName}
                    onChange={(e) => setpreparationSectionName(e.target.value)}
                  />
                </div>
                <div className="form-group col-12 col-md-6">
                  <label className="form-label text-wrap text-right fw-bolder p-0 m-0">
                    الحالة
                  </label>
                  <select
                    className="form-control border-primary m-0 p-2 h-auto"
                    value={isActive.toString()} // تحويل قيمة isActive إلى سلسلة نصية
                    onChange={(e) => setisActive(e.target.value === "true")} // تحويل القيمة المحددة إلى قيمة بوليانية
                  >
                    <option value="true">متاح</option>
                    <option value="false">غير متاح</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer d-flex flex-nowrap align-items-center justify-content-between m-0 p-1">
                <input
                  type="submit"
                  className="btn btn-success col-6 h-100 px-2 py-3 m-0"
                  value="حفظ"
                />
                <input
                  type="button"
                  className="btn btn-danger col-6 h-100 px-2 py-3 m-0"
                  data-dismiss="modal"
                  value="إغلاق"
                />
              </div>
            </form>
          </div>
        </div>
      </div>

      <div id="deletePreparationSectionModal" className="modal fade">
        <div className="modal-dialog modal-lg">
          <div className="modal-content shadow-lg border-0 rounded ">
            <form onSubmit={deletePreparationSection}>
              <div className="modal-header d-flex flex-wrap align-items-center text-light bg-primary">
                <h4 className="modal-title">حذف قسم اعداد</h4>
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
                <p>هل انت متاكد من حذف هذا قسم الاعداد?</p>
                <p className="text-warning text-center mt-3">
                  <small>لا يمكن الرجوع فيه.</small>
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
                  value="إغلاق"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreparationSection;
