import React from "react";
import Card from "@/components/ui/Card";
import { Event } from "@/services/api";

interface TournamentDetailsProps {
  event?: Event | null;
}

const TournamentDetails = ({ event }: TournamentDetailsProps) => {
  // Parse categories and schedule from JSON strings
  const categories = event?.categories
    ? (() => {
        try {
          return JSON.parse(event.categories);
        } catch {
          return [];
        }
      })()
    : [];

  const schedule = event?.schedule
    ? (() => {
        try {
          return JSON.parse(event.schedule);
        } catch {
          return [];
        }
      })()
    : [];

  // Format date range
  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const startMonth = startDate.toLocaleDateString("en-US", { month: "long" });
    const startDay = startDate.getDate();
    const endDay = endDate.getDate();
    const year = startDate.getFullYear();
    
    if (startDate.getMonth() === endDate.getMonth()) {
      return `${startDay}–${endDay} ${startMonth} ${year}`;
    }
    return `${startDate.toLocaleDateString()} – ${endDate.toLocaleDateString()}`;
  };

  const eventDates = event
    ? formatDateRange(event.startDate, event.endDate)
    : "TBA";
  const matchFormat = event?.matchFormat || "Best of 3 sets (21 points)";
  const description = event?.description || 
    "Join us for an exciting badminton tournament featuring competitive matches across multiple categories. This event brings together players of all skill levels to celebrate the sport of badminton.";

  return (
    <div className="space-y-8">
      {/* Tournament Overview */}
      <Card variant="elevated">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Tournament Overview
        </h2>
        <p className="text-gray-700 mb-4">{description}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Event Dates</h3>
            <p className="text-gray-600">{eventDates}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Match Format</h3>
            <p className="text-gray-600">{matchFormat}</p>
          </div>
        </div>
      </Card>

      {/* Categories */}
      {categories.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Tournament Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category: string | { name: string; description: string }, index: number) => {
              const categoryName = typeof category === "string" ? category : category.name;
              const categoryDesc =
                typeof category === "string"
                  ? "Competitive tournament category"
                  : category.description;

              return (
                <Card
                  key={index}
                  variant="outlined"
                  className="hover:shadow-md transition-shadow"
                >
                  <h3 className="text-xl font-semibold text-primary-700 mb-2">
                    {categoryName}
                  </h3>
                  <p className="text-gray-600">{categoryDesc}</p>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Schedule Section */}
      {schedule.length > 0 && (
        <Card variant="elevated">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Schedule</h2>
          <div className="space-y-4">
            {schedule.map(
              (
                item: {
                  day: string;
                  description: string;
                  time: string;
                },
                index: number
              ) => (
                <div
                  key={index}
                  className={`border-l-4 pl-4 ${
                    index % 2 === 0
                      ? "border-primary-600"
                      : "border-accent-600"
                  }`}
                >
                  <h3 className="font-semibold text-gray-900">{item.day}</h3>
                  <p className="text-gray-600 mt-1">{item.description}</p>
                  {item.time && (
                    <p className="text-sm text-gray-500 mt-2">{item.time}</p>
                  )}
                </div>
              )
            )}
          </div>
        </Card>
      )}

      {categories.length === 0 && schedule.length === 0 && (
        <Card variant="elevated">
          <p className="text-gray-600 text-center py-8">
            Tournament details will be updated soon. Please check back later.
          </p>
        </Card>
      )}
    </div>
  );
};

export default TournamentDetails;
