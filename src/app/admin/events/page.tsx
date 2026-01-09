"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface Event {
  id: string;
  title: string;
  description: string | null;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isFeatured: boolean;
}

export default function AdminEventsPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/admin/login");
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchEvents();
    }
  }, [isAuthenticated]);

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events");
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoadingEvents(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) {
      return;
    }

    const token = localStorage.getItem("admin_token");
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchEvents();
      } else {
        alert("Failed to delete event");
      }
    } catch (error) {
      console.error("Failed to delete event:", error);
      alert("Failed to delete event");
    }
  };

  if (loading || loadingEvents) {
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
            <h1 className="text-2xl font-bold text-gray-900">Manage Events</h1>
            <Link href="/admin/events/new">
              <Button variant="primary">Create New Event</Button>
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

        {events.length === 0 ? (
          <Card variant="elevated" className="text-center py-12">
            <p className="text-gray-600 mb-4">No events found.</p>
            <Link href="/admin/events/new">
              <Button variant="primary">Create Your First Event</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <Card key={event.id} variant="elevated">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {event.title}
                      </h3>
                      {event.isFeatured && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">
                          Featured
                        </span>
                      )}
                      {event.isActive ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded">
                          Inactive
                        </span>
                      )}
                    </div>
                    {event.description && (
                      <p className="text-gray-600 mb-2">{event.description}</p>
                    )}
                    <div className="text-sm text-gray-500">
                      {new Date(event.startDate).toLocaleDateString()} -{" "}
                      {new Date(event.endDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Link href={`/admin/events/${event.id}`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(event.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

