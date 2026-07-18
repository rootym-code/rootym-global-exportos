import Image from "next/image";

export function LoginHero() {
  return (
    <div className="relative hidden lg:flex flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 p-12 text-white">
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-black/10 blur-3xl" />

      <div className="relative z-10">
        <Image
          src="/images/rootym-logo.png"
          alt="ROOTYM"
          width={220}
          height={60}
          priority
          className="h-auto w-auto brightness-0 invert"
        />

        <div className="mt-16 max-w-md">
          <h1 className="text-5xl font-bold leading-tight">
            Welcome to
            <br />
            ROOTYM Admin
          </h1>

          <p className="mt-6 text-lg leading-8 text-green-50">
            Manage export inquiries, products, buyers and business operations
            from one secure dashboard.
          </p>
        </div>
      </div>

      <div className="relative z-10">
        <div className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-md">
          <p className="text-lg font-semibold">
            Rooted in India.
          </p>

          <p className="mt-2 text-green-100">
            Trusted Worldwide.
          </p>
        </div>
      </div>
    </div>
  );
}