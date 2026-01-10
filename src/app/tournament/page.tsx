import type { Metadata } from "next";
import TournamentDetails from "@/features/tournament/TournamentDetails";
import Button from "@/components/ui/Button";
import BannerImage from "@/components/common/BannerImage";
import BannerCarousel from "@/components/common/BannerCarousel";
import { appConfig } from "@/config/app";
import { ROUTES } from "@/utils/constants";
import { prisma } from "@/lib/prisma";
import { getDefaultBanner, getAllDefaultBanners } from "@/utils/banners";

export const metadata: Metadata = {
  title: "Tournament",
  description: `Details about upcoming tournaments. View categories, schedule, and match format.`,
  openGraph: {
    title: `Tournament Details | ${appConfig.name}`,
    description: `Join us for an exciting badminton tournament`,
  },
};

export default async function TournamentPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  // Fetch event and tournament banners directly from database
  let featuredEvent: any = null;
  let tournamentBanner: { banners: string[] } = { banners: [] };

  try {
    // If id is provided, fetch that specific event, otherwise get featured event
    if (searchParams?.id) {
      const event = await prisma.event.findUnique({
        where: { id: searchParams.id },
        select: {
          id: true,
          title: true,
          description: true,
          startDate: true,
          endDate: true,
          registrationUrl: true,
          registrationStart: true,
          registrationEnd: true,
          isActive: true,
          isFeatured: true,
          categories: true,
          matchFormat: true,
          schedule: true,
          city: true,
          state: true,
          venue: true,
          registrationFee: true,
          currentParticipants: true,
          maxParticipants: true,
        },
      });

      if (event) {
        featuredEvent = {
          ...event,
          startDate: event.startDate.toISOString(),
          endDate: event.endDate.toISOString(),
          registrationStart: event.registrationStart?.toISOString() || null,
          registrationEnd: event.registrationEnd?.toISOString() || null,
        };
      }
    } else {
      // Fetch featured event
      const featuredEvents = await prisma.event.findMany({
        where: {
          isFeatured: true,
          isActive: true,
        },
        orderBy: { startDate: "asc" },
        take: 1,
        select: {
          id: true,
          title: true,
          description: true,
          startDate: true,
          endDate: true,
          registrationUrl: true,
          registrationStart: true,
          registrationEnd: true,
          isActive: true,
          isFeatured: true,
          categories: true,
          matchFormat: true,
          schedule: true,
          city: true,
          state: true,
          venue: true,
          registrationFee: true,
          currentParticipants: true,
          maxParticipants: true,
        },
      });

      if (featuredEvents.length > 0) {
        featuredEvent = {
          ...featuredEvents[0],
          startDate: featuredEvents[0].startDate.toISOString(),
          endDate: featuredEvents[0].endDate.toISOString(),
          registrationStart: featuredEvents[0].registrationStart?.toISOString() || null,
          registrationEnd: featuredEvents[0].registrationEnd?.toISOString() || null,
        };
      }
    }

    // Fetch all tournament banners from database
    const dbBanners = await prisma.banner.findMany({
      where: {
        type: "tournament",
        page: "tournament",
        isActive: true,
      },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      select: {
        imageUrl: true,
      },
    });

    // Get default banners
    const defaultBanners = getAllDefaultBanners();
    
    // Combine database banners with default banners
    // Database banners first, then default banners
    const dbBannerUrls = dbBanners.map(b => b.imageUrl);
    const allBannerUrls = [...dbBannerUrls, ...defaultBanners];
    
    // Remove duplicates while preserving order
    const uniqueBanners = Array.from(new Set(allBannerUrls));
    
    tournamentBanner = {
      banners: uniqueBanners.length > 0 ? uniqueBanners : defaultBanners,
    };
  } catch (error) {
    console.error("Error fetching tournament page data:", error);
    // Fallback to default banners on error
    tournamentBanner = {
      banners: getAllDefaultBanners(),
    };
  }

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
        {/* Banner Carousel - Show all banners */}
        <div className="mb-12">
          <BannerCarousel 
            banners={tournamentBanner.banners.length > 0 ? tournamentBanner.banners : getAllDefaultBanners()} 
            height="h-48 md:h-64" 
          />
        </div>

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

