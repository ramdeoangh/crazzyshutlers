import type { Metadata } from "next";
import TournamentDetails from "@/features/tournament/TournamentDetails";
import Button from "@/components/ui/Button";
import BannerImage from "@/components/common/BannerImage";
import BannerCarousel from "@/components/common/BannerCarousel";
import { appConfig } from "@/config/app";
import { ROUTES } from "@/utils/constants";
import { getFeaturedEvent, getBanner } from "@/services/api";
import { getAllDefaultBanners } from "@/utils/banners";

export const metadata: Metadata = {
  title: "Tournament",
  description: `Details about upcoming tournaments. View categories, schedule, and match format.`,
  openGraph: {
    title: `Tournament Details | ${appConfig.name}`,
    description: `Join us for an exciting badminton tournament`,
  },
};

export default async function TournamentPage() {
  // Fetch featured event and tournament banner
  const [featuredEvent, tournamentBanner] = await Promise.all([
    getFeaturedEvent(),
    getBanner("tournament", "tournament"),
  ]);

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

  const eventTitle = featuredEvent?.title || appConfig.tournament.name;
  const eventDates = featuredEvent
    ? formatDateRange(featuredEvent.startDate, featuredEvent.endDate)
    : appConfig.tournament.dates.display;
  // Use event registration URL if valid, otherwise fall back to config
  const eventRegistrationUrl = featuredEvent?.registrationUrl && !featuredEvent.registrationUrl.includes("YOUR_FORM_ID") 
    ? featuredEvent.registrationUrl 
    : null;
  const registrationUrl = eventRegistrationUrl || appConfig.tournament.registrationFormUrl || ROUTES.REGISTER;

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner Image or Carousel */}
        {tournamentBanner ? (
          <div className="mb-12 relative w-full h-48 md:h-64 rounded-xl overflow-hidden">
            <BannerImage
              src={tournamentBanner.imageUrl}
              alt={tournamentBanner.imageAlt || "Tournament banner"}
              fill
              priority
              objectFit="cover"
            />
          </div>
        ) : (
          <div className="mb-12">
            <BannerCarousel banners={getAllDefaultBanners()} height="h-48 md:h-64" />
          </div>
        )}

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            {eventTitle}
          </h1>
          <p className="text-xl text-gray-600 mb-6">{eventDates}</p>
          {registrationUrl.startsWith("http") ? (
            <a
              href={registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 px-8 py-4 text-lg bg-primary-600 text-white hover:bg-primary-700 shadow-md hover:shadow-lg cursor-pointer"
            >
              Register Now
            </a>
          ) : (
            <Button
              href={ROUTES.REGISTER}
              asLink
              size="lg"
              variant="primary"
            >
              Register Now
            </Button>
          )}
        </div>

        {/* Tournament Details */}
        <TournamentDetails event={featuredEvent} />
      </div>
    </div>
  );
}

