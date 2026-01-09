import React from "react";
import Button from "@/components/ui/Button";
import { ROUTES } from "@/utils/constants";
import { getFeaturedEvent, getBanner } from "@/services/api";
import BannerImage from "@/components/common/BannerImage";
import { appConfig } from "@/config/app";

interface TournamentHeroProps {
  event?: {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    registrationUrl: string | null;
  } | null;
  banner?: {
    imageUrl: string;
    imageAlt: string | null;
  } | null;
}

const TournamentHero = async ({ event, banner }: TournamentHeroProps) => {
  // Format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

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
    return `${formatDate(start)} – ${formatDate(end)}`;
  };

  const eventTitle = event?.title || appConfig.tournament.name;
  const eventDates = event
    ? formatDateRange(event.startDate, event.endDate)
    : appConfig.tournament.dates.display;
  // Use event registration URL if valid, otherwise fall back to config
  const eventRegistrationUrl = event?.registrationUrl && !event.registrationUrl.includes("YOUR_FORM_ID") 
    ? event.registrationUrl 
    : null;
  const registrationUrl = eventRegistrationUrl || appConfig.tournament.registrationFormUrl || ROUTES.REGISTER;

  return (
    <section
      className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 text-white py-12 sm:py-16 lg:py-20 overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Background Banner Image (if available) */}
      {banner && (
        <div className="absolute inset-0 opacity-20">
          <BannerImage
            src={banner.imageUrl}
            alt={banner.imageAlt || "Tournament banner"}
            fill
            priority
            objectFit="cover"
          />
        </div>
      )}
      
      {/* Fallback gradient if no banner */}
      {!banner && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600"></div>
      )}

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-6 inline-block">
            <span className="text-6xl sm:text-7xl" role="img" aria-label="Badminton">
              🏸
            </span>
          </div>
          
          <h1
            id="hero-heading"
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance"
          >
            {eventTitle}
          </h1>
          
          <div className="mb-8">
            <p className="text-xl sm:text-2xl md:text-3xl font-semibold mb-2">
              {eventDates}
            </p>
            <p className="text-lg sm:text-xl text-primary-100">
              Join us for an exciting badminton tournament
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {registrationUrl.startsWith("http") ? (
              <a
                href={registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 px-8 py-4 text-lg bg-accent-600 text-white hover:bg-accent-700 shadow-md hover:shadow-lg w-full sm:w-auto min-w-[200px] cursor-pointer"
              >
                Register Now
              </a>
            ) : (
              <Button
                href={ROUTES.REGISTER}
                asLink
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto min-w-[200px]"
              >
                Register Now
              </Button>
            )}
            <Button
              href={ROUTES.TOURNAMENT}
              asLink
              size="lg"
              variant="outline"
              className="w-full sm:w-auto min-w-[200px] bg-white/10 border-white text-white hover:bg-white/20"
            >
              View Tournament
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TournamentHero;
