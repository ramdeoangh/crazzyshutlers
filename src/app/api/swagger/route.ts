import { NextResponse } from "next/server";
import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Crazzy Shuttlers Badminton API",
      version: "1.0.0",
      description: "API documentation for Crazzy Shuttlers Badminton Federation Pune",
    },
    servers: [
      {
        url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    "./src/app/api/**/*.ts", // Path to the API files
  ],
};

export async function GET() {
  const swaggerSpec = swaggerJsdoc(options);
  return NextResponse.json(swaggerSpec);
}

