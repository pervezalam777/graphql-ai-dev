import { Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PRODUCTS, DELETE_PRODUCT } from '../graphql/queries';

export const ProductList = () => {
  const { data, loading, error, refetch } = useQuery(GET_PRODUCTS);
  const [deleteProduct] = useMutation(DELETE_PRODUCT, {
    update: (cache, { data: deleteData }) => {
      if (deleteData.deleteProduct) {
        const existingProducts = data?.products || [];
        cache.writeQuery({
          query: GET_PRODUCTS,
          data: {
            products: existingProducts.filter((p: any) => p.id !== deleteData.deleteProduct),
          },
        });
        refetch();
      }
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      <div className="mb-4">
        <Link
          to="/products/new"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New Product
        </Link>
      </div>
      <div className="grid gap-4">
        {data.products.map((product: any) => (
          <div
            key={product.id}
            className="bg-white p-4 rounded shadow"
          >
            <h3 className="text-lg font-semibold">
              <Link to={`/products/${product.id}`}>{product.name}</Link>
            </h3>
            <p className="text-gray-600">${product.price}</p>
            <p className="text-gray-600">Stock: {product.stock}</p>
            <p className="text-gray-600">
              Category: {product.category?.name || 'N/A'}
            </p>
            <div className="mt-2 flex gap-2">
              <Link
                to={`/products/${product.id}/edit`}
                className="text-blue-500 hover:underline text-sm"
              >
                Edit
              </Link>
              <button
                onClick={() => deleteProduct({ variables: { id: product.id } })}
                className="text-red-500 hover:underline text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
