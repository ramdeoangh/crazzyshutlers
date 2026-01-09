import type { Metadata } from "next";
import { appConfig } from "@/config/app";

export const metadata: Metadata = {
  title: "Register",
  description: `Register for the ${appConfig.tournament.name} on ${appConfig.tournament.dates.display}. Fill out the registration form to secure your spot.`,
  openGraph: {
    title: `Register | ${appConfig.tournament.name}`,
    description: `Register now for the badminton tournament on ${appConfig.tournament.dates.display}`,
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

