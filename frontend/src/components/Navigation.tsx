'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from '@/services/auth';
import { User } from '@/types';

export default function Navigation() {
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const currentUser = authService.getStoredUser();
    setUser(currentUser);
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    router.push('/login');
  };

  // Don't show navigation on login page
  if (pathname === '/login' || !user) {
    return null;
  }

  const getNavigationItems = () => {
    const baseItems = [
      { name: 'Dashboard', href: getDashboardPath(), icon: '🏠' }
    ];

    if (user.role === 'student') {
      return [
        ...baseItems,
        { name: 'My Requests', href: '/student/requests', icon: '📋' },
        { name: 'New Request', href: '/student/requests/new', icon: '➕' }
      ];
    }

    if (user.role === 'admin') {
      // Admin only has dashboard for now - all features are in tabs
      return baseItems;
    }

    if (['library_officer', 'dormitory_officer', 'department_officer'].includes(user.role)) {
      // Officers only have dashboard - all features are in tabs on the dashboard
      return baseItems;
    }

    return baseItems;
  };

  const getDashboardPath = () => {
    switch (user.role) {
      case 'student': return '/student/dashboard';
      case 'admin': return '/admin/dashboard';
      case 'library_officer':
      case 'dormitory_officer':
      case 'department_officer': return '/officer/dashboard';
      default: return '/';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'student': return 'Student';
      case 'admin': return 'Administrator';
      case 'library_officer': return 'Library Officer';
      case 'dormitory_officer': return 'Dormitory Officer';
      case 'department_officer': return 'Department Officer';
      default: return role;
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">MWU</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">
                Clearance System
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <div className="flex items-center space-x-2">
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => router.push(item.href)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center ${
                    pathname === item.href || (item.href !== getDashboardPath() && pathname.startsWith(item.href))
                      ? 'bg-blue-100 text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center">
            <div className="hidden md:flex md:items-center md:space-x-4">
              <div className="text-sm text-right">
                <div className="font-medium text-gray-900">{user.name}</div>
                <div className="text-gray-500">{getRoleDisplayName(user.role)}</div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 shadow-sm"
              >
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className={`h-6 w-6 transition-transform duration-200 ${isMenuOpen ? 'rotate-90' : ''}`}
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  {isMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigationItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  router.push(item.href);
                  setIsMenuOpen(false);
                }}
                className={`flex items-center w-full text-left px-3 py-3 rounded-md text-base font-medium transition-colors duration-200 ${
                  pathname === item.href || (item.href !== getDashboardPath() && pathname.startsWith(item.href))
                    ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </button>
            ))}
            
            {/* Mobile User Info */}
            <div className="border-t border-gray-200 pt-4 pb-3 mt-4">
              <div className="px-3 mb-3">
                <div className="text-base font-medium text-gray-900">{user.name}</div>
                <div className="text-sm text-gray-500">{getRoleDisplayName(user.role)}</div>
              </div>
              <div className="px-3">
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-md text-base font-medium transition-colors duration-200"
                >
                  <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}