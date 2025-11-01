/**
 * Quick Actions Component
 * Navigation cards to favorites and bookings pages
 */

"use client";

import Link from 'next/link';

interface QuickActionsProps {
  favoritesCount?: number;
  bookingsCount?: number;
}

export function QuickActions({ favoritesCount = 0, bookingsCount = 0 }: QuickActionsProps) {
  const actions = [
    {
      title: 'My Favorites',
      description: 'View and manage your favorite cars',
      href: '/favorites',
      count: favoritesCount,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      hoverColor: 'hover:bg-red-100',
    },
    {
      title: 'My Bookings',
      description: 'Manage your car rental bookings',
      href: '/bookings',
      count: bookingsCount,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
      borderColor: 'border-primary-200',
      hoverColor: 'hover:bg-primary-100',
    },
    {
      title: 'Browse Cars',
      description: 'Discover new cars to rent',
      href: '/',
      count: null,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      hoverColor: 'hover:bg-green-100',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className={`group p-6 rounded-xl border ${action.borderColor} ${action.bgColor} ${action.hoverColor} transition-all duration-200 hover:shadow-md hover:scale-105`}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className={`p-3 rounded-full ${action.bgColor} ${action.color} group-hover:scale-110 transition-transform duration-200`}>
                {action.icon}
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600 group-hover:text-gray-500">
                  {action.description}
                </p>
                {action.count !== null && (
                  <div className="flex items-center justify-center space-x-1">
                    <span className={`text-2xl font-bold ${action.color}`}>
                      {action.count}
                    </span>
                    <span className="text-sm text-gray-500">
                      {action.count === 1 ? 'item' : 'items'}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center text-sm font-medium text-gray-500 group-hover:text-gray-700">
                <span>View Details</span>
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
