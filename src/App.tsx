import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Catalog from './pages/Catalog/Catalog';
import ProductDetails from './pages/ProductDetails/ProductDetails';
import Login from './pages/Admin/Login';
import Dashboard from './pages/Admin/Dashboard';
import JewelryForm from './pages/Admin/JewelryForm';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main style={{ minHeight: '80vh' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/admin" element={<Login />} />
          
          <Route element={<ProtectedRoute />}>
            {/* Protected Admin Routes */}
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/jewelry/new" element={<JewelryForm />} />
            <Route path="/admin/jewelry/edit/:id" element={<JewelryForm />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
