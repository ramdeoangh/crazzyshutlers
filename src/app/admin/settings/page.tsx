"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface Setting {
  id: string;
  key: string;
  category: string;
  value: any;
  valueType: string;
  description: string | null;
  isPublic: boolean;
  metadata: any;
}

export default function SettingsPage() {
  const router = useRouter();
  const { admin, loading: authLoading, isAuthenticated } = useAuth();
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<any>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/admin/login");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSettings();
    }
  }, [isAuthenticated]);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch("/api/settings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (setting: Setting) => {
    setEditingKey(setting.key);
    setEditValue(
      setting.valueType === "json"
        ? JSON.stringify(setting.value, null, 2)
        : setting.value
    );
  };

  const handleSave = async (key: string) => {
    try {
      let value = editValue;
      if (settings.find((s) => s.key === key)?.valueType === "json") {
        value = JSON.parse(editValue);
      }

      const token = localStorage.getItem("admin_token");
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          key,
          value,
        }),
      });

      if (response.ok) {
        await fetchSettings();
        setEditingKey(null);
        setEditValue("");
      }
    } catch (error) {
      console.error("Error saving setting:", error);
      alert("Failed to save setting");
    }
  };

  const handleDelete = async (key: string) => {
    if (!confirm(`Are you sure you want to delete setting "${key}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch(`/api/settings/${key}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await fetchSettings();
      }
    } catch (error) {
      console.error("Error deleting setting:", error);
      alert("Failed to delete setting");
    }
  };

  const categories = Array.from(
    new Set(settings.map((s) => s.category))
  ).sort();

  const filteredSettings =
    selectedCategory === "all"
      ? settings
      : settings.filter((s) => s.category === selectedCategory);

  if (authLoading || loading) {
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
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/admin/dashboard")}
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter */}
        <Card variant="elevated" className="mb-6">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">
              Category:
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </Card>

        {/* Settings List */}
        <div className="space-y-4">
          {filteredSettings.map((setting) => (
            <Card key={setting.id} variant="elevated">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {setting.key}
                    </h3>
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                      {setting.category}
                    </span>
                    {setting.isPublic && (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Public
                      </span>
                    )}
                  </div>
                  {setting.description && (
                    <p className="text-sm text-gray-600 mb-2">
                      {setting.description}
                    </p>
                  )}
                  {editingKey === setting.key ? (
                    <div className="space-y-2">
                      {setting.valueType === "json" ? (
                        <textarea
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          rows={6}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                        />
                      ) : (
                        <input
                          type={
                            setting.valueType === "number"
                              ? "number"
                              : setting.valueType === "boolean"
                              ? "checkbox"
                              : "text"
                          }
                          checked={
                            setting.valueType === "boolean"
                              ? editValue === true || editValue === "true"
                              : undefined
                          }
                          value={
                            setting.valueType === "boolean" ? undefined : editValue
                          }
                          onChange={(e) =>
                            setEditValue(
                              setting.valueType === "boolean"
                                ? e.target.checked
                                : setting.valueType === "number"
                                ? Number(e.target.value)
                                : e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      )}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleSave(setting.key)}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingKey(null);
                            setEditValue("");
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2">
                      <p className="text-sm text-gray-900 font-mono bg-gray-50 p-2 rounded">
                        {setting.valueType === "json"
                          ? JSON.stringify(setting.value, null, 2)
                          : String(setting.value)}
                      </p>
                    </div>
                  )}
                </div>
                {editingKey !== setting.key && (
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(setting)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(setting.key)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

