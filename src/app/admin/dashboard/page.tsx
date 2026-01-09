"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function AdminDashboard() {
  const router = useRouter();
  const { admin, loading, logout, isAuthenticated } = useAuth();
  const [stats, setStats] = useState({
    events: 0,
    activeEvents: 0,
    banners: 0,
    activeBanners: 0,
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/admin/login");
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetch("/api/events")
        .then((res) => res.json())
        .then((events) => {
          setStats((prev) => ({
            ...prev,
            events: events.length,
            activeEvents: events.filter((e: any) => e.isActive).length,
          }));
        });

      fetch("/api/banners")
        .then((res) => res.json())
        .then((banners) => {
          setStats((prev) => ({
            ...prev,
            banners: banners.length,
            activeBanners: banners.filter((b: any) => b.isActive).length,
          }));
        });
    }
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {admin?.name}</span>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card variant="elevated">
            <div className="text-sm text-gray-600 mb-1">Total Events</div>
            <div className="text-3xl font-bold text-gray-900">{stats.events}</div>
            <div className="text-sm text-gray-500 mt-1">
              {stats.activeEvents} active
            </div>
          </Card>
          <Card variant="elevated">
            <div className="text-sm text-gray-600 mb-1">Total Banners</div>
            <div className="text-3xl font-bold text-gray-900">{stats.banners}</div>
            <div className="text-sm text-gray-500 mt-1">
              {stats.activeBanners} active
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card variant="elevated">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Events</h2>
            <p className="text-gray-600 mb-4">
              Manage tournaments and events. Create, edit, or delete events.
            </p>
            <Link href="/admin/events">
              <Button variant="primary" className="w-full">
                Manage Events
              </Button>
            </Link>
          </Card>

          <Card variant="elevated">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Banners</h2>
            <p className="text-gray-600 mb-4">
              Manage banner images for different pages and sections.
            </p>
            <Link href="/admin/banners">
              <Button variant="primary" className="w-full">
                Manage Banners
              </Button>
            </Link>
          </Card>

          <Card variant="elevated">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Users</h2>
            <p className="text-gray-600 mb-4">
              Manage user accounts, roles, and permissions.
            </p>
            <Link href="/admin/users">
              <Button variant="primary" className="w-full">
                Manage Users
              </Button>
            </Link>
          </Card>

          <Card variant="elevated">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Settings</h2>
            <p className="text-gray-600 mb-4">
              Configure website settings, email, and other options.
            </p>
            <Link href="/admin/settings">
              <Button variant="primary" className="w-full">
                Manage Settings
              </Button>
            </Link>
          </Card>

          <Card variant="elevated">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Logs</h2>
            <p className="text-gray-600 mb-4">
              View application logs and activity history.
            </p>
            <Link href="/admin/logs">
              <Button variant="primary" className="w-full">
                View Logs
              </Button>
            </Link>
          </Card>
        </div>

        {/* API Documentation */}
        <Card variant="elevated">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">API Documentation</h2>
          <p className="text-gray-600 mb-4">
            View interactive API documentation with Swagger UI.
          </p>
          <Link href="/api-docs">
            <Button variant="outline">View API Docs</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}

