import React from "react";
import Title from "./Title";

const GoogleBusinessProfile = () => {
  const address = "Bidhan Park, Barasat, Kolkata-700124, West Bengal";

  // Google Maps embed URL for Loknath Sofa Center
  const mapsEmbedUrl =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d230.01729385040636!2d88.49087502773321!3d22.71795455458312!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f8a300549ab59f%3A0xcaabd02a4a58e490!2sLoknath%20Sofa%20Center!5e0!3m2!1sen!2sin!4v1766226403147!5m2!1sen!2sin";

  // Specific place / directions link (opens Google Maps at Loknath Sofa Center)
  const googleMapsUrl =
    "https://www.google.com/maps/place/Loknath+Sofa+Center/@22.7179621,88.4911163,19.6z/data=!4m6!3m5!1s0x39f8a300549ab59f:0xcaabd02a4a58e490!8m2!3d22.7180601!4d88.4907312!16s%2Fg%2F11vzy_2ywh?entry=ttu&g_ep=EgoyMDI2MDQxNC4wIKXMDSoASAFQAw%3D%3D";

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title text1={"FIND"} text2={"US"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-ivory-400 mt-4">
          Visit our store at Bidhan Park, Barasat.{" "}
          {"We're here to help you find the perfect furniture for your home."}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mt-8">
        <div className="flex-1 w-full h-[250px] md:h-[300px] overflow-hidden shadow-gold border border-gold-500/25 grayscale-[0.3] contrast-[1.05] brightness-[0.9] hover:grayscale-0 hover:brightness-100 transition-all duration-500">
          <iframe
            src={mapsEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Loknath Sofa Center Location"
          />
        </div>

        <div className="flex-1 flex flex-col justify-center gap-6 p-8 card-luxury">
          <div>
            <h3 className="font-display text-2xl text-gold-gradient mb-4">
              Loknath Sofa Center
            </h3>
            <div className="space-y-3 text-ivory-300">
              <p className="flex items-start gap-2">
                <span className="font-medium min-w-[80px] text-ivory-100">Address:</span>
                <span>{address}</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="font-medium min-w-[80px] text-ivory-100">Phone:</span>
                <a
                  href="tel:+919123924645"
                  className="hover:text-gold-400 transition-colors"
                >
                  +91 91239 24645
                </a>
              </p>
              <p className="flex items-center gap-2">
                <span className="font-medium min-w-[80px] text-ivory-100">Email:</span>
                <a
                  href="mailto:loknathsofacenter@gmail.com"
                  className="hover:text-gold-400 transition-colors"
                >
                  loknathsofacenter@gmail.com
                </a>
              </p>
            </div>
          </div>

          <div className="mt-4">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              Get Directions
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleBusinessProfile;
