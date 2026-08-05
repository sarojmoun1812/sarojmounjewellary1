"use client";

import { useState } from "react";
import { MapPin, Navigation, Phone, Clock } from "lucide-react";
import {
  ADDRESS_LINES,
  ADDRESS_ONE_LINE,
  BUSINESS_NAME,
  PHONE_DISPLAY,
  PHONE_NUMBER,
  STORE_HOURS,
} from "@/lib/constants";

interface GoogleMapProps {
  address?: string;
  zoom?: number;
  height?: string;
  showInfoCard?: boolean;
}

export function GoogleMap({
  address = ADDRESS_ONE_LINE,
  zoom = 15,
  height = "400px",
  showInfoCard = true,
}: GoogleMapProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // The keyless embed is used by default so the map works without anyone having
  // to set up a Google Cloud project. Setting NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  // switches to the official Embed API, which allows finer control.
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const mapUrl = apiKey
    ? `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(
        address
      )}&zoom=${zoom}`
    : `https://maps.google.com/maps?q=${encodeURIComponent(
        address
      )}&z=${zoom}&output=embed`;

  // Direct link for "Get Directions"
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    address
  )}`;

  // Direct link for opening in Google Maps
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address
  )}`;

  return (
    <div className="relative">
      {/* Map Container */}
      <div
        className="relative w-full rounded-2xl overflow-hidden shadow-lg bg-gray-100"
        style={{ height }}
      >
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-powder-50">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-powder-200 border-t-powder-600 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading map...</p>
            </div>
          </div>
        )}
        <iframe
          src={mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={() => setIsLoaded(true)}
          className={`transition-opacity duration-500 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Floating Action Buttons */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-powder-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-powder-700 transition-colors text-sm font-medium"
          >
            <Navigation className="h-4 w-4" />
            Get Directions
          </a>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            <MapPin className="h-4 w-4" />
            Open in Maps
          </a>
        </div>
      </div>

      {/* Info Card */}
      {showInfoCard && (
        <div className="mt-6 bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4">
              <div className="bg-powder-100 p-3 rounded-xl">
                <MapPin className="h-6 w-6 text-powder-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Visit Our Store</h4>
                <p className="text-gray-600 text-sm mt-1">
                  {BUSINESS_NAME}
                  <br />
                  {ADDRESS_LINES.map((line) => (
                    <span key={line}>
                      {line}
                      <br />
                    </span>
                  ))}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-powder-100 p-3 rounded-xl">
                <Phone className="h-6 w-6 text-powder-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Call Us</h4>
                <p className="text-gray-600 text-sm mt-1">
                  <a href={`tel:${PHONE_NUMBER}`} className="hover:text-powder-600">
                    {PHONE_DISPLAY}
                  </a>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-powder-100 p-3 rounded-xl">
                <Clock className="h-6 w-6 text-powder-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Store Hours</h4>
                <p className="text-gray-600 text-sm mt-1">
                  {STORE_HOURS.map(({ days, hours }) => (
                    <span key={days}>
                      {days}: {hours}
                      <br />
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
