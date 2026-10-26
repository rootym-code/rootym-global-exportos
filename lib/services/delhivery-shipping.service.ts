
const DELHIVERY_API_BASE = "https://track.delhivery.com";
const VOLUMETRIC_DIVISOR = 5000;


export type DelhiveryRateInput = {
  apiToken: string;
  originPin: string;
  destinationPin: string;
  weightGrams: number;
  lengthCm: number;
  breadthCm: number;
  heightCm: number;
};


export type DelhiveryRateQuote = {
  provider: "DELHIVERY";
  amount: number;
  chargedWeightGrams: number;
  zone: string | null;
  status: string | null;
};

type DelhiveryCharge = {
  total_amount?: number | string;
  charged_weight?: number | string;
  zone?: string | null;
  status?: string | null;
};

export async function getDelhiveryRate(
  input: DelhiveryRateInput,
): Promise<DelhiveryRateQuote> {
  const token = input.apiToken.trim();

  if (!token) {
    throw new Error("Delhivery API token is not configured for this store.");
  }
  if (
    !/^\d{6}$/.test(input.originPin) ||
    !/^\d{6}$/.test(input.destinationPin) ||
    !Number.isSafeInteger(input.weightGrams) ||
    input.weightGrams <= 0 ||
    ![
      input.lengthCm,
      input.breadthCm,
      input.heightCm,
    ].every((value) => Number.isFinite(value) && value > 0)
  ) {
    throw new Error("Invalid Delhivery rate request parameters.");
  }

  const volumetricWeightGrams = Math.ceil(
    (input.lengthCm *
      input.breadthCm *
      input.heightCm *
      1000) /
      VOLUMETRIC_DIVISOR,
  );

  const chargeableWeightGrams = Math.max(
    input.weightGrams,
    volumetricWeightGrams,
  );

  const url = new URL(
    "/api/kinko/v1/invoice/charges/.json",
    DELHIVERY_API_BASE,
  );

  url.searchParams.set("md", "S");
  url.searchParams.set("ss", "Delivered");
  url.searchParams.set("d_pin", input.destinationPin);
  url.searchParams.set("o_pin", input.originPin);
  url.searchParams.set("cgm", String(chargeableWeightGrams));
  url.searchParams.set("pt", "Pre-paid");

  let response: Response;

  try {
    response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Token ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    throw new Error("Unable to connect to Delhivery.");
  }

  if (!response.ok) {
    console.error(
      "[Delhivery] Rate request failed with HTTP status:",
      response.status,
    );

    throw new Error("Unable to retrieve a Delhivery shipping rate.");
  }

  let data: unknown;

  try {
    data = await response.json();
  } catch {
    throw new Error("Delhivery returned an invalid response.");
  }

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Delhivery returned no shipping-rate quote.");
  }

  const quote = data[0] as DelhiveryCharge;
  const amount = Number(quote.total_amount);
  const chargedWeightGrams = Number(quote.charged_weight);

  if (
    !Number.isFinite(amount) ||
    amount <= 0 ||
    !Number.isFinite(chargedWeightGrams) ||
    chargedWeightGrams <= 0
  ) {
    throw new Error("Delhivery returned an invalid shipping-rate quote.");
  }

  return {
    provider: "DELHIVERY",
    amount,
    chargedWeightGrams,
    zone: quote.zone ?? null,
    status: quote.status ?? null,
  };
}

export type ShipmentMeasurementsInput = {
    weightKg: number;
    lengthCm: number;
    widthCm: number;
    heightCm: number;
    quantity: number;
  };

  export type ShipmentMeasurements = {
    quantity: number;
    totalActualWeightKg: number;
    totalActualWeightGrams: number;
    totalVolumeCm3: number;
    equivalentCubeSideCm: number;
    equivalentParcelDimensionsCm: {
      lengthCm: number;
      breadthCm: number;
      heightCm: number;
    };
    volumetricWeightKg: number;
    chargeableWeightGrams: number;
  };

  export function calculateShipmentMeasurements(
    input: ShipmentMeasurementsInput,
  ): ShipmentMeasurements {
    const {
      weightKg,
      lengthCm,
      widthCm,
      heightCm,
      quantity,
    } = input;

    if (
      ![
        weightKg,
        lengthCm,
        widthCm,
        heightCm,
        quantity,
      ].every(Number.isFinite) ||
      weightKg <= 0 ||
      lengthCm <= 0 ||
      widthCm <= 0 ||
      heightCm <= 0 ||
      quantity <= 0
    ) {
      throw new Error(
        "Valid positive product measurements and quantity are required.",
      );
    }

    const totalActualWeightKg = weightKg * quantity;

    const totalActualWeightGrams = Math.ceil(
      totalActualWeightKg * 1000,
    );


    const unitVolumeCm3 = lengthCm * widthCm * heightCm;

    const totalVolumeCm3 = unitVolumeCm3 * quantity;

    // Equivalent cube: all three dimensions are equal.
    // This preserves total volume, but does not represent
    // the actual dimensions of the packed parcel.
    const equivalentCubeSideCm =
    Math.ceil(Math.cbrt(totalVolumeCm3) * 1000) / 1000;

    const volumetricWeightKg =
      totalVolumeCm3 / VOLUMETRIC_DIVISOR;


    const chargeableWeightGrams = Math.ceil(
      Math.max(totalActualWeightKg, volumetricWeightKg) * 1000,
    );

    if (
      !Number.isFinite(totalActualWeightKg) ||
      !Number.isSafeInteger(totalActualWeightGrams) ||
      !Number.isFinite(totalVolumeCm3) ||
      !Number.isFinite(volumetricWeightKg) ||
      !Number.isSafeInteger(chargeableWeightGrams)
    ) {
      throw new Error(
        "Calculated shipment measurements are outside the supported range.",
      );
    }


    return {
        quantity,
        totalActualWeightKg,
        totalActualWeightGrams,
        totalVolumeCm3,
        equivalentCubeSideCm,
        equivalentParcelDimensionsCm: {
          lengthCm: equivalentCubeSideCm,
          breadthCm: equivalentCubeSideCm,
          heightCm: equivalentCubeSideCm,
        },
        volumetricWeightKg,
        chargeableWeightGrams,
      };

  }

  export type PrepareDelhiveryQuoteInput = {
    apiToken: string;
    currency: string;
    originPin: string;
    destinationPin: string;
    measurements: ShipmentMeasurements;
  };

  export async function prepareDelhiveryQuote(
    input: PrepareDelhiveryQuoteInput,
  ): Promise<DelhiveryRateQuote> {
    if (input.currency.trim().toUpperCase() !== "INR") {
      throw new Error(
        "Delhivery shipping is currently supported only for INR orders.",
      );
    }

    if (
      !/^\d{6}$/.test(input.originPin) ||
      !/^\d{6}$/.test(input.destinationPin)
    ) {
      throw new Error("Valid six-digit Indian PIN codes are required.");
    }
      const dimensions = input.measurements.equivalentParcelDimensionsCm;
      return getDelhiveryRate({
      apiToken: input.apiToken,
      originPin: input.originPin,
      destinationPin: input.destinationPin,
      weightGrams: input.measurements.totalActualWeightGrams,
      lengthCm: dimensions.lengthCm,
      breadthCm: dimensions.breadthCm,
      heightCm: dimensions.heightCm,
    });
  }

