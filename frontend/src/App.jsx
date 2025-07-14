import Layout from './components/layout/Layout';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import PurchaseList from './pages/Purchase/PurchaseList';
import ImportList from './pages/Import/ImportList';
import OrderList from './pages/Order/OrderList';
import ExportList from './pages/Export/ExportList';
import StockList from './pages/Stock/StockList';
import SlipList from './pages/Slip/SlipList';
import MasterList from './pages/Master/MasterList';
import PurchaseDetail from './pages/Purchase/PurchaseDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="purchase" element={<PurchaseList />} />
          <Route path="purchase/create" element={<PurchaseDetail mode="create" />} />
          <Route path="purchase/:id/view" element={<PurchaseDetail mode="view" />} />
          <Route path="purchase/:id/edit" element={<PurchaseDetail mode="edit" />} />
          <Route path="import" element={<ImportList />} />
          <Route path="order" element={<OrderList />} />
          <Route path="export" element={<ExportList />} />
          <Route path="stock" element={<StockList />} />
          <Route path="slip" element={<SlipList />} />
          <Route path="master" element={<MasterList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;