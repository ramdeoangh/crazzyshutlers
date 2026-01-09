import type { Metadata } from "next";
import Card from "@/components/ui/Card";
import { appConfig } from "@/config/app";

export const metadata: Metadata = {
  title: "About",
  description: `Learn about ${appConfig.name} and our mission to build a vibrant badminton community.`,
};

export default function AboutPage() {
  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            About Us
          </h1>
          <p className="text-xl text-gray-600">
            {appConfig.name}
          </p>
          <p className="text-lg text-gray-500 mt-2">
            Building a vibrant badminton community in Pune
          </p>
        </div>

        {/* About Content */}
        <div className="space-y-8">
          <Card variant="elevated">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-700 mb-4">
              {appConfig.name} is a registered badminton federation dedicated to
              promoting the sport of badminton and fostering a strong, inclusive
              community of players in Pune and beyond. We believe that badminton
              is more than just a sport—it's a way to bring people together,
              build friendships, and stay active.
            </p>
            <p className="text-gray-700">
              We organize regular tournaments, training sessions, and community
              events that provide a platform for players of all skill levels to
              compete, learn, and grow. Whether you're a seasoned player or just
              starting out, you'll find a welcoming environment where you can
              challenge yourself and have fun.
            </p>
          </Card>

          <Card variant="elevated">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Our Vision
            </h2>
            <p className="text-gray-700 mb-4">
              We envision a future where badminton is accessible to everyone,
              where communities come together through the love of the game, and
              where players can continuously improve and achieve their goals.
            </p>
            <p className="text-gray-700">
              Through organized tournaments, community events, and ongoing
              support, we aim to create lasting connections and inspire the next
              generation of badminton players.
            </p>
          </Card>

          <Card variant="elevated">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              What We Offer
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">✓</span>
                <span>
                  <strong>Organized Tournaments:</strong> Regular tournaments
                  with multiple categories and skill levels
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">✓</span>
                <span>
                  <strong>Community Building:</strong> Connect with fellow
                  players and build lasting friendships
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">✓</span>
                <span>
                  <strong>Skill Development:</strong> Opportunities to improve
                  your game through competitive play
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">✓</span>
                <span>
                  <strong>Inclusive Environment:</strong> Welcoming players of
                  all backgrounds and skill levels
                </span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

