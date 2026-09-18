import { Routes, Route } from 'react-router-dom';
import { ProductList } from './components/ProductList';
import { ProductForm } from './components/ProductForm';
import { CategoryList } from './components/CategoryList';
import { Header } from './components/Header';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/new" element={<ProductForm />} />
          <Route path="/products/:id/edit" element={<ProductForm />} />
          <Route path="/categories" element={<CategoryList />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
