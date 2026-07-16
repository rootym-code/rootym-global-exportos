import { Mail, MapPin, Phone } from "lucide-react";

import {
  FaLinkedin,
  FaFacebook,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
  
  import { footer } from "@/data/footer";
  
  export default function Footer() {
    return (
      <footer className="bg-[#143D1F] text-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
  
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
  
            {/* Company */}
  
            <div className="lg:col-span-2">
  
              <h2 className="text-3xl font-bold">
                {footer.company.name}
              </h2>
  
              <p className="mt-3 font-medium text-green-300">
                {footer.company.tagline}
              </p>
  
              <p className="mt-6 max-w-md leading-8 text-green-100">
                {footer.company.description}
              </p>
  
            </div>
  
            {/* Quick Links */}
  
            <div>
  
              <h3 className="text-lg font-semibold">
                Quick Links
              </h3>
  
              <ul className="mt-6 space-y-3">
  
                {footer.quickLinks.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="transition hover:text-green-300"
                    >
                      {item}
                    </a>
                  </li>
                ))}
  
              </ul>
  
            </div>
  
            {/* Products */}
  
            <div>
  
              <h3 className="text-lg font-semibold">
                Products
              </h3>
  
              <ul className="mt-6 space-y-3">
  
                {footer.products.map((item) => (
                  <li key={item}>
                    {item}
                  </li>
                ))}
  
              </ul>
  
            </div>
  
            {/* Contact */}
  
            <div>
  
              <h3 className="text-lg font-semibold">
                Contact
              </h3>
  
              <div className="mt-6 space-y-5">
  
                <div className="flex gap-3">
                  <MapPin className="mt-1 h-5 w-5 text-green-300" />
  
                  <span>
                    {footer.contact.address}
                  </span>
                </div>
  
                <div className="flex gap-3">
                  <Mail className="mt-1 h-5 w-5 text-green-300" />
  
                  <span>
                    {footer.contact.email}
                  </span>
                </div>
  
                <div className="flex gap-3">
                  <Phone className="mt-1 h-5 w-5 text-green-300" />
  
                  <span>
                    {footer.contact.phone}
                  </span>
                </div>
  
              </div>
  
              <div className="mt-8 flex gap-4">
  
              <FaLinkedin />
<FaFacebook />
<FaInstagram />
<FaYoutube />
  
              </div>
  
            </div>
  
          </div>
  
          <div className="mt-16 border-t border-green-700 pt-8 text-center text-sm text-green-200">
  
            © 2026 ROOTYM AGRO HARVEST PRIVATE LIMITED.
            All Rights Reserved.
  
          </div>
  
        </div>
      </footer>
    );
  }