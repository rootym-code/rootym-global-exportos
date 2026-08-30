"use client";

import { motion, animate, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

import {
  BrainCircuit,
  BarChart3,
  MessageSquare,
  Globe2,
  Sparkles,
  Activity,
  TrendingUp,
} from "lucide-react";

const panelClass =
  "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5";





  function AnimatedNumber({
  to,
  suffix = "",
  decimals = 0,
}: {
  to: number;
  suffix?: string;
  decimals?: number;
}) {
  const [display, setDisplay] = useState(to);

  useEffect(() => {
    const from = display;
    const start = performance.now();
    let frame = 0;

    const update = (now: number) => {
      const progress = Math.min((now - start) / 800, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(from + (to - from) * eased);
      if (progress < 1) frame = requestAnimationFrame(update);
    };

    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [to]);

  return (
    <>
      {display.toFixed(decimals)}
      {suffix}
    </>
  );
}

const baseChartPoints = [
  72, 80, 78, 88, 84,
  96, 102, 97, 109, 116,
  111, 121,
];

  function RevenueChart({
    chartPoints,
  }: {
    chartPoints: number[];
  }) {
    const width = 340;
    const height = 110;
  
    const step = width / (chartPoints.length - 1);
  
    const points = chartPoints
      .map((value, index) => {
        const x = index * step;
        const y = height - value;
        return `${x},${y}`;
      })
      .join(" ");
  
    const area =
      `0 ${height} ` +
      chartPoints
        .map((value, index) => {
          const x = index * step;
          const y = height - value;
          return `L ${x} ${y}`;
        })
        .join(" ") +
      ` L ${width} ${height} Z`;
  
    const lastX = (chartPoints.length - 1) * step;
    const lastY = height - chartPoints[chartPoints.length - 1];
  
    return (
      <div className="space-y-4">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-36 w-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id="lineGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
  
            <linearGradient
              id="areaGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
            </linearGradient>
  
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
  
          {/* Background Animated Bars */}
          {chartPoints.map((value, index) => {
            const x = index * step - 8;
            const h = value;
            const y = height - h;
  
            return (
              <motion.rect
                key={index}
                x={x}
                y={y}
                width={16}
                rx={5}
                fill="#10b981"
                opacity={0.12}
                initial={{
                  height: h * 0.6,
                  y: height - h * 0.6,
                }}
                animate={{
                  height: [h * 0.75, h, h * 0.82],
                  y: [
                    height - h * 0.75,
                    height - h,
                    height - h * 0.82,
                  ],
                }}
                transition={{
                  duration: 2 + index * 0.15,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                }}
              />
            );
          })}
  
          {/* Area */}
          <motion.path
            d={area}
            fill="url(#areaGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />
  
          {/* Line */}
          <motion.polyline
            fill="none"
            stroke="url(#lineGradient)"
          strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
            initial={{ pathLength: 0 }}
            animate={{
              pathLength: 1,
              opacity: [0.9, 1, 0.9],
            }}
            transition={{
              duration: 2,
              ease: "easeOut",
            }}
          />
  
          {/* Endpoint Glow */}
          <motion.circle
            cx={lastX}
            cy={lastY}
            r={5}
            fill="#34d399"
            filter="url(#glow)"

            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.7, 1, 0.7],
            }}


            transition={{
              repeat: Infinity,
              duration: 1.5,
            }}
          />
        </svg>
  
        <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-emerald-300">
              AI Business Activity
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Export activity increasing across active markets.
            </p>
          </div>
  
          <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
          <motion.span
  animate={{
    opacity: [0.7, 1, 0.7],
  }}
  transition={{
    repeat: Infinity,
    duration: 1.5,
  }}
>
  LIVE
</motion.span>
          </div>
        </div>
      </div>
    );
  }



export default function HeroDashboard() {

  const [chartPoints, setChartPoints] = useState(baseChartPoints);



useEffect(() => {
  const interval = setInterval(() => {
    setChartPoints((previous) =>
      previous.map((value) => {
        const delta =
        Math.sin(Date.now() / 1800 + value) * 2 +
        (Math.random() * 3 - 1.5);

        const next = value + delta;




        return Math.min(125, Math.max(68, next));
      })
    );
  }, 1800);

  return () => clearInterval(interval);
}, []);


        
const [revenue, setRevenue] = useState(2.8);
const [orders, setOrders] = useState(327);
const [tasks, setTasks] = useState(24);

useEffect(() => {
  const revenueTimer = setInterval(() => {
    setRevenue((v) => {
      const next = v + (Math.random() * 0.08 - 0.03);
      return Number(Math.max(2.5, Math.min(3.5, next)).toFixed(1));
    });
  }, 2600);

  const ordersTimer = setInterval(() => {
    setOrders((v) => {
      const delta = Math.floor(Math.random() * 7) - 2;
      return Math.max(300, Math.min(360, v + delta));
    });
  }, 1700);

  const taskTimer = setInterval(() => {
    setTasks((v) => {
      const delta = Math.floor(Math.random() * 3) - 1;
      return Math.max(18, Math.min(40, v + delta));
    });
  }, 2200);

  return () => {
    clearInterval(revenueTimer);
    clearInterval(ordersTimer);
    clearInterval(taskTimer);
  };
}, []);


  return (
<motion.div
  initial={{ opacity: 0, x: 40, scale: 0.95 }}

  animate={{
    opacity: 1,
    x: 0,
    scale: 1,
    y: [0, -8, 0],
  }}

  transition={{
    duration: 0.8,
    ease: "easeOut",
  }}
      className="relative w-full"
      style={{
        perspective: 1800,
      }}
    >
      {/* Background Glow */}
      <div className="absolute -left-16 top-12 h-72 w-72 rounded-full bg-emerald-500/20 blur-[120px]" />

      <div className="absolute -right-12 bottom-0 h-64 w-64 rounded-full bg-cyan-500/20 blur-[120px]" />

      {/* Dashboard */}
      <div
        className="
          relative
          overflow-hidden
          rounded-[32px]
          border
          border-white/10
          bg-slate-900/70
          backdrop-blur-2xl
          shadow-[0_40px_120px_rgba(16,185,129,0.15)]
        "
        style={{
          transform:
            "rotateX(10deg) rotateY(-10deg)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">

          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-emerald-400">
              ROOTYM AI
            </p>

            <h3 className="mt-2 text-2xl font-bold text-white">
              ExportOS Dashboard
            </h3>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">

<motion.div
  animate={{
    scale: [1, 1.3, 1],
    opacity: [1, 0.6, 1],
  }}
  transition={{
    repeat: Infinity,
    duration: 2,
  }}
  className="h-2.5 w-2.5 rounded-full bg-emerald-400"
/>

<Sparkles className="h-4 w-4" />

<span>AI Active</span>

</div>

        </div>

        {/* Dashboard Grid */}
        <div className="grid gap-5 p-6 lg:grid-cols-2">


            {/* ================= Analytics ================= */}

<div className={panelClass}>
<div className="flex items-center justify-between">

  <div className="space-y-1">

    <div className="flex items-center gap-2">

      <div className="relative">
        <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />

        <motion.div
          className="absolute inset-0 rounded-full bg-emerald-400"
          animate={{
            scale: [1, 2.3, 1],
            opacity: [0.9, 0, 0.9],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut",
          }}
        />
      </div>

      <BarChart3 className="h-5 w-5 text-emerald-400" />

      <span className="font-semibold text-white">
        Export Analytics
      </span>

    </div>

    <p className="text-xs text-slate-400">
      Live business intelligence powered by ROOTYM AI
    </p>

  </div>

  <motion.div
    whileHover={{ scale: 1.05 }}
    className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-2"
  >
    <TrendingUp className="h-4 w-4 text-emerald-300" />

    <span className="text-xs text-slate-400">
      this month
    </span>
  </motion.div>

</div>

   <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300">
      <TrendingUp className="h-3 w-3" />
      +18%
    </div>
  </div>
  <div className="mt-6 grid grid-cols-3 gap-4">

{[
  {
    title: "Revenue",
    value: (
      <>
        $
        <AnimatedNumber
          to={revenue}
          decimals={1}
          suffix="M"
        />
      </>
    ),
    change: "+18.4%",
    color: "text-emerald-400",
    icon: <TrendingUp className="h-4 w-4" />,
  },
  {
    title: "Orders",
    value: (
      <AnimatedNumber
        to={orders}
      />
    ),
    change: "+12",
    color: "text-cyan-400",
    icon: <Globe2 className="h-4 w-4" />,
  },
  {
    title: "AI Tasks",
    value: (
      <AnimatedNumber
        to={tasks}
      />
    ),
    change: "Running",
    color: "text-violet-400",
    icon: <BrainCircuit className="h-4 w-4" />,
  },
].map((item) => (
  <motion.div
    key={item.title}
    whileHover={{
      y: -5,
      scale: 1.02,
    }}
    transition={{
      duration: 0.25,
    }}
    className="
      rounded-2xl
      border
      border-white/10
      bg-gradient-to-br
      from-white/8
      to-white/5
      p-4
      backdrop-blur-xl
    "
  >
    <div className="flex items-center justify-between">

      <p className="text-xs uppercase tracking-wide text-slate-400">
        {item.title}
      </p>

      <div className={item.color}>
        {item.icon}
      </div>

    </div>

    <h2 className="mt-3 text-3xl font-bold text-white">
      {item.value}
    </h2>

    <div className="mt-4 flex items-center gap-2">

      <div className={`text-xs font-medium ${item.color}`}>
        {item.change}
      </div>

      <div className="h-1 w-1 rounded-full bg-slate-500" />

      <span className="text-xs text-slate-500">
        Live
      </span>

    </div>

  </motion.div>
))}

</div>


<div className="mt-8">
<RevenueChart chartPoints={chartPoints} />
</div>


</div>

{/* ================= AI Assistant ================= */}

<div className={panelClass}>
  <div className="flex items-center gap-2">
    <BrainCircuit className="h-5 w-5 text-cyan-400" />

    <span className="font-semibold text-white">
      ROOTYM AI Assistant
    </span>
  </div>


<div className="mt-6 space-y-4">

  <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-4">
    <p className="text-xs text-cyan-300">
      LIVE TASK
    </p>

    <p className="mt-2 text-sm text-white">
      Generate quotation for Sri Lanka Buyer
    </p>
  </div>

  <div className="rounded-xl bg-white/5 p-4">

    <div className="flex justify-between">

      <span className="text-xs text-slate-400">
        AI Progress
      </span>

      <span className="text-xs text-emerald-400">
  <AnimatedNumber
    to={92}
    suffix="%"
  />
</span>

    </div>

    <div className="mt-3 h-2 rounded-full bg-white/10">

      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "92%" }}
        transition={{ duration: 1.2 }}
        className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
      />

    </div>

  </div>

  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">

    <p className="text-sm text-white">
      ✔ Draft quotation generated successfully.
    </p>

  </div>

</div>

</div>

{/* ================= Orders ================= */}

<div className={panelClass}>


<div className="flex items-center justify-between">
  <div className="flex items-center gap-3">
    <div className="relative">
      <div className="h-3 w-3 rounded-full bg-emerald-400" />

      <motion.div
        className="absolute inset-0 rounded-full bg-emerald-400"
        animate={{
          scale: [1, 2.2, 1],
          opacity: [0.8, 0, 0.8],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>

    <div>

      <p className="mt-1 text-xs text-slate-400">
        Live export business performance
      </p>
    </div>
  </div>

  <div className="flex items-center gap-2">
    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
      Today
    </span>

    <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
      LIVE
    </span>
  </div>
</div>


  <div className="mt-6 space-y-3">

{[
  {
    country: "Sri Lanka",
    product: "Fresh Onion",
    status: "Confirmed",
    value: "25 MT",
  },
  {
    country: "UAE",
    product: "French Fries",
    status: "Quotation",
    value: "18 MT",
  },
  {
    country: "Qatar",
    product: "Makhana",
    status: "Negotiation",
    value: "8 MT",
  },
].map((item) => (
  <div
    key={item.country}
    className="rounded-xl border border-white/5 bg-white/5 p-4"
  >
    <div className="flex items-center justify-between">

      <div>

        <p className="font-medium text-white">
          {item.country}
        </p>

        <p className="text-xs text-slate-400">
          {item.product}
        </p>

      </div>

      <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
        {item.status}
      </span>

    </div>

    <div className="mt-3 h-2 rounded-full bg-white/10">
      <div
        className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
        style={{ width: "75%" }}
      />
    </div>

    <div className="mt-2 flex justify-between text-xs text-slate-400">
      <span>Order Volume</span>
      <span>{item.value}</span>
    </div>

  </div>
))}

</div>
</div>
{/* ================= WhatsApp ================= */}

<div className={panelClass}>
  <div className="flex items-center gap-2">
    <MessageSquare className="h-5 w-5 text-green-400" />

    <span className="font-semibold text-white">
      WhatsApp Automation
    </span>
  </div>


  <div className="mt-6 space-y-4">

{/* Buyer Message */}
<div className="flex justify-start">
  <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-white/5 px-4 py-3">
    <p className="text-xs text-slate-400">
      Buyer • 10:32 AM
    </p>

    <p className="mt-2 text-sm text-white">
      Please send your best CIF Colombo price for 25 MT Fresh Onion.
    </p>
  </div>
</div>
{/* AI Reply */}
<div className="flex justify-end">
  <div className="max-w-[85%] rounded-2xl rounded-br-md bg-emerald-500/10 border border-emerald-500/20 px-4 py-3">
    <p className="text-xs text-emerald-300">
      ROOTYM AI • Draft
    </p>
    <p className="mt-2 text-sm text-white">
      Your quotation has been prepared and is ready for approval before sending.
    </p>
  </div>
</div>
{/* Status */}
<div className="flex items-center justify-between border-t border-white/10 pt-3">

  <span className="text-xs text-slate-400">
    WhatsApp Status
  </span>
  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
    Ready to Send
  </span>
</div>
</div>
</div>      {/* Dashboard Grid */}
</div>      {/* Dashboard */}
</motion.div> 
);
}