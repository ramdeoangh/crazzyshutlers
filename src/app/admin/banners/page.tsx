"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface Banner {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  imageAlt: string | null;
  type: string;
  page: string | null;
  isActive: boolean;
  order: number;
}

export default function AdminBannersPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loadingBanners, setLoadingBanners] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/admin/login");
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBanners();
    }
  }, [isAuthenticated]);

  const fetchBanners = async () => {
    try {
      const response = await fetch("/api/banners");
      const data = await response.json();
      setBanners(data);
    } catch (error) {
      console.error("Failed to fetch banners:", error);
    } finally {
      setLoadingBanners(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) {
      return;
    }

    const token = localStorage.getItem("admin_token");
    try {
      const response = await fetch(`/api/banners/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchBanners();
      } else {
        alert("Failed to delete banner");
      }
    } catch (error) {
      console.error("Failed to delete banner:", error);
      alert("Failed to delete banner");
    }
  };

  if (loading || loadingBanners) {
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
            <h1 className="text-2xl font-bold text-gray-900">Manage Banners</h1>
            <Link href="/admin/banners/new">
              <Button variant="primary">Upload New Banner</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4">
          <Link href="/admin/dashboard" className="text-primary-600 hover:text-primary-700">
            ← Back to Dashboard
          </Link>
        </div>

        {banners.length === 0 ? (
          <Card variant="elevated" className="text-center py-12">
            <p className="text-gray-600 mb-4">No banners found.</p>
            <Link href="/admin/banners/new">
              <Button variant="primary">Upload Your First Banner</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {banners.map((banner) => (
              <Card key={banner.id} variant="elevated">
                <div className="relative w-full h-48 mb-4 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={banner.imageUrl}
                    alt={banner.imageAlt || banner.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{banner.title}</h3>
                {banner.description && (
                  <p className="text-sm text-gray-600 mb-2">{banner.description}</p>
                )}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded">
                    {banner.type}
                  </span>
                  {banner.isActive ? (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
                      Inactive
                    </span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Link href={`/admin/banners/${banner.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(banner.id)}
                    className="flex-1 text-red-600 hover:text-red-700"
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

