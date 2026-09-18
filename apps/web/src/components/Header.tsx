import { Link } from 'react-router-dom';

export const Header = () => {
  return (
    <header className="bg-blue-600 text-white shadow">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex gap-6">
          <Link
            to="/"
            className="text-xl font-bold hover:text-blue-200"
          >
            Inventory
          </Link>
          <Link
            to="/products"
            className="hover:text-blue-200"
          >
            Products
          </Link>
          <Link
            to="/categories"
            className="hover:text-blue-200"
          >
            Categories
          </Link>
        </nav>
      </div>
    </header>
  );
};
