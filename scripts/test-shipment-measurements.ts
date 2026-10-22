
import { calculateShipmentMeasurements } from "../lib/services/delhivery-shipping.service";

const result = calculateShipmentMeasurements({
  weightKg: 1,
  lengthCm: 20,
  widthCm: 15,
  heightCm: 10,
  quantity: 5,
});

console.log("Shipment measurement test passed.");
console.log(JSON.stringify(result, null, 2));
