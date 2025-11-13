import Pagination from '@/components/pagination';
import Sidebar from '@/components/sidebar';
import { deleteProduct } from '@/lib/actions/products';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import React from 'react';

const InventoryPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) => {
  const user = await getCurrentUser();
  const userId = user.id;

  const params = await searchParams;
  const q = (params.q || '').trim();

  const where = {
    userId,
    ...(q ? { name: { contains: q, mode: 'insensitive' as const } } : {}),
  };

  const pageSize = 3;
  const page = Math.max(Number(params.page || '1'), 1);

  const [totalCount, totalProducts] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar currentPath="/inventory" />
      <main className="ml-64 p-8">
        {/* header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Inventory
              </h1>
              <p className="text-sm text-gray-500">
                Manage your inventory items here
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* search */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <form action="/inventory" className="flex gap-2" method="GET">
              <input
                type="text"
                name="q"
                placeholder="Search products..."
                className="flex-1 px-4 border text-gray-900 border-gray-300 rounded-lg focus:border-transparent"
              />
              <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Search
              </button>
            </form>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    'Name',
                    'SKU',
                    'Price',
                    'Quantity',
                    'Low Stock At',
                    'Actions',
                  ].map((item) => (
                    <th
                      key={item}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                    >
                      {item}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {totalProducts.map((product) => (
                  <tr className="hover:bg-gray-50" key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.sku || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${Number(product.price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.lowStockAt || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <form
                        action={async (formData: FormData) => {
                          'use server';
                          await deleteProduct(formData);
                        }}
                      >
                        <input
                          type="hidden"
                          name="id"
                          id={product.id}
                          value={product.id}
                        />
                        <button className="text-red-600 hover:text-red-900">
                          Delete
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                baseUrl="/inventory"
                searchParams={{ q, pageSize: String(pageSize) }}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default InventoryPage;
