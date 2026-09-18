import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_CATEGORIES, GET_PRODUCTS, CREATE_PRODUCT, UPDATE_PRODUCT } from '../graphql/queries';
import { updateCacheAfterCreate, updateCacheAfterUpdate } from '../graphql/queries';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
}

export const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product>({
    id: '',
    name: '',
    description: '',
    price: 0,
    stock: 0,
    categoryId: '',
  });
  const [categories, setCategories] = useState<any[]>([]);

  const { loading: categoriesLoading, data: categoriesData } = useQuery(
    GET_CATEGORIES
  );

  const { loading: productLoading, data: productData } = useQuery(GET_PRODUCTS);

  // Read existing products from cache for update operations
  const { data: existingProductsData } = useQuery(GET_PRODUCTS);

  const [createProduct, { error: createError }] = useMutation(CREATE_PRODUCT, {
    update: (cache, { data: createData }) => {
      const existingProducts = existingProductsData?.products || [];
      updateCacheAfterCreate(cache, createData.createProduct, existingProducts);
    },
  });

  const [updateProduct, { error: updateError }] = useMutation(UPDATE_PRODUCT, {
    update: (cache, { data: updateData }) => {
      const existingProducts = existingProductsData?.products || [];
      updateCacheAfterUpdate(
        cache,
        updateData.updateProduct.id,
        updateData.updateProduct,
        existingProducts
      );
    },
  });

  useEffect(() => {
    if (categoriesData?.categories) {
      setCategories(categoriesData.categories);
    }
  }, [categoriesData]);

  useEffect(() => {
    if (id && productData?.product) {
      setProduct(productData.product);
    }
  }, [productData, id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (id) {
        await updateProduct({
          variables: { id, input: product },
        });
      } else {
        await createProduct({
          variables: { input: product },
        });
      }
      navigate('/products');
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  if (categoriesLoading) return <p>Loading categories...</p>;
  if (id && productLoading) return <p>Loading product...</p>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {id ? 'Edit Product' : 'Add New Product'}
      </h1>

      {createError || updateError ? (
        <p className="text-red-500 mb-4">
          Error: {createError?.message || updateError?.message}
        </p>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stock</label>
            <input
              type="number"
              name="stock"
              value={product.stock}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            name="categoryId"
            value={product.categoryId}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            {id ? 'Update Product' : 'Create Product'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
