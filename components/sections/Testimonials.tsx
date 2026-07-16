import { Quote, Star } from "lucide-react";

import Card from "@/components/ui/Card";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeading from "@/components/ui/SectionHeading";

import { testimonials } from "@/data/testimonials";

export default function Testimonials() {
  return (
    <SectionContainer className="bg-gradient-to-b from-white to-gray-50">
      <SectionHeading
        badge="Testimonials"
        title="Building Long-Term Relationships with Global Buyers"
        description="Our commitment is to provide reliable sourcing, transparent communication and dependable export support for every international customer."
      />

      <div className="mt-20 grid gap-8 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <Card
            key={testimonial.name}
            className="group flex h-full flex-col p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
          >
            <Quote className="h-10 w-10 text-[#2E7D32]" />

            <div className="mt-6 flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="h-5 w-5 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>

            <p className="mt-6 flex-grow text-lg leading-8 text-gray-600 italic">
              &ldquo;{testimonial.message}&rdquo;
            </p>

            <div className="mt-8 border-t pt-6">
              <h3 className="font-bold text-gray-900">
                {testimonial.name}
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                {testimonial.designation}
              </p>

              <p className="mt-1 text-sm font-medium text-[#2E7D32]">
                {testimonial.country}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </SectionContainer>
  );
}