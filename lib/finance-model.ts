import type { Property } from './atheeldar-data';

/** These are calculation limits, not a lender's eligibility rules. */
export const FINANCE_LIMITS = { amount: 1_000_000_000, years: 40, rate: 30 } as const;
export const FINANCE_SCENARIOS_KEY = 'atheeldar-finance-scenarios-v2';

export type FinanceInputs = {
  price: number;
  downPayment: number;
  years: number;
  annualRate: number;
  monthlyIncome: number;
  monthlyDebts: number;
  upfrontCosts: number;
  monthlyCosts: number;
  budgetShare: number;
};
export type FinanceField = keyof FinanceInputs;
export type FinanceErrors = Partial<Record<FinanceField, string>>;
export type FinanceDraft = Record<FinanceField, string>;

export const DEFAULT_FINANCE_INPUTS: FinanceInputs = {
  price: 2_000_000, downPayment: 400_000, years: 25, annualRate: 4.5,
  monthlyIncome: 25_000, monthlyDebts: 0, upfrontCosts: 0, monthlyCosts: 0, budgetShare: 35,
};

const fieldLabels: Record<FinanceField, string> = {
  price: 'سعر العقار', downPayment: 'الدفعة الأولى', years: 'مدة التمويل', annualRate: 'نسبة التمويل السنوية',
  monthlyIncome: 'الدخل الشهري', monthlyDebts: 'الأقساط الحالية', upfrontCosts: 'مصاريف الشراء الإضافية',
  monthlyCosts: 'التشغيل والصيانة الشهرية', budgetShare: 'نسبة التخصيص من الدخل',
};
const fields = Object.keys(fieldLabels) as FinanceField[];

export function financeDraft(input: FinanceInputs): FinanceDraft {
  return Object.fromEntries(fields.map(field => [field, String(input[field])])) as FinanceDraft;
}

/** Accept ordinary Arabic, Persian and Latin decimal numbers; never treat an empty input as zero. */
export function parseFinanceNumber(value: string): number | null {
  const normalized = value.trim()
    .replace(/[٠-٩]/g, digit => String(digit.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, digit => String(digit.charCodeAt(0) - 0x06f0))
    .replace(/[\s,٬]/g, '').replace(/٫/g, '.');
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(normalized)) return null;
  const result = Number(normalized);
  return Number.isFinite(result) ? result : null;
}

export type FinanceValidation = { ok: true; input: FinanceInputs } | { ok: false; errors: FinanceErrors };

export function validateFinanceInputs(value: unknown): FinanceValidation {
  const raw = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  const errors: FinanceErrors = {};
  for (const field of fields) {
    const number = raw[field];
    if (typeof number !== 'number' || !Number.isFinite(number)) {
      errors[field] = `أدخل ${fieldLabels[field]} كرقم صالح.`;
      continue;
    }
    if (field === 'years') {
      if (!Number.isInteger(number) || number < 1 || number > FINANCE_LIMITS.years) errors[field] = 'اختر مدة من سنة إلى ٤٠ سنة، بالسنوات الكاملة.';
    } else if (field === 'annualRate') {
      if (number < 0 || number > FINANCE_LIMITS.rate) errors[field] = 'أدخل نسبة من صفر إلى ٣٠٪.';
    } else if (field === 'budgetShare') {
      if (number < 1 || number > 100) errors[field] = 'اختر نسبة من ١٪ إلى ١٠٠٪ من دخلك.';
    } else if (number < 0 || number > FINANCE_LIMITS.amount || (field === 'price' && number === 0) || (number > 0 && number < 0.01)) {
      errors[field] = field === 'price' ? 'أدخل سعرًا من هللة إلى مليار ريال.' : 'أدخل صفرًا أو مبلغًا من هللة إلى مليار ريال.';
    }
  }
  if (!errors.price && !errors.downPayment && (raw.downPayment as number) > (raw.price as number)) {
    errors.downPayment = 'الدفعة الأولى لا يمكن أن تتجاوز سعر العقار.';
  }
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, input: Object.fromEntries(fields.map(field => [field, raw[field]])) as FinanceInputs };
}

export function validateFinanceDraft(draft: FinanceDraft): FinanceValidation {
  return validateFinanceInputs(Object.fromEntries(fields.map(field => [field, parseFinanceNumber(draft[field])])));
}

export type FinanceYear = {
  year: number;
  openingBalance: number;
  principalPaid: number;
  financeCost: number;
  payments: number;
  closingBalance: number;
};

export type FinanceCalculation = {
  ok: true;
  input: FinanceInputs;
  principal: number;
  monthlyPayment: number;
  monthlyHousingCost: number;
  upfrontRequired: number;
  totalInstallments: number;
  totalFinanceCost: number;
  totalOwnershipCosts: number;
  allInCost: number;
  remainingIncome: number;
  allocationRatio: number | null;
  budgetLimit: number;
  availablePayment: number;
  affordablePrice: number | null;
  affordablePriceCapped: boolean;
  annualSchedule: FinanceYear[];
};

/** Fixed monthly, end-of-month installments on a declining balance; the annual rate is nominal. */
export function calculateFinance(value: unknown): FinanceCalculation | { ok: false; errors: FinanceErrors } {
  const validation = validateFinanceInputs(value);
  if (!validation.ok) return validation;
  const input = validation.input;
  const principal = input.price - input.downPayment;
  const months = input.years * 12;
  const monthlyRate = input.annualRate / 1_200;
  // log1p/expm1 avoid cancellation for very small positive rates.
  const paymentPerRiyal = monthlyRate === 0 ? 1 / months : monthlyRate / -Math.expm1(-months * Math.log1p(monthlyRate));
  const monthlyPayment = principal * paymentPerRiyal;
  const annualSchedule: FinanceYear[] = [];
  let balance = principal;
  if (principal > 0) {
    for (let year = 1; year <= input.years; year++) {
      const row: FinanceYear = { year, openingBalance: balance, principalPaid: 0, financeCost: 0, payments: 0, closingBalance: 0 };
      for (let month = 1; month <= 12; month++) {
        const financeCost = balance * monthlyRate;
        const lastMonth = year === input.years && month === 12;
        const principalPaid = lastMonth ? balance : Math.max(0, Math.min(balance, monthlyPayment - financeCost));
        balance = Math.max(0, balance - principalPaid);
        row.principalPaid += principalPaid;
        row.financeCost += financeCost;
        row.payments += principalPaid + financeCost;
      }
      row.closingBalance = balance;
      annualSchedule.push(row);
    }
  }
  const totalInstallments = annualSchedule.reduce((sum, row) => sum + row.payments, 0);
  const totalFinanceCost = annualSchedule.reduce((sum, row) => sum + row.financeCost, 0);
  const monthlyHousingCost = monthlyPayment + input.monthlyCosts;
  const upfrontRequired = input.downPayment + input.upfrontCosts;
  const totalOwnershipCosts = input.monthlyCosts * months;
  const allocated = monthlyHousingCost + input.monthlyDebts;
  const budgetLimit = input.monthlyIncome * input.budgetShare / 100;
  const availablePayment = Math.max(0, budgetLimit - input.monthlyDebts - input.monthlyCosts);
  const rawAffordablePrice = availablePayment / paymentPerRiyal + input.downPayment;
  return {
    ok: true, input, principal, monthlyPayment, monthlyHousingCost, upfrontRequired,
    totalInstallments, totalFinanceCost, totalOwnershipCosts,
    allInCost: upfrontRequired + totalInstallments + totalOwnershipCosts,
    remainingIncome: input.monthlyIncome - allocated,
    allocationRatio: input.monthlyIncome > 0 ? allocated / input.monthlyIncome * 100 : null,
    budgetLimit, availablePayment,
    affordablePrice: input.monthlyIncome > 0 ? Math.min(FINANCE_LIMITS.amount, Math.max(0, rawAffordablePrice)) : null,
    affordablePriceCapped: input.monthlyIncome > 0 && rawAffordablePrice > FINANCE_LIMITS.amount,
    annualSchedule,
  };
}

/** A rental's annual price must never be interpreted as a purchase price. */
export function getFinancePropertyPrefill(property?: Pick<Property, 'purpose' | 'price'>): FinanceInputs | null {
  if (!property || property.purpose !== 'للبيع' || !Number.isFinite(property.price) || property.price < 0.01 || property.price > FINANCE_LIMITS.amount) return null;
  return { ...DEFAULT_FINANCE_INPUTS, price: property.price, downPayment: Math.round(property.price * 0.2) };
}

export type FinanceScenario = {
  version: 1;
  slot: 'a' | 'b';
  name: string;
  savedAt: string;
  input: FinanceInputs;
  propertySlug?: string;
};

/** Local storage is untrusted. Discard malformed or obsolete entries rather than render NaN. */
export function parseFinanceScenarios(value: unknown): FinanceScenario[] {
  if (!Array.isArray(value)) return [];
  const scenarios = new Map<'a' | 'b', FinanceScenario>();
  for (const item of value) {
    if (!item || typeof item !== 'object') continue;
    const raw = item as Record<string, unknown>;
    if (raw.version !== 1 || (raw.slot !== 'a' && raw.slot !== 'b') || typeof raw.name !== 'string' || typeof raw.savedAt !== 'string' || !Number.isFinite(Date.parse(raw.savedAt))) continue;
    const validation = validateFinanceInputs(raw.input);
    if (!validation.ok) continue;
    const name = raw.name.trim().slice(0, 50);
    if (!name) continue;
    scenarios.set(raw.slot, {
      version: 1, slot: raw.slot, name, savedAt: raw.savedAt, input: validation.input,
      ...(typeof raw.propertySlug === 'string' && /^[a-z0-9-]{1,120}$/.test(raw.propertySlug) ? { propertySlug: raw.propertySlug } : {}),
    });
  }
  return (['a', 'b'] as const).flatMap(slot => { const scenario = scenarios.get(slot); return scenario ? [scenario] : []; });
}
