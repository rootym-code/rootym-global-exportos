import { ArrowRight } from "lucide-react";

import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";
import IconBox from "@/components/ui/IconBox";

import { exportProcess } from "@/data/exportProcess";

export default function ExportProcess() {
  return (
    <SectionContainer className="bg-gray-50">
      <SectionHeading
        badge="Our Export Process"
        title="From Indian Farms to Your Warehouse"
        description="Every shipment follows a structured export process to ensure consistent quality, complete documentation and reliable delivery."
      />

      <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {exportProcess.map((item, index) => {
          const Icon = item.icon;

          return (
            <Card key={item.step} className="group relative p-8">
              {/* Step Number */}

              <div className="absolute right-6 top-6 text-5xl font-extrabold text-gray-100">
                {item.step}
              </div>

              {/* Icon */}

              <IconBox>
                <Icon className="h-8 w-8" />
              </IconBox>

              {/* Title */}

              <h3 className="mt-8 text-2xl font-bold text-gray-900">
                {item.title}
              </h3>

              {/* Description */}

              <p className="mt-4 leading-7 text-gray-600">
                {item.description}
              </p>

              {/* Connector */}

              {index < exportProcess.length - 1 && (
                <div className="mt-8 flex items-center text-[#2E7D32]">
                  <span className="text-sm font-semibold">
                    Next Step
                  </span>

                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </SectionContainer>
  );
}