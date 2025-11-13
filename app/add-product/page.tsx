import Sidebar from '@/components/sidebar';
import { addProduct } from '@/lib/actions/products';
import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';
import React from 'react';

const InputWithLabel = ({
  label,
  name,
  ...inputProps
}: {
  label: string;
  name: string;
} & React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
      <input
        name={name}
        id={name}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
        {...inputProps}
      />
    </div>
  );
};

const AddProductPage = async () => {
  await getCurrentUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar currentPath="/add-product" />

      <main className="ml-64 p-8">
        {/* header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Add Product
              </h1>
              <p className="text-sm text-gray-500">
                Add a new product to your inventory
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-2xl">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <form action={addProduct} className="space-y-6">
              <InputWithLabel
                label="Product Name *"
                name="name"
                placeholder="Enter product name"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputWithLabel
                  label="Quantity *"
                  name="quantity"
                  type="number"
                  min={0}
                  required
                  placeholder="0"
                />
                <InputWithLabel
                  label="Price *"
                  type="number"
                  name="price"
                  step={0.01}
                  min={0}
                  required
                  placeholder="0.0"
                />
              </div>

              <div>
                <InputWithLabel
                  label="SKU (optional)"
                  type="text"
                  name="sku"
                  placeholder="Enter SKU"
                />
              </div>

              <div>
                <InputWithLabel
                  label="Low Stock At (optional)"
                  type="number"
                  name="lowStockAt"
                  min={0}
                  placeholder="Enter low stock threshold"
                />
              </div>

              <div className="flex gap-5">
                <button
                  type="submit"
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Add Product
                </button>
                <Link
                  href="/inventory"
                  className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddProductPage;
