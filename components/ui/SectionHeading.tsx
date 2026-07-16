interface SectionHeadingProps {
    badge?: string;
    title: string;
    description?: string;
    align?: "left" | "center";
  }
  
  export default function SectionHeading({
    badge,
    title,
    description,
    align = "center",
  }: SectionHeadingProps) {
    const alignment =
      align === "center" ? "text-center mx-auto" : "text-left";
  
    return (
      <div className={`max-w-3xl ${alignment}`}>
        {badge && (
          <span className="inline-flex rounded-full bg-green-100 px-5 py-2 text-sm font-semibold text-[#2E7D32]">
            {badge}
          </span>
        )}
  
        <h2 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
          {title}
        </h2>
  
        {description && (
          <p className="mt-6 text-lg leading-8 text-gray-600">
            {description}
          </p>
        )}
      </div>
    );
  }