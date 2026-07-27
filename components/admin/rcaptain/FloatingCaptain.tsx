export default function FloatingCaptain() {
    return (
      <button
        className="
          fixed
          bottom-8
          right-8
          z-50
          flex
          items-center
          gap-3
          rounded-full
          bg-gradient-to-r
          from-emerald-600
          to-green-600
          px-6
          py-4
          text-white
          shadow-2xl
          transition-all
          duration-300
          hover:scale-105
          hover:shadow-emerald-500/40
        "
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-xl">
          🤖
        </div>
  
        <div className="text-left">
          <p className="text-xs uppercase tracking-widest text-emerald-100">
            AI Assistant
          </p>
  
          <h3 className="font-semibold">
            Ask R-CAPTAIN
          </h3>
        </div>
  
        {/* Pulse Indicator */}
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-300 opacity-75" />
          <span className="relative inline-flex h-4 w-4 rounded-full bg-green-400" />
        </span>
      </button>
    );
  }