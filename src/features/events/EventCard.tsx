import React from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Event } from "@/services/api";

interface EventCardProps {
  event: Event & {
    registrationStatus?: "open" | "closed" | "upcoming" | "closing";
    registrationMessage?: string;
    city?: string | null;
    state?: string | null;
    venue?: string | null;
    registrationFee?: number | null;
    currentParticipants?: number;
    maxParticipants?: number | null;
  };
}

const EventCard = ({ event }: EventCardProps) => {
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const startMonth = startDate.toLocaleDateString("en-US", { month: "short" });
    const startDay = startDate.getDate();
    const endDay = endDate.getDate();
    const year = startDate.getFullYear();

    if (startDate.getMonth() === endDate.getMonth()) {
      return `${startDay}–${endDay} ${startMonth} ${year}`;
    }
    return `${formatDate(start)} – ${formatDate(end)}`;
  };

  const location = event.city
    ? `${event.city}${event.state ? `, ${event.state}` : ""}`
    : "Location TBA";

  const registrationFee = event.registrationFee
    ? `₹${Number(event.registrationFee)}`
    : "FREE";

  const participantsInfo =
    event.maxParticipants && event.currentParticipants !== undefined
      ? `${event.currentParticipants}/${event.maxParticipants}`
      : event.currentParticipants
      ? `${event.currentParticipants}`
      : null;

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "closed":
        return "bg-red-100 text-red-800";
      case "closing":
        return "bg-yellow-100 text-yellow-800";
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  return (
    <Card variant="elevated" className="hover:shadow-xl transition-shadow duration-300">
      <div className="flex flex-col h-full">
        {/* Location Badge */}
        <div className="mb-3">
          <span className="inline-block px-3 py-1 bg-primary-100 text-primary-800 text-xs font-semibold rounded-full uppercase">
            {location}
          </span>
        </div>

        {/* Event Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {event.title}
        </h3>

        {/* Date */}
        <div className="mb-3">
          <p className="text-sm font-medium text-gray-700">
            {formatDateRange(event.startDate, event.endDate)}
          </p>
        </div>

        {/* Description */}
        {event.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
            {event.description}
          </p>
        )}

        {/* Price and Participants */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
          <div className="text-2xl font-bold text-primary-600">
            {registrationFee}
          </div>
          {participantsInfo && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">Entries:</span> {participantsInfo}
            </div>
          )}
        </div>

        {/* Registration Status */}
        {event.registrationStatus && event.registrationMessage && (
          <div className="mb-4">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                event.registrationStatus
              )}`}
            >
              {event.registrationMessage}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          {event.registrationStatus === "closed" ? (
            <Button
              href={`/tournament?id=${event.id}`}
              asLink
              variant="outline"
              className="flex-1"
            >
              Details
            </Button>
          ) : event.registrationUrl && !event.registrationUrl.includes("YOUR_FORM_ID") ? (
            <a
              href={event.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 shadow-md hover:shadow-lg cursor-pointer"
            >
              Register
            </a>
          ) : (
            <Button
              href="/login?tab=register"
              asLink
              variant="primary"
              className="flex-1"
            >
              Register
            </Button>
          )}
          <Button
            href={`/tournament?id=${event.id}`}
            asLink
            variant="outline"
            className="px-4"
          >
            Details
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default EventCard;

