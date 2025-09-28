export interface QuoteInput {
  duration: number;
  engineer?: boolean;
  multiCam?: boolean;
  afterHours?: boolean;
  rush?: boolean;
}

export interface QuoteBreakdown {
  items: Array<{ label: string; amount: number }>;
  subtotal: number;
  taxes: number;
  total: number;
  hourlyRate: number;
  discounts: Array<{ label: string; amount: number }>;
}

interface PricingRules {
  baseHourly: number;
  tierDiscount: {
    thresholdHours: number;
    discountRate: number;
  };
  engineerHourly: number;
  multiCamHourly: number;
  afterHoursPremium: number;
  rushFeeRate: number;
  taxRate: number;
}

const FALLBACK_RULES: PricingRules = {
  baseHourly: 175,
  tierDiscount: {
    thresholdHours: 4,
    discountRate: 0.1,
  },
  engineerHourly: 85,
  multiCamHourly: 120,
  afterHoursPremium: 75,
  rushFeeRate: 0.18,
  taxRate: 0.0875,
};

function parsePricingRules(): PricingRules {
  const fromEnv = process.env.PRICING_JSON;
  if (!fromEnv) {
    return FALLBACK_RULES;
  }
  try {
    const parsed = JSON.parse(fromEnv);
    return {
      baseHourly: parsed.baseHourly ?? FALLBACK_RULES.baseHourly,
      tierDiscount: {
        thresholdHours:
          parsed.tierDiscount?.thresholdHours ?? FALLBACK_RULES.tierDiscount.thresholdHours,
        discountRate:
          parsed.tierDiscount?.discountRate ?? FALLBACK_RULES.tierDiscount.discountRate,
      },
      engineerHourly: parsed.engineerHourly ?? FALLBACK_RULES.engineerHourly,
      multiCamHourly: parsed.multiCamHourly ?? FALLBACK_RULES.multiCamHourly,
      afterHoursPremium: parsed.afterHoursPremium ?? FALLBACK_RULES.afterHoursPremium,
      rushFeeRate: parsed.rushFeeRate ?? FALLBACK_RULES.rushFeeRate,
      taxRate: parsed.taxRate ?? FALLBACK_RULES.taxRate,
    };
  } catch (error) {
    console.error("Failed to parse PRICING_JSON", error);
    return FALLBACK_RULES;
  }
}

export function calculateQuote(input: QuoteInput): QuoteBreakdown {
  const rules = parsePricingRules();
  const duration = Math.max(1, Math.min(input.duration, 10));
  const baseHourly = rules.baseHourly;
  const base = baseHourly * duration;
  const items: Array<{ label: string; amount: number }> = [
    { label: `${duration}h studio rental @ $${baseHourly}/h`, amount: base },
  ];
  const discounts: QuoteBreakdown["discounts"] = [];

  if (duration >= rules.tierDiscount.thresholdHours) {
    const discountAmount = base * rules.tierDiscount.discountRate;
    discounts.push({
      label: `${rules.tierDiscount.thresholdHours}h+ booking discount`,
      amount: -discountAmount,
    });
  }

  if (input.engineer) {
    const amount = rules.engineerHourly * duration;
    items.push({ label: `On-site engineer support`, amount });
  }

  if (input.multiCam) {
    const amount = rules.multiCamHourly * duration;
    items.push({ label: `Multi-cam capture`, amount });
  }

  if (input.afterHours) {
    items.push({ label: `After-hours studio access`, amount: rules.afterHoursPremium });
  }

  let subtotal = items.reduce((acc, item) => acc + item.amount, 0);
  const discountTotal = discounts.reduce((acc, item) => acc + item.amount, 0);
  subtotal += discountTotal;
  const rushFee = input.rush ? subtotal * rules.rushFeeRate : 0;
  if (rushFee > 0) {
    items.push({ label: `Rush turnaround`, amount: rushFee });
  }

  subtotal += rushFee;

  const taxes = subtotal * rules.taxRate;
  const total = subtotal + taxes;

  return {
    items,
    subtotal,
    taxes,
    total,
    hourlyRate: baseHourly,
    discounts,
  };
}

export function formatCurrency(value: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(value);
}
