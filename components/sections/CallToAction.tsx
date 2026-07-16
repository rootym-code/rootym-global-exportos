import {
    ArrowRight,
    CheckCircle2,
    Mail,
    PhoneCall,
  } from "lucide-react";
  
  import Button from "@/components/ui/Button";
  import SectionContainer from "@/components/ui/SectionContainer";
  
  const benefits = [
    "APEDA Registered Exporter",
    "End-to-End Export Documentation",
    "Global Shipping Assistance",
    "Dedicated Buyer Support",
  ];
  
  export default function CallToAction() {
    return (
      <SectionContainer>
        <div className="overflow-hidden rounded-[36px] bg-gradient-to-r from-[#1B5E20] via-[#2E7D32] to-[#388E3C] shadow-2xl">
  
          <div className="grid items-center gap-12 px-8 py-16 lg:grid-cols-2 lg:px-16">
  
            {/* Left */}
  
            <div>
  
              <span className="inline-flex rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                Ready to Source from India?
              </span>
  
              <h2 className="mt-6 text-4xl font-bold leading-tight text-white lg:text-5xl">
              Let&apos;s Build Your Next
                <br />
                Export Partnership
              </h2>
  
              <p className="mt-6 max-w-xl text-lg leading-8 text-green-100">
                Whether you&apos;re an importer, distributor, supermarket or food
                processor, ROOTYM is ready to supply premium Indian agricultural
                products with dependable quality, documentation and logistics
                support.
              </p>
  
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
  
                {benefits.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-xl bg-white/10 p-3 backdrop-blur"
                  >
                    <CheckCircle2 className="h-5 w-5 text-green-200" />
  
                    <span className="font-medium text-white">
                      {item}
                    </span>
                  </div>
                ))}
  
              </div>
  
            </div>
  
            {/* Right */}
  
            <div className="rounded-3xl bg-white p-8 shadow-xl">
  
              <h3 className="text-2xl font-bold text-gray-900">
                Start Your Export Inquiry
              </h3>
  
              <p className="mt-3 text-gray-600">
                Tell us your product requirements and our export team will
                respond with pricing, packaging options and shipment details.
              </p>
  
              <div className="mt-8 space-y-4">
  
                <Button className="w-full justify-center">
                  Request Export Quote
                </Button>
  
                <Button
                  variant="secondary"
                  className="w-full justify-center"
                >
                  Schedule Consultation
                </Button>
  
              </div>
  
              <div className="mt-10 border-t pt-6">
  
                <div className="flex items-center gap-3">
  
                  <Mail className="h-5 w-5 text-[#2E7D32]" />
  
                  <span className="text-gray-700">
                    prem@rootym.in
                  </span>
  
                </div>
  
                <div className="mt-4 flex items-center gap-3">
  
                  <PhoneCall className="h-5 w-5 text-[#2E7D32]" />
  
                  <span className="text-gray-700">
                    +91 98735 29752
                  </span>
  
                </div>
  
                <div className="mt-6 flex items-center justify-between rounded-xl bg-green-50 p-4">
  
                  <div>
  
                    <p className="font-semibold text-[#2E7D32]">
                      Typical Response Time
                    </p>
  
                    <p className="text-sm text-gray-600">
                      Within 24 Business Hours
                    </p>
  
                  </div>
  
                  <ArrowRight className="h-6 w-6 text-[#2E7D32]" />
  
                </div>
  
              </div>
  
            </div>
  
          </div>
  
        </div>
      </SectionContainer>
    );
  }