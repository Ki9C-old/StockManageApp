import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home/Home';
import PurchaseList from './pages/Purchase/PurchaseList';
import ImportList from './pages/Import/ImportList';
import OrderList from './pages/Order/OrderList';
import ExportList from './pages/Export/ExportList';
import StockList from './pages/Stock/StockList';
import SlipList from './pages/Slip/SlipList';
import MasterList from './pages/Master/MasterList';
import PurchaseDetail from './pages/Purchase/PurchaseDetail';
import Login from "./pages/Login"
import ProductMaster from './pages/Master/ProductMaster.jsx';
import ClientMaster from './pages/Master/ClientMaster.jsx';
import TaxMaster from './pages/Master/TaxMaster.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ImportDetail from './pages/Import/ImportDetail.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/home" replace />} />
          <Route path="home" element={<Home />} />

          <Route path="purchase" element={<PurchaseList />} />
          <Route path="purchase/create" element={<PurchaseDetail mode="create" />} />
          <Route path="purchase/:id/view" element={<PurchaseDetail mode="view" />} />
          <Route path="purchase/:id/edit" element={<PurchaseDetail mode="edit" />} />

          <Route path="import" element={<ImportList />} />
          <Route path="import/:id/view" element={<ImportDetail />} />

          <Route path="order" element={<OrderList />} />
          <Route path="export" element={<ExportList />} />
          <Route path="stock" element={<StockList />} />
          <Route path="slip" element={<SlipList />} />
          <Route path="master" element={<MasterList />} />
          <Route path="master/product" element={<ProductMaster />} />
          <Route path="master/client" element={<ClientMaster />} />
          <Route path="master/tax" element={<TaxMaster />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter >
  );
}

export default App;