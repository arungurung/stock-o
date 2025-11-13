import { UserButton } from '@stackframe/stack';
import { BarChart3, Package, Plus, Settings } from 'lucide-react';
import Link from 'next/link';

const Sidebar = ({ currentPath = '/dashboard' }: { currentPath: string }) => {
  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Inventory', href: '/inventory', icon: Package },
    { name: 'Add Product', href: '/add-product', icon: Plus },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 min-h-screen p-6 z-10 bg-gray-200 dark:bg-gray-900">
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <BarChart3 className="w-7 h-7" />
        </div>
        <span className="text-lg font-semibold">Inventory Management</span>
      </div>

      <nav className="space-y-1">
        <div className="text-sm uppercase text-gray-400 font-semibold">
          Inventory
        </div>
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.href;

          return (
            <Link
              href={item.href}
              key={item.name}
              className={`flex items-center space-x-3 py-2 px-3 rounded-lg ${
                isActive
                  ? 'bg-gray-300 text-black'
                  : 'text-gray-600 hover:bg-gray-300 hover:text-black'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-300 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <UserButton showUserInfo />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
