"use client";

import {
  useEffect,
  useState,
} from "react";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import {
  FaLinkedin,
  FaFacebook,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

import { footer } from "@/data/footer";


interface CompanySettings {
  company: {
    companyName: string;
    tagline: string;
  };

  contact: {
    address: string;
    phone: string;
    email: string;
  };

  social: {
    facebook: string;
    linkedin: string;
    instagram: string;
    youtube: string;
  };
}


const sectionVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.12,
    },
  },
};


const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut",
    },
  },
};


export default function Footer() {

  const [companySettings, setCompanySettings] =
    useState<CompanySettings | null>(null);



  useEffect(() => {

    async function loadCompanySettings() {

      try {

        const response =
          await fetch(
            "/api/admin/cms/settings/company",
            {
              cache: "no-store",
            }
          );


        const result =
          await response.json();


        if (
          result.success &&
          result.data
        ) {
          setCompanySettings(
            result.data
          );
        }


      } catch (error) {

        console.error(
          "Footer CMS loading error:",
          error
        );

      }

    }


    loadCompanySettings();

  }, []);



  const companyName =
    companySettings?.company.companyName ||
    footer.company.name;


  const tagline =
    companySettings?.company.tagline ||
    footer.company.tagline;


  const address =
    companySettings?.contact.address ||
    footer.contact.address;


  const email =
    companySettings?.contact.email ||
    footer.contact.email;


  const phone =
    companySettings?.contact.phone ||
    footer.contact.phone;



  const socialLinks = [
    {
      Icon: FaLinkedin,
      url:
        companySettings?.social.linkedin ||
        "#",
    },

    {
      Icon: FaFacebook,
      url:
        companySettings?.social.facebook ||
        "#",
    },

    {
      Icon: FaInstagram,
      url:
        companySettings?.social.instagram ||
        "#",
    },

    {
      Icon: FaYoutube,
      url:
        companySettings?.social.youtube ||
        "#",
    },
  ];



  return (
    <motion.footer
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.15,
      }}
      className="relative overflow-hidden bg-[#143D1F] text-white"
    >

      {/* Ambient Background */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <motion.div
          animate={{
            x: [0, 80, 0],
            y: [0, -50, 0],
            scale: [1, 1.12, 1],
          }}

          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}

          className="absolute -top-48 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-green-400/10 blur-[140px]"
        />


        <motion.div
          animate={{
            x: [0, -70, 0],
            y: [0, 60, 0],
          }}

          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}

          className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-green-300/10 blur-[120px]"
        />

      </div>



      <div className="relative mx-auto max-w-7xl px-6 py-20">

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">


          {/* Company */}

          <motion.div
            variants={itemVariants}
            className="lg:col-span-2"
          >

            <motion.h2
              whileHover={{
                scale: 1.02,
              }}

              className="text-3xl font-bold"
            >
              {companyName}
            </motion.h2>


            <p className="mt-3 font-medium text-green-300">
              {tagline}
            </p>


            <p className="mt-6 max-w-md leading-8 text-green-100">
              {footer.company.description}
            </p>

          </motion.div>




          {/* Quick Links */}

          <motion.div variants={itemVariants}>

            <h3 className="text-lg font-semibold">
              Quick Links
            </h3>


            <ul className="mt-6 space-y-3">

              {footer.quickLinks.map(
                (item) => (

                  <li key={item}>

                    <motion.div
                      whileHover={{
                        x: 6,
                      }}
                    >

                      <Link
                        href="#"
                        className="transition-colors hover:text-green-300"
                      >
                        {item}
                      </Link>

                    </motion.div>

                  </li>

                )
              )}

            </ul>

          </motion.div>





          {/* Products */}

          <motion.div variants={itemVariants}>

            <h3 className="text-lg font-semibold">
              Products
            </h3>


            <ul className="mt-6 space-y-3">

              {footer.products.map(
                (item) => (

                  <li key={item}>

                    <motion.div
                      whileHover={{
                        x: 6,
                      }}

                      className="cursor-default text-green-100 transition-colors hover:text-green-300"
                    >
                      {item}
                    </motion.div>

                  </li>

                )
              )}

            </ul>

          </motion.div>





          {/* Contact */}

          <motion.div variants={itemVariants}>

            <h3 className="text-lg font-semibold">
              Contact
            </h3>



            <div className="mt-6 space-y-5">


              <motion.div
                whileHover={{
                  x: 5,
                }}

                className="flex gap-3"
              >

                <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-green-300" />

                <span className="text-green-100">
                  {address}
                </span>

              </motion.div>




              <motion.div
                whileHover={{
                  x: 5,
                }}

                className="flex gap-3"
              >

                <Mail className="mt-1 h-5 w-5 flex-shrink-0 text-green-300" />

                <span className="text-green-100">
                  {email}
                </span>

              </motion.div>




              <motion.div
                whileHover={{
                  x: 5,
                }}

                className="flex gap-3"
              >

                <Phone className="mt-1 h-5 w-5 flex-shrink-0 text-green-300" />

                <span className="text-green-100">
                  {phone}
                </span>

              </motion.div>


            </div>





            {/* Social Icons */}

            <div className="mt-8 flex gap-4">

              {socialLinks.map(
                ({
                  Icon,
                  url,
                }, index) => (

                  <motion.a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"

                    whileHover={{
                      y: -5,
                      scale: 1.15,
                    }}

                    whileTap={{
                      scale: 0.95,
                    }}

                    className="flex h-11 w-11 items-center justify-center rounded-full border border-green-500/40 bg-white/5 text-green-200 backdrop-blur transition-colors hover:border-green-300 hover:bg-white/10 hover:text-white"
                  >

                    <Icon className="h-5 w-5" />

                  </motion.a>

                )
              )}

            </div>


          </motion.div>


        </div>





        {/* Bottom Bar */}

        <motion.div
          variants={itemVariants}

          className="mt-16 border-t border-green-700/70 pt-8 text-center"
        >

          <p className="text-sm text-green-200">
            © 2026 ROOTYM AGRO HARVEST PRIVATE LIMITED. All Rights Reserved.
          </p>


          <p className="mt-2 text-xs text-green-300">
            Rooted in India. Trusted Worldwide.
          </p>


        </motion.div>


      </div>


    </motion.footer>
  );

}