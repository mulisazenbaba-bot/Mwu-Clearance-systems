'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authService } from '@/services/auth';
import { User } from '@/types';

export default function Breadcrumb() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedUser = authService.getStoredUser();
    setUser(storedUser);
  }, []);

  // Don't render anything during SSR or if no user
  if (!isClient || !user || pathname === '/login') {
    return null;
  }

  const generateBreadcrumbs = () => {
    const pathSegments = pathname.split('/').filter(segment => segment !== '');
    const breadcrumbs = [];

    // Add home/dashboard
    const dashboardPath = getDashboardPath(user.role);
    breadcrumbs.push({
      name: 'Dashboard',
      href: dashboardPath,
      current: pathname === dashboardPath
    });

    // Generate breadcrumbs based on path
    let currentPath = '';
    for (let i = 0; i < pathSegments.length; i++) {
      currentPath += `/${pathSegments[i]}`;
      
      // Skip if it's the dashboard path we already added
      if (currentPath === dashboardPath) continue;

      const isLast = i === pathSegments.length - 1;
      const segment = pathSegments[i];
      
      breadcrumbs.push({
        name: getBreadcrumbName(segment, pathSegments, i),
        href: currentPath,
        current: isLast
      });
    }

    return breadcrumbs;
  };

  const getDashboardPath = (role: string) => {
    switch (role) {
      case 'student': return '/student/dashboard';
      case 'admin': return '/admin/dashboard';
      case 'library_officer':
      case 'dormitory_officer':
      case 'department_officer': return '/officer/dashboard';
      default: return '/';
    }
  };

  const getBreadcrumbName = (segment: string, pathSegments: string[], index: number) => {
    // Handle dynamic routes and specific segments
    if (segment === 'student') return 'Student';
    if (segment === 'admin') return 'Admin';
    if (segment === 'officer') return 'Officer';
    if (segment === 'dashboard') return 'Dashboard';
    if (segment === 'requests') return 'Requests';
    if (segment === 'users') return 'Users';
    if (segment === 'books') return 'Books';
    if (segment === 'properties') return 'Properties';
    if (segment === 'academic') return 'Academic Records';
    if (segment === 'verifications') return 'Verifications';
    if (segment === 'check-student') return 'Check Student';
    if (segment === 'reports') return 'Reports';
    if (segment === 'new') return 'New Request';
    
    // Handle dynamic IDs
    if (!isNaN(Number(segment))) {
      const prevSegment = pathSegments[index - 1];
      if (prevSegment === 'requests') return `Request #${segment}`;
      if (prevSegment === 'users') return `User #${segment}`;
      return `#${segment}`;
    }

    // Capitalize first letter for other segments
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="bg-gray-50 border-b border-gray-200" aria-label="Breadcrumb">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-4 py-3">
          <ol className="flex items-center space-x-4">
            {breadcrumbs.map((breadcrumb, index) => (
              <li key={breadcrumb.href}>
                <div className="flex items-center">
                  {index > 0 && (
                    <svg
                      className="flex-shrink-0 h-4 w-4 text-gray-400 mr-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {breadcrumb.current ? (
                    <span className="text-sm font-medium text-gray-900">
                      {breadcrumb.name}
                    </span>
                  ) : (
                    <button
                      onClick={() => router.push(breadcrumb.href)}
                      className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    >
                      {breadcrumb.name}
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </nav>
  );
}