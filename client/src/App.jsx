import React, { createContext, useState, useEffect, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
import io from "socket.io-client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LoadingPage from "./screens/management/manag.component/LoadingPage/LoadingPage";
import NoInternetPage from "./screens/management/manag.component/LoadingPage/NoInternetPage";
import Userscreen from "./screens/user.screen/Userscreen";
import Login from "./screens/management/manag.component/login/Login";

const ManagLayout = React.lazy(() =>
  import("./screens/management/ManagLayout")
);
const ManagerDash = React.lazy(() =>
  import("./screens/management/manag.component/managerdash/ManagerDash")
);
const ManagerDashBoard = React.lazy(() =>
  import(
    "./screens/management/manag.component/managerdash/ManagerDashBoard.jsx"
  )
);
const Info = React.lazy(() =>
  import("./screens/management/manag.component/setting/info")
);
const Orders = React.lazy(() =>
  import("./screens/management/manag.component/orders/Orders")
);
const PreparationTicket = React.lazy(() =>
  import("./screens/management/manag.component/orders/PreparationTicket.jsx")
);
const Products = React.lazy(() =>
  import("./screens/management/manag.component/products/Products")
);
const PreparationSection = React.lazy(() =>
  import("./screens/management/manag.component/products/PreparationSection.jsx")
);
const ProductRecipe = React.lazy(() =>
  import("./screens/management/manag.component/products/ProductRecipe")
);
const Tables = React.lazy(() =>
  import("./screens/management/manag.component/tables/Tables")
);
const TablesPage = React.lazy(() =>
  import("./screens/management/manag.component/tables/TablesPage")
);
const ReservationTables = React.lazy(() =>
  import("./screens/management/manag.component/tables/ReservationTables")
);
const Employees = React.lazy(() =>
  import("./screens/management/manag.component/employees/Employees")
);
const PermissionsComponent = React.lazy(() =>
  import("./screens/management/manag.component/employees/Permissions")
);
const EmployeeTransactions = React.lazy(() =>
  import("./screens/management/manag.component/employees/EmployeeTransactions")
);
const PayRoll = React.lazy(() =>
  import("./screens/management/manag.component/employees/PayRoll")
);
const AttendanceManagement = React.lazy(() =>
  import("./screens/management/manag.component/employees/attendance")
);
const MenuCategory = React.lazy(() =>
  import("./screens/management/manag.component/products/MenuCategory")
);
const PreparationScreen = React.lazy(() =>
  import("./screens/management/manag.component/kitchen/PreparationScreen.jsx")
);

const Waiter = React.lazy(() =>
  import("./screens/management/manag.component/waiter/Waiter")
);
const DeliveryMan = React.lazy(() =>
  import("./screens/management/manag.component/deliveryman/DeliveryMan")
);
const POS = React.lazy(() =>
  import("./screens/management/manag.component/pos/POS")
);
const Suppliers = React.lazy(() =>
  import("./screens/management/manag.component/suppliers/Suppliers")
);
const Purchase = React.lazy(() =>
  import("./screens/management/manag.component/suppliers/Purchase")
);
const PurchaseReturn = React.lazy(() =>
  import("./screens/management/manag.component/suppliers/PurchaseReturn.jsx")
);
const SupplierTransaction = React.lazy(() =>
  import("./screens/management/manag.component/suppliers/SupplierTransaction")
);
const CategoryStock = React.lazy(() =>
  import("./screens/management/manag.component/stock/CategoryStock")
);
const Store = React.lazy(() =>
  import("./screens/management/manag.component/stock/Store.jsx")
);
const StockItem = React.lazy(() =>
  import("./screens/management/manag.component/stock/StockItem")
);
const ProductionRecipe = React.lazy(() =>
  import("./screens/management/manag.component/stock/ProductionRecipe.jsx")
);
const ProductionOrder = React.lazy(() =>
  import("./screens/management/manag.component/stock/ProductionOrder.jsx")
);
const ProductionRecord = React.lazy(() =>
  import("./screens/management/manag.component/stock/ProductionRecord.jsx")
);
const StockMovement = React.lazy(() =>
  import("./screens/management/manag.component/stock/StockMovement")
);
const BatchStockReport = React.lazy(() =>
  import("./screens/management/manag.component/stock/BatchStockReport.jsx")
);
const SectionConsumption = React.lazy(() =>
  import("./screens/management/manag.component/stock/SectionConsumption.jsx")
);

const ExpenseItem = React.lazy(() =>
  import("./screens/management/manag.component/expenses/Expense")
);
const DailyExpense = React.lazy(() =>
  import("./screens/management/manag.component/expenses/dailyExpense")
);
const CashRegister = React.lazy(() =>
  import("./screens/management/manag.component/cash/CashRegister")
);
const CashMovement = React.lazy(() =>
  import("./screens/management/manag.component/cash/CashMovement")
);
const Users = React.lazy(() =>
  import("./screens/management/manag.component/clients/Users.jsx")
);
const Clients = React.lazy(() =>
  import("./screens/management/manag.component/clients/Clients.jsx")
);
const ClientMessage = React.lazy(() =>
  import("./screens/management/manag.component/clients/ClientMessage.jsx")
);
const ProfitLoss = React.lazy(() =>
  import("./screens/management/manag.component/reports/ProfitAndLoss.jsx")
);




import { AuthProvider } from "./context/AuthContext";
import { SharedProvider } from "./context/SharedContext";
import { CartCardProvider } from "./context/CartCardContext";
import { SocketProvider } from "./context/SocketContext";
import { ManagementDataProvider } from "./context/ManagementDataContext";
import {InvoiceProvider} from "./context/InvoiceContext";
import {ClientProvider} from "./context/ClientContext";



function App() {
  axios.defaults.withCredentials = true;


  return (

    <BrowserRouter>
      <SharedProvider>
        <CartCardProvider>
          {/* <SocketProvider> */}
            {isLoading && <LoadingPage />}
            {!isOnline && <NoInternetPage />}

            <Routes>
              <Route path="/" element={
                <ClientProvider>
                  <Userscreen />
                </ClientProvider>
              }
              />
              <Route path="/:id" element={
                <ClientProvider>
                  <Userscreen />
                </ClientProvider>
              }
              />
              <Route path="/login" element={
                <AuthProvider>
                  <Login />
                </AuthProvider>
              } />

              <Route
                path="/management/*"
                element={
                  <Suspense fallback={<LoadingPage />}>
                    <AuthProvider>
                      <ManagementDataProvider>
                        <InvoiceProvider>
                          <ManagLayout />
                        </InvoiceProvider>
                      </ManagementDataProvider>
                    </AuthProvider>
                  </Suspense>
                }
              >
                <Route
                  index
                  element={
                    <Suspense fallback={<LoadingPage />}>
                      {employeeLoginInfo?.role === "chef" ? (
                        <PreparationScreen />
                      ) : employeeLoginInfo?.role === "waiter" ? (
                        <Waiter />
                      ) : employeeLoginInfo?.role === "deliveryMan" ? (
                        <DeliveryMan />
                      ) : (
                        <ManagerDash />
                      )}
                    </Suspense>
                  }
                />
                {/* <Route index element={<Suspense fallback={<LoadingPage />}><ManagerDash /></Suspense>} /> */}
                <Route
                  path="managerdashboard"
                  element={
                    <Suspense fallback={<LoadingPage />}>
                      <ManagerDashBoard />
                    </Suspense>
                  }
                />
                <Route
                  path="info"
                  element={
                    <Suspense fallback={<LoadingPage />}>
                      <Info />
                    </Suspense>
                  }
                />
                <Route
                  path="orders"
                  element={
                    <Suspense fallback={<LoadingPage />}>
                      <Orders />
                    </Suspense>
                  }
                />
                <Route
                  path="preparationticket"
                  element={
                    <Suspense fallback={<LoadingPage />}>
                      <PreparationTicket />
                    </Suspense>
                  }
                />
                <Route
                  path="products"
                  element={
                    <Suspense fallback={<LoadingPage />}>
                      <Products />
                    </Suspense>
                  }
                />
                <Route
                  path="preparationsection"
                  element={
                    <Suspense fallback={<LoadingPage />}>
                      <PreparationSection />
                    </Suspense>
                  }
                />
                <Route
                  path="productrecipe"
                  element={
                    <Suspense fallback={<LoadingPage />}>
                      <ProductRecipe />
                    </Suspense>
                  }
                />
                <Route
                  path="tables"
                  element={
                    <Suspense fallback={<LoadingPage />}>
                      <Tables />
                    </Suspense>
                  }
                />
                <Route
                  path="tablespage"
                  element={
                    <Suspense fallback={<LoadingPage />}>
                      <TablesPage />
                    </Suspense>
                  }
                />
                <Route
                  path="reservation"
                  element={
                    <Suspense fallback={<LoadingPage />}>
                      <ReservationTables />
                    </Suspense>
                  }
                />
                <Route
                  path="employees"
                  element={
                    <Suspense fallback={<LoadingPage />}>
                      <Employees />
                    </Suspense>
                  }
                />
                <Route
                  path="permissions"
                  element={
                    <Suspense fallback={<LoadingPage />}>
                      <PermissionsComponent />
                    </Suspense>
                  }
                />
                <Route
                  path="employeetransactions"
                  element={
                    <Suspense fallback={<LoadingPage />}>
                      <EmployeeTransactions />
                    </Suspense>
                  }
                />
                <Route
                  path="payroll"
                  element={
                    <Suspense fallback={<LoadingPage />}>
                      <PayRoll />
                    </Suspense>
                  }
                />
                <Route
                  path="attendancerecord"
                  element={
                    <Suspense fallback={<LoadingPage />}>
                      <AttendanceManagement />
                    </Suspense>
                  }
                />
                <Route
                  path="menucategory"
                  element={
                    <Suspense fallback={<LoadingPage />}>
                      <MenuCategory />
                    </Suspense>
                  }
                />
                <Route
                  path="preparationscreen"
                  element={
                    <Suspense fallback={<LoadingPage />}>
                      <PreparationScreen />
                    </Suspense>
                  }
                />

                <Route
                  path="waiter"
                  element={
                    <Suspense fallback={<LoadingPage />}>
                      <Waiter />
                    </Suspense>
                  }
                />
                <Route
                  path="deliveryman"
                  element={
                    <Suspense fallback={<LoadingPage />}>
                      <DeliveryMan />
                    </Suspense>
                  }
                />
                <Route
                  path="pos"
                  element={
                    <Suspense fallback={<LoadingPage />}>
                      <POS />
                    </Suspense>
                  }
                />
                <Route
                  path="supplier"
                  element={
                    <Suspense fallback={<LoadingPage />}>
                      <Suppliers />
                    </Suspense>
                  }
                />
                <Route
                  path="purchase"
                  element={
                    <Suspense fallback={<LoadingPage />}>
                      <Purchase />
                    </Suspense>
                  }
                />
                <Route
                  path="purchasereturn"
                  element={
                    <Suspense fallback={<LoadingPage />}>
                      <PurchaseReturn />
                    </Suspense>
                  }
                />
                <Route
                  path="suppliertransaction"
                  element={
                    <Suspense fallback={<LoadingPage />}>
                      <SupplierTransaction />
                    </Suspense>
                  }
                />
                <Route
                  path="categoryStock"
                  element={
                    <Suspense fallback={<LoadingPage />}>
                      <CategoryStock />
                    </Suspense>
                  }
                />
                <Route
                  path="store"
                  element={
                    <Suspense fallback={<LoadingPage />}>
                      <Store />
                    </Suspense>
                  }
                />
                <Route
                  path="stockitem"
                  element={
                    <Suspense fallback={<LoadingPage />}>
                      <StockItem />
                    </Suspense>
                  }
                />
                <Route
                  path="productionrecipe"
                  element={
                    <Suspense fallback={<LoadingPage />}>
                      <ProductionRecipe />
                    </Suspense>
                  }
                />
                <Route
                  path="productionorder"
                  element={
                    <Suspense fallback={<LoadingPage />}>
                      <ProductionOrder />
                    </Suspense>
                  }
                />
                <Route
                  path="productionrecord"
                  element={
                    <Suspense fallback={<LoadingPage />}>
                      <ProductionRecord />
                    </Suspense>
                  }
                />
                <Route
                  path="StockMovement"
                  element={
                    <Suspense fallback={<LoadingPage />}>
                      <StockMovement />
                    </Suspense>
                  }
                />
                <Route
                  path="batchstockreport"
                  element={
                    <Suspense fallback={<LoadingPage />}>
                      <BatchStockReport />
                    </Suspense>
                  }
                />
                <Route
                  path="sectionconsumption"
                  element={
                    <Suspense fallback={<LoadingPage />}>
                      <SectionConsumption />
                    </Suspense>
                  }
                />

                <Route
                  path="expense"
                  element={
                    <Suspense fallback={<LoadingPage />}>
                      <ExpenseItem />
                    </Suspense>
                  }
                />
                <Route
                  path="dailyexpense"
                  element={
                    <Suspense fallback={<LoadingPage />}>
                      <DailyExpense />
                    </Suspense>
                  }
                />
                <Route
                  path="cashregister"
                  element={
                    <Suspense fallback={<LoadingPage />}>
                      <CashRegister />
                    </Suspense>
                  }
                />
                <Route
                  path="cashmovement"
                  element={
                    <Suspense fallback={<LoadingPage />}>
                      <CashMovement />
                    </Suspense>
                  }
                />
                <Route
                  path="users"
                  element={
                    <Suspense fallback={<LoadingPage />}>
                      <Users />
                    </Suspense>
                  }
                />
                <Route
                  path="clients"
                  element={
                    <Suspense fallback={<LoadingPage />}>
                      <Clients />
                    </Suspense>
                  }
                />
                <Route
                  path="message"
                  element={
                    <Suspense fallback={<LoadingPage />}>
                      <ClientMessage />
                    </Suspense>
                  }
                />
                <Route
                  path="profitloss"
                  element={
                    <Suspense fallback={<LoadingPage />}>
                      <ProfitLoss />
                    </Suspense>
                  }
                />
              </Route>

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          {/* </SocketProvider> */}
        </CartCardProvider>
      </SharedProvider>
    </BrowserRouter>
  );
}


export default App;