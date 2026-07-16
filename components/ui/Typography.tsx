interface HeadingProps {
    children: React.ReactNode;
  }
  
  export function Display({ children }: HeadingProps) {
    return (
      <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 lg:text-7xl">
        {children}
      </h1>
    );
  }
  
  export function Heading({ children }: HeadingProps) {
    return (
      <h2 className="text-4xl font-bold text-gray-900 md:text-5xl">
        {children}
      </h2>
    );
  }
  
  export function SubHeading({ children }: HeadingProps) {
    return (
      <p className="text-lg leading-8 text-gray-600">
        {children}
      </p>
    );
  }