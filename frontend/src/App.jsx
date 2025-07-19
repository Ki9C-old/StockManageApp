import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from './AuthContext';
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

function App() {
  return (
    <BrowserRouter>
      {/* AuthProviderでアプリケーション全体をラップし、認証状態を共有できるようにする */}
      <AuthProvider>
        <Routes>
          {/* ログインページは保護しない（誰でもアクセス可能） */}
          <Route path="/login" element={<Login />} />

          {/* その他のすべてのルートはProtectedRouteで保護する */}
          {/* Layoutコンポーネント自体も保護されたルートの一部として扱う */}
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            {/* Layoutの子ルートとして各ページを定義 */}
            <Route index element={<Home />} /> {/* デフォルトのルート */}
            <Route path="home" element={<Home />} />

            {/* 発注関連機能 */}
            <Route path="purchase" element={<PurchaseList />} />
            <Route path="purchase/create" element={<PurchaseDetail mode="create" />} />
            <Route path="purchase/:id/view" element={<PurchaseDetail mode="view" />} />
            <Route path="purchase/:id/edit" element={<PurchaseDetail mode="edit" />} />

            {/* 入荷関連機能 */}
            <Route path="import" element={<ImportList />} />
            <Route path="order" element={<OrderList />} />
            <Route path="export" element={<ExportList />} />
            <Route path="stock" element={<StockList />} />
            <Route path="slip" element={<SlipList />} />
            <Route path="master" element={<MasterList />} />
          </Route>

          {/* 定義されていないパスへのアクセスはログインページへリダイレクト */}
          {/* または、NotFoundページなどへリダイレクトすることも可能 */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;