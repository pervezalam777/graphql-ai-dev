import { gql, useQuery } from '@apollo/client';

const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
    }
  }
`;

export const CategoryList = () => {
  const { data, loading, error } = useQuery(GET_CATEGORIES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Categories</h1>
      <div className="grid gap-4">
        {data.categories.map((category: any) => (
          <div
            key={category.id}
            className="bg-white p-4 rounded shadow"
          >
            <h3 className="text-lg font-semibold">{category.name}</h3>
            <p className="text-gray-600">ID: {category.id}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
