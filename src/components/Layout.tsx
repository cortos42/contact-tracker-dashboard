
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, FileText, Settings, Clipboard, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import Logo from './Logo';

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { name: 'Tableau de bord', href: '/', icon: Home },
  { name: 'Contacts', href: '/contacts', icon: Users },
  { name: 'Propositions', href: '/propositions', icon: FileText },
  { name: 'Documents', href: '/documents', icon: Clipboard },
  { name: 'Paramètres', href: '/settings', icon: Settings },
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar pour desktop */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50 bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <Logo />
        </div>
        <nav className="flex-1 pt-4 px-2 pb-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                location.pathname === item.href
                  ? 'bg-fhhabitat text-white'
                  : 'text-gray-600 hover:bg-gray-100',
                'group flex items-center px-3 py-2 text-sm font-medium rounded-md'
              )}
            >
              <item.icon
                className={cn(
                  location.pathname === item.href
                    ? 'text-white'
                    : 'text-gray-400 group-hover:text-gray-500',
                  'mr-3 flex-shrink-0 h-5 w-5'
                )}
              />
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button
            type="button"
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100"
          >
            <LogOut className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Header pour mobile */}
      <header className="md:hidden bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between h-16 px-4">
          <Logo />
          <div className="flex space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  location.pathname === item.href
                    ? 'bg-fhhabitat text-white'
                    : 'text-gray-500 hover:bg-gray-100',
                  'p-2 rounded-md'
                )}
                title={item.name}
              >
                <item.icon className="h-5 w-5" />
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8">{children}</main>
    </div>
  );
};

export default Layout;
