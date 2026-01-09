import type { Metadata } from "next";
import { getEvents } from "@/services/api";
import EventCard from "@/features/events/EventCard";
import BannerCarousel from "@/components/common/BannerCarousel";
import { appConfig } from "@/config/app";
import { getAllDefaultBanners } from "@/utils/banners";

export const metadata: Metadata = {
  title: "Events",
  description: `Browse all upcoming tournaments and events organized by ${appConfig.name}`,
};

export default async function EventsPage() {
  // Fetch all active events
  const events = await getEvents({ active: true });

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Get registration status
  const getRegistrationStatus = (event: any) => {
    if (!event.registrationStart || !event.registrationEnd) {
      return { status: "open", message: "Register Now" };
    }

    const now = new Date();
    const regStart = new Date(event.registrationStart);
    const regEnd = new Date(event.registrationEnd);

    if (now < regStart) {
      return { status: "upcoming", message: "Registration opens soon" };
    }
    if (now > regEnd) {
      return { status: "closed", message: "Registration closed" };
    }

    // Check if closing soon (within 3 days)
    const daysUntilClose = Math.ceil(
      (regEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysUntilClose <= 3) {
      return {
        status: "closing",
        message: "Registration will be closed soon",
      };
    }

    return { status: "open", message: "Register Now else pay more later" };
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header with Banner Carousel */}
      <div className="relative">
        <BannerCarousel banners={getAllDefaultBanners()} height="h-48 md:h-64" />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Sport & Fitness Events
            </h1>
            <p className="text-xl text-white/90">
              Discover and register for upcoming tournaments
            </p>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {events.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏸</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              No Events Available
            </h2>
            <p className="text-gray-600">
              Check back soon for upcoming tournaments and events.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Upcoming Events
              </h2>
              <p className="text-gray-600">
                {events.length} event{events.length !== 1 ? "s" : ""} available
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => {
                const regStatus = getRegistrationStatus(event);
                return (
                  <EventCard
                    key={event.id}
                    event={{
                      ...event,
                      registrationStatus: regStatus.status,
                      registrationMessage: regStatus.message,
                    }}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

