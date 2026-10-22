
import { readFileSync } from "node:fs";

const envText = readFileSync(".env.local", "utf8");

function readEnv(name) {
  const line = envText
    .split(/\r?\n/)
    .find((entry) => entry.trim().startsWith(`${name}=`));

  if (!line) return "";

  return line
    .slice(line.indexOf("=") + 1)
    .trim()
    .replace(/^["']|["']$/g, "");
}

const token = readEnv("DELHIVERY_API_TOKEN");
const originPin = readEnv("DELHIVERY_PICKUP_PIN");

// Test destination only. Replace with a real six-digit delivery PIN.
const destinationPin = "110001";

// Sample measurements only; not a final shipping quote.
const weightGrams = 1000;
const lengthCm = 20;
const breadthCm = 15;
const heightCm = 10;

if (!token || !/^\d{6}$/.test(originPin)) {
  console.error("Missing token or invalid pickup PIN configuration.");
  process.exit(1);
}

const volumetricWeightGrams = Math.ceil(
  (lengthCm * breadthCm * heightCm * 1000) / 5000,
);
const chargeableWeightGrams = Math.max(
  weightGrams,
  volumetricWeightGrams,
);

const url = new URL(
  "/api/kinko/v1/invoice/charges/.json",
  "https://track.delhivery.com",
);

url.searchParams.set("md", "S");
url.searchParams.set("ss", "Delivered");
url.searchParams.set("d_pin", destinationPin);
url.searchParams.set("o_pin", originPin);
url.searchParams.set("cgm", String(chargeableWeightGrams));
url.searchParams.set("pt", "Pre-paid");

try {
  const response = await fetch(url, {
    headers: {
      Authorization: `Token ${token}`,
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(15000),
  });

  console.log("HTTP status:", response.status);
  console.log("Origin PIN:", originPin);
  console.log("Destination PIN:", destinationPin);

  const body = await response.text();

  if (response.ok) {
    try {
      const data = JSON.parse(body);

      if (Array.isArray(data)) {
        console.log(
          "Sanitized response:",
          JSON.stringify(
            data.map((item) => ({
              total_amount: item?.total_amount,
              charged_weight: item?.charged_weight,
              zone: item?.zone,
              status: item?.status,
            })),
          ),
        );
      } else {
        console.log("Response type: unexpected JSON structure");
      }
    } catch {
      console.log("Response type: non-JSON response");
    }
  } else {
    console.log("Request failed; response body withheld for safety.");
  }
} catch (error) {
  console.log(
    "Request error:",
    error instanceof Error ? error.message : "Unknown error",
  );
}
