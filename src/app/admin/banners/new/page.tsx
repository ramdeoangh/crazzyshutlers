"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useForm } from "react-hook-form";

interface BannerFormData {
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  type: "hero" | "tournament" | "page-header" | "feature-card";
  page: string;
  isActive: boolean;
  order: number;
}

export default function NewBannerPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<BannerFormData>({
    defaultValues: {
      isActive: true,
      order: 0,
      type: "hero",
    },
  });

  const imageUrl = watch("imageUrl");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    router.push("/admin/login");
    return null;
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const token = localStorage.getItem("admin_token");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setValue("imageUrl", data.url);
      } else {
        alert(data.error || "Failed to upload image");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: BannerFormData) => {
    setSubmitting(true);
    const token = localStorage.getItem("admin_token");

    try {
      const response = await fetch("/api/banners", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...data,
          page: data.page || null,
        }),
      });

      if (response.ok) {
        router.push("/admin/banners");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to create banner");
        setSubmitting(false);
      }
    } catch (error) {
      console.error("Failed to create banner:", error);
      alert("Failed to create banner");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Upload New Banner</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4">
          <button
            onClick={() => router.back()}
            className="text-primary-600 hover:text-primary-700"
          >
            ← Back
          </button>
        </div>

        <Card variant="elevated">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image *
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              {uploading && (
                <p className="text-sm text-gray-500 mt-1">Uploading...</p>
              )}
              {imageUrl && (
                <div className="mt-4">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="max-w-full h-48 object-cover rounded-lg border border-gray-200"
                  />
                </div>
              )}
              <input
                type="hidden"
                {...register("imageUrl", { required: "Image is required" })}
              />
              {errors.imageUrl && (
                <p className="text-red-600 text-sm mt-1">{errors.imageUrl.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                {...register("title", { required: "Title is required" })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              {errors.title && (
                <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                {...register("description")}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image Alt Text
              </label>
              <input
                {...register("imageAlt")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type *
                </label>
                <select
                  {...register("type", { required: "Type is required" })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="hero">Hero</option>
                  <option value="tournament">Tournament</option>
                  <option value="page-header">Page Header</option>
                  <option value="feature-card">Feature Card</option>
                </select>
                {errors.type && (
                  <p className="text-red-600 text-sm mt-1">{errors.type.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page (optional)
                </label>
                <input
                  {...register("page")}
                  placeholder="home, tournament, about"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order
              </label>
              <input
                type="number"
                {...register("order", { valueAsNumber: true })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register("isActive")}
                  className="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Active</span>
              </label>
            </div>

            <div className="flex space-x-4">
              <Button
                type="submit"
                variant="primary"
                disabled={submitting || uploading}
                className="flex-1"
              >
                {submitting ? "Creating..." : "Create Banner"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

