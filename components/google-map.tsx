"use client";

import { useState } from "react";
import { MapPin, Navigation, Phone, Clock } from "lucide-react";

interface GoogleMapProps {
  address?: string;
  lat?: number;
  lng?: number;
  zoom?: number;
  height?: string;
}

export function GoogleMap({
  address = "Sarojmoun Jewellery, India",
  lat = 28.6139, // Default to Delhi
  lng = 77.209,
  zoom = 15,
  height = "400px",
}: GoogleMapProps) {
  const [isLoading, setIsLoading] = useState(true);

  // Create Google Maps embed URL
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || ""}&q=${encodeURIComponent(address)}&zoom=${zoom}`;
  
  // Fallback to OpenStreetMap if no Google Maps key
  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01}%2C${lat - 0.01}%2C${lng + 0.01}%2C${lat + 0.01}&layer=mapnik&marker=${lat}%2C${lng}`;

  const embedUrl = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ? mapUrl : osmUrl;

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-lg" style={{ height }}>
      {isLoading && (
        <div className="absolute inset-0 bg-powder-100 flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-2">
            <MapPin className="h-8 w-8 text-powder-600 animate-bounce" />
            <p className="text-powder-600 text-sm">Loading map...</p>
          </div>
        </div>
      )}
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={() => setIsLoading(false)}
        title="Store Location Map"
      />
    </div>
  );
}

interface StoreLocationCardProps {
  storeName?: string;
  address?: string;
  phone?: string;
  hours?: string;
  lat?: number;
  lng?: number;
}

export function StoreLocationCard({
  storeName = "Sarojmoun Silver Jewellery",
  address = "Main Market, Near Temple, Your City, State - 123456",
  phone = "+91 98765 43210",
  hours = "10:00 AM - 8:00 PM (Mon-Sat)",
  lat = 28.6139,
  lng = 77.209,
}: StoreLocationCardProps) {
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Map */}
      <GoogleMap address={address} lat={lat} lng={lng} height="300px" />

      {/* Store Info */}
      <div className="p-6 space-y-4">
        <h3 className="text-xl font-bold text-gray-900">{storeName}</h3>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-powder-600 mt-0.5 flex-shrink-0" />
            <p className="text-gray-600">{address}</p>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-powder-600 flex-shrink-0" />
            <a href={`tel:${phone.replace(/\s/g, "")}`} className="text-gray-600 hover:text-powder-600">
              {phone}
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-powder-600 flex-shrink-0" />
            <p className="text-gray-600">{hours}</p>
          </div>
        </div>

        <a
          href={googleMapsDirectionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 bg-powder-600 text-white rounded-xl font-semibold hover:bg-powder-700 transition-colors"
        >
          <Navigation className="h-5 w-5" />
          Get Directions
        </a>
      </div>
    </div>
  );
}
