import Card from "@/components/ui/Card";
import IconBox from "@/components/ui/IconBox";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeading from "@/components/ui/SectionHeading";

import { certifications } from "@/data/certifications";

export default function Certifications() {
  return (
    <SectionContainer>
      <SectionHeading
        badge="Certifications & Compliance"
        title="Built on Trust. Backed by Compliance."
        description="ROOTYM follows internationally recognized export practices and maintains the registrations required to support reliable agricultural exports."
      />

      <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {certifications.map((item) => {
          const Icon = item.icon;

          return (
            <Card
              key={item.title}
              className="group p-8"
            >
              <IconBox>
                <Icon className="h-8 w-8" />
              </IconBox>

              <h3 className="mt-8 text-2xl font-bold text-gray-900">
                {item.title}
              </h3>

              <p className="mt-4 leading-7 text-gray-600">
                {item.description}
              </p>
            </Card>
          );
        })}
      </div>
    </SectionContainer>
  );
}