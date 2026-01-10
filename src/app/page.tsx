import type { Metadata } from "next";
import TournamentHero from "@/features/tournament/TournamentHero";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import EventCard from "@/features/events/EventCard";
import BannerCarousel from "@/components/common/BannerCarousel";
import { appConfig } from "@/config/app";
import { ROUTES } from "@/utils/constants";
import { getFeaturedEvent, getBanner, getEvents } from "@/services/api";

export const metadata: Metadata = {
  title: "Home",
  description: `${appConfig.description} Join us for our upcoming tournament.`,
};

export default async function HomePage() {
  // Fetch featured event, hero banner, and upcoming events
  const [featuredEvent, heroBanner, upcomingEvents] = await Promise.all([
    getFeaturedEvent(),
    getBanner("hero", "home"),
    getEvents({ active: true }),
  ]);

  // Get registration status helper
  const getRegistrationStatus = (event: any): { status: "open" | "closed" | "upcoming" | "closing"; message: string } => {
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

  // Show up to 6 upcoming events (excluding featured)
  const otherEvents = upcomingEvents
    .filter((e) => e.id !== featuredEvent?.id)
    .slice(0, 6)
    .map((event) => {
      const regStatus = getRegistrationStatus(event);
      return {
        ...event,
        registrationStatus: regStatus.status,
        registrationMessage: regStatus.message,
      };
    });

  return (
    <div className="flex flex-col">
      {/* Hero Section - Featured Tournament Event */}
      <TournamentHero event={featuredEvent} banner={heroBanner} />

      {/* About Organization Section */}
      <section className="py-16 bg-gray-50" aria-labelledby="about-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              id="about-heading"
              className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
            >
              Welcome to {appConfig.name}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We are a vibrant badminton community dedicated to promoting the sport,
              organizing tournaments, and bringing players together. Join us to be part
              of an exciting badminton journey!
            </p>
          </div>

          {/* Upcoming Events Section - Before Why Join Us */}
          {otherEvents.length > 0 && (
            <div className="mb-16">
              <div className="text-center mb-12">
                <h2
                  id="events-heading"
                  className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
                >
                  Upcoming Events
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Browse and register for our upcoming tournaments and competitions
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {otherEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
              {upcomingEvents.length > 6 && (
                <div className="text-center">
                  <Button href={ROUTES.EVENTS} asLink variant="primary" size="lg">
                    View All Events ({upcomingEvents.length})
                  </Button>
                </div>
              )}
            </div>
          )}

          <h3 className="text-2xl font-semibold text-center text-gray-900 mb-8">
            Why Join Us?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card variant="elevated" className="text-center">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Competitive Play
              </h3>
              <p className="text-gray-600">
                Test your skills against players of all levels in a structured
                tournament format.
              </p>
            </Card>
            <Card variant="elevated" className="text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Community
              </h3>
              <p className="text-gray-600">
                Connect with fellow badminton enthusiasts and build lasting
                friendships.
              </p>
            </Card>
            <Card variant="elevated" className="text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Fun & Excitement
              </h3>
              <p className="text-gray-600">
                Experience the thrill of competitive badminton in a welcoming
                environment.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-16 bg-gradient-to-r from-primary-600 to-accent-600 text-white"
        aria-labelledby="cta-heading"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 id="cta-heading" className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Play?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Join our upcoming tournament and be part of the action. Register now and
            secure your spot!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              href={appConfig.tournament.registrationFormUrl}
              asLink
              size="lg"
              variant="secondary"
              className="bg-white text-primary-600 hover:bg-gray-100"
            >
              Register Now
            </Button>
            <Button
              href={ROUTES.TOURNAMENT}
              asLink
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

