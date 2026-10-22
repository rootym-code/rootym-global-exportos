
import { config } from "dotenv";
import { getDelhiveryRate } from "../lib/services/delhivery-shipping.service";

config({ path: ".env.local" });

async function main() {
  const quote = await getDelhiveryRate({
    originPin: process.env.DELHIVERY_PICKUP_PIN ?? "",
    destinationPin: "110001",
    weightGrams: 1000,
    lengthCm: 20,
    breadthCm: 15,
    heightCm: 10,
  });

  console.log("Delhivery service test passed.");
  console.log("Provider:", quote.provider);
  console.log("Amount:", quote.amount);
  console.log("Charged weight (grams):", quote.chargedWeightGrams);
  console.log("Zone:", quote.zone);
  console.log("Status:", quote.status);
}

main().catch((error: unknown) => {
  console.error(
    "Delhivery service test failed:",
    error instanceof Error ? error.message : "Unknown error",
  );
  process.exitCode = 1;
});
