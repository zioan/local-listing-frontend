import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faTwitter, faWhatsapp } from "@fortawesome/free-brands-svg-icons";

const SecureShareLink = ({ href, ariaLabel, bgColor, icon }) => {
  return (
    <a
      href={href}
      className={`flex items-center justify-center w-8 h-8 text-white rounded-full transition-colors duration-300 ${bgColor}`}
      aria-label={ariaLabel}
      target="_blank"
      rel="noopener noreferrer nofollow"
    >
      <FontAwesomeIcon icon={icon} />
    </a>
  );
};

// Facebook Share Link
export const FacebookShareLink = ({ url, quote }) => (
  <SecureShareLink
    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(quote)}`}
    ariaLabel="Share on Facebook"
    bgColor="bg-[#1877F2] hover:bg-[#166FE5]"
    icon={faFacebookF}
  />
);

// X (Twitter) Share Link
export const XShareLink = ({ url, title }) => (
  <SecureShareLink
    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
    ariaLabel="Share on X (Twitter)"
    bgColor="bg-black hover:bg-gray-800"
    icon={faTwitter}
  />
);

// WhatsApp Share Link
export const WhatsAppShareLink = ({ url, title }) => (
  <SecureShareLink
    href={`https://wa.me/?text=${encodeURIComponent(title + " " + url)}`}
    ariaLabel="Share on WhatsApp"
    bgColor="bg-[#25D366] hover:bg-[#20BD5C]"
    icon={faWhatsapp}
  />
);
