import ProductChart from '@/components/products-chart';
import Sidebar from '@/components/sidebar';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { TrendingUp } from 'lucide-react';

const DashboardPage = async () => {
  const user = await getCurrentUser();
  const userId = user.id;

  const [totalProducts, lowStockProducts, allProducts] = await Promise.all([
    await prisma.product.count({
      where: { userId },
    }),
    await prisma.product.count({
      where: {
        userId,
        lowStockAt: { not: null },
        quantity: { lte: 5 },
      },
    }),
    await prisma.product.findMany({
      where: { userId },
      select: { price: true, quantity: true, createdAt: true },
    }),
  ]);

  const totalValue = allProducts.reduce(
    (sum, product) => sum + Number(product.price) * Number(product.quantity),
    0
  );

  const inStockCount = allProducts.filter(
    (product) => product.quantity > 5
  ).length;
  const lowStockCount = allProducts.filter(
    (product) => product.quantity <= 5 && product.quantity >= 1
  ).length;
  const outOfStockCount = allProducts.filter(
    (product) => product.quantity === 0
  ).length;

  const inStockPercentage =
    totalProducts > 0 ? Math.round((inStockCount / totalProducts) * 100) : 0;
  const lowStockPercentage =
    totalProducts > 0 ? Math.round((lowStockCount / totalProducts) * 100) : 0;
  const outOfStockPercentage =
    totalProducts > 0 ? Math.round((outOfStockCount / totalProducts) * 100) : 0;

  const now = new Date();
  const weeklyProductsData = [];

  for (let i = 11; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - i * 7);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekStart.setHours(23, 59, 59, 999);

    const weekLabel = `${String(weekStart.getMonth() + 1).padStart(
      2,
      '0'
    )}/${weekStart.getDate()} - ${String(weekEnd.getMonth() + 1).padStart(
      2,
      '0'
    )}/${weekEnd.getDate()}`;

    const weekProducts = allProducts.filter((product) => {
      const productDate = new Date(product.createdAt);
      return productDate >= weekStart && productDate <= weekEnd;
    });

    weeklyProductsData.push({ week: weekLabel, products: weekProducts.length });
  }

  const recentProducts = await prisma.product.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  const metrics = [
    {
      title: 'Total Products',
      value: totalProducts,
      change: totalProducts,
      icon: TrendingUp,
    },
    {
      title: 'Total Value',
      value: `$${totalValue.toFixed(2)}`,
      change: totalValue,
      icon: TrendingUp,
    },
    {
      title: 'Low Stock',
      value: lowStockProducts,
      change: lowStockProducts,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar currentPath="/dashboard" />
      <main className="ml-64 p-8">
        {/* header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Dashboard
              </h1>
              <p className="text-sm text-gray-500">
                Welcome back! Here is an overview of your dashboard
              </p>
            </div>
          </div>
        </div>

        {/* key metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="rounded-lg bg-white border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Key Metrics
            </h2>
            <div className="grid grid-cols-3 gap-6">
              {metrics.map((metric) => (
                <div key={metric.title} className="text-center">
                  <div className="text-3xl font-bold text-gray-900">
                    {metric.value}
                  </div>
                  <div className="text-sm text-gray-600">{metric.title}</div>
                  <div className="flex items-center justify-center mt-1">
                    <span className="text-xs text-green-600">
                      +{metric.change}
                    </span>
                    <TrendingUp className="w-3 h-3 text-green-600 ml-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                New Products per week
              </h2>
            </div>
            <div className="h-48">
              <ProductChart data={weeklyProductsData} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Stock Levels
              </h2>
            </div>
            <div className="space-y-3">
              {recentProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <h3 className="text-md font-medium text-gray-900">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Quantity: {product.quantity}
                    </p>
                  </div>
                  <div
                    className={`text-sm font-semibold ${
                      product.quantity <= 5 ? 'text-red-600' : 'text-green-600'
                    }`}
                  >
                    {product.quantity <= 5 ? 'Low Stock' : 'In Stock'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Efficiency
              </h2>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 rounded-full border-8 border-gray-200" />
                <div
                  className="absolute inset-0 rounded-full border-8 border-purple-600"
                  style={{
                    clipPath:
                      'polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 50%)',
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {inStockPercentage}%
                    </div>
                    <div className="text-sm text-gray-600">In Stock</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-purple-200" />
                  <span>In Stock ({inStockPercentage}%)</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-purple-600" />
                  <span>Low Stock ({lowStockPercentage}%)</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-gray-200" />
                  <span>Out of Stock ({outOfStockPercentage}%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
