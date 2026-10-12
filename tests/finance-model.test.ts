import assert from 'node:assert/strict';
import test from 'node:test';
import {
  calculateFinance, DEFAULT_FINANCE_INPUTS, financeDraft, getFinancePropertyPrefill,
  parseFinanceNumber, parseFinanceScenarios, validateFinanceDraft, validateFinanceInputs,
  type FinanceCalculation, type FinanceInputs,
} from '../lib/finance-model';

function result(overrides: Partial<FinanceInputs> = {}): FinanceCalculation {
  const calculated = calculateFinance({ ...DEFAULT_FINANCE_INPUTS, ...overrides });
  assert.equal(calculated.ok, true);
  if (!calculated.ok) throw new Error('Expected a valid scenario');
  return calculated;
}
function close(actual: number, expected: number, tolerance = 0.00001) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} differs from ${expected}`);
}

test('fixed-payment formula agrees with an independently established 100,000 / 6% / 30-year example', () => {
  const plan = result({ price: 125_000, downPayment: 25_000, annualRate: 6, years: 30 });
  close(plan.monthlyPayment, 599.5505251527527);
  close(plan.totalInstallments, 215_838.189054991, 0.001);
  close(plan.totalFinanceCost, 115_838.189054991, 0.001);
});

test('zero rate produces simple principal repayment and no financing cost', () => {
  const plan = result({ price: 150_000, downPayment: 30_000, annualRate: 0, years: 10 });
  assert.equal(plan.monthlyPayment, 1_000);
  assert.equal(plan.totalFinanceCost, 0);
  assert.equal(plan.allInCost, 150_000);
  assert.equal(plan.annualSchedule.length, 10);
  assert.equal(plan.annualSchedule[9].closingBalance, 0);
});

test('a full down payment is a cash purchase without an artificial loan or schedule', () => {
  const plan = result({ price: 2_000_000, downPayment: 2_000_000, annualRate: 7, upfrontCosts: 12_000, monthlyCosts: 250, years: 10 });
  assert.equal(plan.principal, 0);
  assert.equal(plan.monthlyPayment, 0);
  assert.equal(plan.totalInstallments, 0);
  assert.equal(plan.totalFinanceCost, 0);
  assert.deepEqual(plan.annualSchedule, []);
  assert.equal(plan.allInCost, 2_042_000);
});

test('annual schedule reconciles principal, financing cost, payments and a zero ending balance', () => {
  const plan = result();
  close(plan.annualSchedule.reduce((sum, row) => sum + row.principalPaid, 0), plan.principal);
  close(plan.totalInstallments, plan.principal + plan.totalFinanceCost);
  assert.equal(plan.annualSchedule[plan.annualSchedule.length - 1]?.closingBalance, 0);
  plan.annualSchedule.forEach((row, index) => {
    close(row.openingBalance - row.principalPaid, row.closingBalance);
    close(row.principalPaid + row.financeCost, row.payments);
    assert.ok(row.closingBalance >= 0);
    if (index) {
      assert.ok(row.principalPaid > plan.annualSchedule[index - 1].principalPaid);
      assert.ok(row.financeCost < plan.annualSchedule[index - 1].financeCost);
    }
  });
});

test('user-entered costs have separate upfront and monthly units and do not silently enlarge the loan', () => {
  const clean = result({ years: 10 });
  const withCosts = result({ years: 10, upfrontCosts: 20_000, monthlyCosts: 150 });
  assert.equal(clean.principal, withCosts.principal);
  assert.equal(clean.monthlyPayment, withCosts.monthlyPayment);
  assert.equal(withCosts.upfrontRequired, clean.upfrontRequired + 20_000);
  assert.equal(withCosts.totalOwnershipCosts, 18_000);
  close(withCosts.allInCost, clean.allInCost + 38_000);
  close(withCosts.monthlyHousingCost, clean.monthlyHousingCost + 150);
});

test('affordability reverses the payment equation after current debts and housing costs', () => {
  const plan = result({ monthlyIncome: 20_000, monthlyDebts: 1_000, monthlyCosts: 500, budgetShare: 35 });
  assert.equal(plan.budgetLimit, 7_000);
  assert.equal(plan.availablePayment, 5_500);
  assert.ok(plan.affordablePrice !== null);
  const target = result({ price: plan.affordablePrice!, monthlyIncome: 20_000, monthlyDebts: 1_000, monthlyCosts: 500, budgetShare: 35 });
  close(target.monthlyPayment, 5_500);
  close(target.allocationRatio!, 35);
});

test('zero income and exhausted allocation do not manufacture borrowing capacity', () => {
  const noIncome = result({ monthlyIncome: 0 });
  assert.equal(noIncome.allocationRatio, null);
  assert.equal(noIncome.affordablePrice, null);
  assert.equal(noIncome.availablePayment, 0);
  const noRoom = result({ monthlyIncome: 5_000, monthlyDebts: 5_000 });
  assert.equal(noRoom.availablePayment, 0);
  assert.equal(noRoom.affordablePrice, noRoom.input.downPayment);
  assert.ok(noRoom.remainingIncome < 0);
});

test('larger down payments reduce installments and shorter terms reduce financing cost', () => {
  const baseline = result();
  const higherDown = result({ downPayment: 800_000 });
  const shorter = result({ years: 15 });
  assert.ok(higherDown.monthlyPayment < baseline.monthlyPayment);
  assert.ok(higherDown.totalFinanceCost < baseline.totalFinanceCost);
  assert.ok(shorter.monthlyPayment > baseline.monthlyPayment);
  assert.ok(shorter.totalFinanceCost < baseline.totalFinanceCost);
});

test('tiny positive rates and maximum permitted inputs remain finite', () => {
  for (const annualRate of [0, 1e-12, 1e-300, Number.MIN_VALUE, 30]) {
    const plan = result({ price: 1_000_000_000, downPayment: 0, annualRate, years: 40, monthlyIncome: 0.01 });
    for (const value of Object.values(plan)) if (typeof value === 'number') assert.ok(Number.isFinite(value));
    assert.equal(plan.annualSchedule[plan.annualSchedule.length - 1]?.closingBalance, 0);
  }
});

test('invalid bounds and non-finite numbers are rejected before calculation', () => {
  for (const overrides of [
    { price: 0 }, { price: 1_000_000_001 }, { downPayment: 2_000_001 }, { downPayment: -1 },
    { years: 0 }, { years: 40.5 }, { years: Infinity }, { annualRate: -1 }, { annualRate: 31 },
    { monthlyIncome: NaN }, { monthlyIncome: Number.MIN_VALUE }, { monthlyDebts: -100 }, { upfrontCosts: -1 },
    { monthlyCosts: Infinity }, { budgetShare: 0 }, { budgetShare: 101 },
  ]) assert.equal(calculateFinance({ ...DEFAULT_FINANCE_INPUTS, ...overrides }).ok, false, JSON.stringify(overrides));
  assert.equal(validateFinanceInputs(null).ok, false);
  assert.equal(validateFinanceInputs({}).ok, false);
});

test('Arabic and Persian amounts parse correctly while blanks and malformed text stay invalid', () => {
  assert.equal(parseFinanceNumber('١٬٢٥٠٬٠٠٠'), 1_250_000);
  assert.equal(parseFinanceNumber('۴٫۵'), 4.5);
  assert.equal(parseFinanceNumber(' 25,000 '), 25_000);
  assert.equal(parseFinanceNumber('0'), 0);
  for (const value of ['', ' ', '1e309', 'Infinity', '2.5.3', 'abc']) assert.equal(parseFinanceNumber(value), null);
  assert.equal(validateFinanceDraft({ ...financeDraft(DEFAULT_FINANCE_INPUTS), downPayment: '' }).ok, false);
});

test('only valid sale properties prefill purchase price and twenty-percent starting down payment', () => {
  assert.equal(getFinancePropertyPrefill({ purpose: 'للبيع', price: 1_780_000 })?.downPayment, 356_000);
  assert.equal(getFinancePropertyPrefill({ purpose: 'للبيع', price: 1_780_000 })?.price, 1_780_000);
  assert.equal(getFinancePropertyPrefill({ purpose: 'للإيجار', price: 155_000 }), null);
  assert.equal(getFinancePropertyPrefill({ purpose: 'للبيع', price: NaN }), null);
  assert.equal(getFinancePropertyPrefill(undefined), null);
});

test('saved scenarios validate contents, isolate two slots and ignore broken storage', () => {
  const a = { version: 1, slot: 'a', name: 'دفعة أولى', savedAt: '2026-10-12T12:00:00Z', input: DEFAULT_FINANCE_INPUTS };
  const b = { ...a, slot: 'b', name: 'مدة أقصر', input: { ...DEFAULT_FINANCE_INPUTS, years: 15 } };
  const restored = parseFinanceScenarios([null, a, b, { ...a, slot: 'c' }, { ...a, input: { ...DEFAULT_FINANCE_INPUTS, years: 0 } }]);
  assert.equal(restored.length, 2);
  assert.equal(restored[1].input.years, 15);
  assert.equal(parseFinanceScenarios([{ ...a, name: ' ' }]).length, 0);
  assert.equal(parseFinanceScenarios([{ ...a, savedAt: 'not-a-date' }]).length, 0);
  assert.deepEqual(parseFinanceScenarios('invalid'), []);
  const updated = parseFinanceScenarios([a, { ...a, name: 'محدّث' }]);
  assert.equal(updated.length, 1);
  assert.equal(updated[0].name, 'محدّث');
});
