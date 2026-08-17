import { useState, useEffect } from 'react';
import { Stat, Field } from '../tool-ui';
import type { Tool } from '../catalog';
import { useT, type Language } from '../i18n';

const S = {
  en: {
    homePrice: 'Home price',
    downPayment: 'Down payment',
    interestRate: 'Interest rate',
    loanTerm: 'Loan term',
    yrs: ' yrs',
    monthlyPayment: 'Monthly payment',
    totalInterest: 'Total interest',
    overYears: 'Over {years} years',
    loanAmount: 'Loan amount',
    totalPaid: 'Total paid',
    term: 'Term',
    principal: 'Principal',
    years: 'Years',
    type: 'Type',
    simple: 'Simple',
    compoundMonthly: 'Compound (monthly)',
    compoundDaily: 'Compound (daily)',
    interestEarned: 'Interest earned',
    totalValue: 'Total value',
    initialDeposit: 'Initial deposit',
    monthlyContribution: 'Monthly contribution',
    annualReturn: 'Annual return',
    finalBalance: 'Final balance',
    youContribute: 'You contribute',
    amount: 'Amount',
    from: 'From',
    to: 'To',
    rates: 'Rates',
    live: 'live',
    approximate: 'approximate',
    annualGrossSalary: 'Annual gross salary',
    federalTaxRate: 'Federal tax rate',
    stateLocalTaxRate: 'State/local tax rate',
    takeHomeAnnual: 'Take-home (annual)',
    monthlyNet: 'Monthly net',
    totalTax: 'Total tax',
    effectiveRate: 'Effective rate',
    initialInvestment: 'Initial investment',
    finalValue: 'Final value',
    totalRoi: 'Total ROI',
    annualized: 'Annualized',
    netGain: 'Net gain',
    xPercentOfY: 'X% of Y',
    xIsWhatPercentOfY: 'X is what % of Y',
    percentChange: '% change',
    fromValue: 'From value',
    toValue: 'To value',
    valueA: 'Value A',
    valueB: 'Value B',
  },
  pt: {
    homePrice: 'Preço do imóvel',
    downPayment: 'Entrada',
    interestRate: 'Taxa de juros',
    loanTerm: 'Prazo do empréstimo',
    yrs: ' anos',
    monthlyPayment: 'Pagamento mensal',
    totalInterest: 'Juros totais',
    overYears: 'Em {years} anos',
    loanAmount: 'Valor do empréstimo',
    totalPaid: 'Total pago',
    term: 'Prazo',
    principal: 'Principal',
    years: 'Anos',
    type: 'Tipo',
    simple: 'Simples',
    compoundMonthly: 'Composto (mensal)',
    compoundDaily: 'Composto (diário)',
    interestEarned: 'Juros ganhos',
    totalValue: 'Valor total',
    initialDeposit: 'Depósito inicial',
    monthlyContribution: 'Aporte mensal',
    annualReturn: 'Retorno anual',
    finalBalance: 'Saldo final',
    youContribute: 'Você contribui',
    amount: 'Valor',
    from: 'De',
    to: 'Para',
    rates: 'Taxas',
    live: 'ao vivo',
    approximate: 'aproximado',
    annualGrossSalary: 'Salário bruto anual',
    federalTaxRate: 'Taxa de imposto federal',
    stateLocalTaxRate: 'Taxa de imposto estadual/local',
    takeHomeAnnual: 'Líquido (anual)',
    monthlyNet: 'Líquido mensal',
    totalTax: 'Imposto total',
    effectiveRate: 'Taxa efetiva',
    initialInvestment: 'Investimento inicial',
    finalValue: 'Valor final',
    totalRoi: 'ROI total',
    annualized: 'Anualizado',
    netGain: 'Ganho líquido',
    xPercentOfY: 'X% de Y',
    xIsWhatPercentOfY: 'X é que % de Y',
    percentChange: '% variação',
    fromValue: 'De valor',
    toValue: 'Para valor',
    valueA: 'Valor A',
    valueB: 'Valor B',
  },
  es: {
    homePrice: 'Precio de la vivienda',
    downPayment: 'Pago inicial',
    interestRate: 'Tasa de interés',
    loanTerm: 'Plazo del préstamo',
    yrs: ' años',
    monthlyPayment: 'Pago mensual',
    totalInterest: 'Intereses totales',
    overYears: 'En {years} años',
    loanAmount: 'Monto del préstamo',
    totalPaid: 'Total pagado',
    term: 'Plazo',
    principal: 'Principal',
    years: 'Años',
    type: 'Tipo',
    simple: 'Simple',
    compoundMonthly: 'Compuesto (mensual)',
    compoundDaily: 'Compuesto (diario)',
    interestEarned: 'Intereses ganados',
    totalValue: 'Valor total',
    initialDeposit: 'Depósito inicial',
    monthlyContribution: 'Aporte mensual',
    annualReturn: 'Retorno anual',
    finalBalance: 'Saldo final',
    youContribute: 'Tú aportas',
    amount: 'Cantidad',
    from: 'De',
    to: 'A',
    rates: 'Tasas',
    live: 'en vivo',
    approximate: 'aproximado',
    annualGrossSalary: 'Salario bruto anual',
    federalTaxRate: 'Tasa de impuesto federal',
    stateLocalTaxRate: 'Tasa de impuesto estatal/local',
    takeHomeAnnual: 'Neto (anual)',
    monthlyNet: 'Neto mensual',
    totalTax: 'Impuesto total',
    effectiveRate: 'Tasa efectiva',
    initialInvestment: 'Inversión inicial',
    finalValue: 'Valor final',
    totalRoi: 'ROI total',
    annualized: 'Anualizado',
    netGain: 'Ganancia neta',
    xPercentOfY: 'X% de Y',
    xIsWhatPercentOfY: 'X es qué % de Y',
    percentChange: '% cambio',
    fromValue: 'De valor',
    toValue: 'A valor',
    valueA: 'Valor A',
    valueB: 'Valor B',
  },
  de: {
    homePrice: 'Hauspreis',
    downPayment: 'Anzahlung',
    interestRate: 'Zinssatz',
    loanTerm: 'Kreditlaufzeit',
    yrs: ' J.',
    monthlyPayment: 'Monatliche Zahlung',
    totalInterest: 'Zinsgesamt',
    overYears: 'Über {years} Jahre',
    loanAmount: 'Darlehensbetrag',
    totalPaid: 'Gesamt gezahlt',
    term: 'Laufzeit',
    principal: 'Kapital',
    years: 'Jahre',
    type: 'Typ',
    simple: 'Einfach',
    compoundMonthly: 'Zinseszins (monatlich)',
    compoundDaily: 'Zinseszins (täglich)',
    interestEarned: 'Zinsertrag',
    totalValue: 'Gesamtwert',
    initialDeposit: 'Ersteinlage',
    monthlyContribution: 'Monatlicher Beitrag',
    annualReturn: 'Jahresrendite',
    finalBalance: 'Endguthaben',
    youContribute: 'Sie tragen bei',
    amount: 'Betrag',
    from: 'Von',
    to: 'Nach',
    rates: 'Kurse',
    live: 'live',
    approximate: 'ungefähr',
    annualGrossSalary: 'Bruttojahresgehalt',
    federalTaxRate: 'Bundessteuersatz',
    stateLocalTaxRate: 'Landes-/Lokalsteuersatz',
    takeHomeAnnual: 'Netto (jährlich)',
    monthlyNet: 'Monatliches Netto',
    totalTax: 'Gesamtsteuer',
    effectiveRate: 'Effektivsatz',
    initialInvestment: 'Ersteinvestition',
    finalValue: 'Endwert',
    totalRoi: 'Gesamt-ROI',
    annualized: 'Jährlich',
    netGain: 'Nettogewinn',
    xPercentOfY: 'X% von Y',
    xIsWhatPercentOfY: 'X ist wie viel % von Y',
    percentChange: '% Änderung',
    fromValue: 'Von Wert',
    toValue: 'Nach Wert',
    valueA: 'Wert A',
    valueB: 'Wert B',
  },
} satisfies Record<Language, Record<string, string>>;

function money(n: number) {
  return n.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
}

export function Mortgage(_: { tool: Tool }) {
  const t = useT(S);
  const [price, setPrice] = useState(400000);
  const [down, setDown] = useState(80000);
  const [rate, setRate] = useState(6.5);
  const [years, setYears] = useState(30);
  const principal = Math.max(0, price - down);
  const r = rate / 100 / 12;
  const n = years * 12;
  const monthly = r > 0 ? (principal * r) / (1 - Math.pow(1 + r, -n)) : principal / n;
  const total = monthly * n;
  const interest = total - principal;
  return (
    <CalcGrid
      left={
        <>
          <NumField label={t.homePrice} value={price} onChange={setPrice} prefix="$" />
          <NumField label={t.downPayment} value={down} onChange={setDown} prefix="$" />
          <NumField label={t.interestRate} value={rate} onChange={setRate} suffix="%" step={0.05} />
          <NumField label={t.loanTerm} value={years} onChange={setYears} suffix={t.yrs} />
        </>
      }
      right={
        <>
          <div className="grid grid-cols-2 gap-3">
            <Stat label={t.monthlyPayment} value={money(monthly)} />
            <Stat label={t.totalInterest} value={money(interest)} hint={t.overYears.replace('{years}', String(years))} />
            <Stat label={t.loanAmount} value={money(principal)} />
            <Stat label={t.totalPaid} value={money(total)} />
          </div>
        </>
      }
    />
  );
}

export function Loan(_: { tool: Tool }) {
  const t = useT(S);
  const [amount, setAmount] = useState(25000);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(5);
  const r = rate / 100 / 12;
  const n = years * 12;
  const monthly = r > 0 ? (amount * r) / (1 - Math.pow(1 + r, -n)) : amount / n;
  const total = monthly * n;
  return (
    <CalcGrid
      left={
        <>
          <NumField label={t.loanAmount} value={amount} onChange={setAmount} prefix="$" />
          <NumField label={t.interestRate} value={rate} onChange={setRate} suffix="%" step={0.05} />
          <NumField label={t.term} value={years} onChange={setYears} suffix={t.yrs} />
        </>
      }
      right={
        <div className="grid grid-cols-2 gap-3">
          <Stat label={t.monthlyPayment} value={money(monthly)} />
          <Stat label={t.totalInterest} value={money(total - amount)} />
          <Stat label={t.totalPaid} value={money(total)} />
        </div>
      }
    />
  );
}

export function Interest(_: { tool: Tool }) {
  const t = useT(S);
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(5);
  const [years, setYears] = useState(5);
  const [compound, setCompound] = useState<'simple' | 'monthly' | 'daily'>('monthly');
  const simple = principal * (rate / 100) * years;
  const freq = compound === 'simple' ? 0 : compound === 'monthly' ? 12 : 365;
  const compoundAmt = freq > 0 ? principal * Math.pow(1 + rate / 100 / freq, freq * years) - principal : simple;
  const useAmt = compound === 'simple' ? simple : compoundAmt;
  return (
    <CalcGrid
      left={
        <>
          <NumField label={t.principal} value={principal} onChange={setPrincipal} prefix="$" />
          <NumField label={t.interestRate} value={rate} onChange={setRate} suffix="%" step={0.05} />
          <NumField label={t.years} value={years} onChange={setYears} />
          <Field label={t.type}>
            <select className="input" value={compound} onChange={(e) => setCompound(e.target.value as any)}>
              <option value="simple">{t.simple}</option>
              <option value="monthly">{t.compoundMonthly}</option>
              <option value="daily">{t.compoundDaily}</option>
            </select>
          </Field>
        </>
      }
      right={
        <div className="grid grid-cols-2 gap-3">
          <Stat label={t.interestEarned} value={money(useAmt)} />
          <Stat label={t.totalValue} value={money(principal + useAmt)} />
        </div>
      }
    />
  );
}

export function Savings(_: { tool: Tool }) {
  const t = useT(S);
  const [initial, setInitial] = useState(5000);
  const [monthly, setMonthly] = useState(200);
  const [rate, setRate] = useState(4);
  const [years, setYears] = useState(10);
  const r = rate / 100 / 12;
  const n = years * 12;
  const fvInitial = initial * Math.pow(1 + r, n);
  const fvMonthly = r > 0 ? (monthly * (Math.pow(1 + r, n) - 1)) / r : monthly * n;
  const total = fvInitial + fvMonthly;
  const contributed = initial + monthly * n;
  return (
    <CalcGrid
      left={
        <>
          <NumField label={t.initialDeposit} value={initial} onChange={setInitial} prefix="$" />
          <NumField label={t.monthlyContribution} value={monthly} onChange={setMonthly} prefix="$" />
          <NumField label={t.annualReturn} value={rate} onChange={setRate} suffix="%" step={0.05} />
          <NumField label={t.years} value={years} onChange={setYears} />
        </>
      }
      right={
        <div className="grid grid-cols-2 gap-3">
          <Stat label={t.finalBalance} value={money(total)} />
          <Stat label={t.interestEarned} value={money(total - contributed)} />
          <Stat label={t.youContribute} value={money(contributed)} />
        </div>
      }
    />
  );
}

const FALLBACK_RATES: Record<string, number> = {
  USD: 1, EUR: 0.92, GBP: 0.79, JPY: 157.3, AUD: 1.52, CAD: 1.36, CHF: 0.88, CNY: 7.24, INR: 83.5, MXN: 18.2, BRL: 5.4, ZAR: 18.6, KRW: 1370, SGD: 1.35, NZD: 1.64, HKD: 7.81,
};
const CURRENCIES = Object.keys(FALLBACK_RATES);

export function CurrencyConverter(_: { tool: Tool }) {
  const t = useT(S);
  const [amount, setAmount] = useState(100);
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('EUR');
  const [rates, setRates] = useState<Record<string, number>>(FALLBACK_RATES);
  const [updated, setUpdated] = useState('approximate');

  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/USD')
      .then((r) => r.json())
      .then((d) => {
        if (d && d.rates) {
          const merged = { ...FALLBACK_RATES, ...d.rates, USD: 1 };
          setRates(merged);
          setUpdated(d.time_last_update_utc ? 'live' : 'approximate');
        }
      })
      .catch(() => {});
  }, []);

  const usd = amount / (rates[from] ?? 1);
  const out = usd * (rates[to] ?? 1);

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        <NumField label={t.amount} value={amount} onChange={setAmount} />
        <Field label={t.from}>
          <select className="input" value={from} onChange={(e) => setFrom(e.target.value)}>
            {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field label={t.to}>
          <select className="input" value={to} onChange={(e) => setTo(e.target.value)}>
            {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
      </div>
      <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-accent-600 p-6 text-white text-center">
        <p className="text-sm/none opacity-80">{amount} {from} =</p>
        <p className="mt-2 font-display text-4xl font-bold">{out.toLocaleString(undefined, { maximumFractionDigits: 2 })} {to}</p>
        <p className="mt-2 text-xs opacity-70">{t.rates}: {updated === 'live' ? t.live : t.approximate} · 1 {from} = {(rates[to] / (rates[from] || 1)).toFixed(4)} {to}</p>
      </div>
    </div>
  );
}

export function SalaryTax(_: { tool: Tool }) {
  const t = useT(S);
  const [gross, setGross] = useState(75000);
  const [rate, setRate] = useState(22);
  const [stateRate, setStateRate] = useState(5);
  const tax = gross * ((rate + stateRate) / 100);
  const net = gross - tax;
  return (
    <CalcGrid
      left={
        <>
          <NumField label={t.annualGrossSalary} value={gross} onChange={setGross} prefix="$" />
          <NumField label={t.federalTaxRate} value={rate} onChange={setRate} suffix="%" step={0.5} />
          <NumField label={t.stateLocalTaxRate} value={stateRate} onChange={setStateRate} suffix="%" step={0.5} />
        </>
      }
      right={
        <div className="grid grid-cols-2 gap-3">
          <Stat label={t.takeHomeAnnual} value={money(net)} />
          <Stat label={t.monthlyNet} value={money(net / 12)} />
          <Stat label={t.totalTax} value={money(tax)} />
          <Stat label={t.effectiveRate} value={`${(rate + stateRate).toFixed(1)}%`} />
        </div>
      }
    />
  );
}

export function Roi(_: { tool: Tool }) {
  const t = useT(S);
  const [cost, setCost] = useState(10000);
  const [gain, setGain] = useState(13500);
  const [years, setYears] = useState(3);
  const roi = ((gain - cost) / cost) * 100;
  const annual = (Math.pow(gain / cost, 1 / years) - 1) * 100;
  return (
    <CalcGrid
      left={
        <>
          <NumField label={t.initialInvestment} value={cost} onChange={setCost} prefix="$" />
          <NumField label={t.finalValue} value={gain} onChange={setGain} prefix="$" />
          <NumField label={t.years} value={years} onChange={setYears} />
        </>
      }
      right={
        <div className="grid grid-cols-2 gap-3">
          <Stat label={t.totalRoi} value={`${roi.toFixed(1)}%`} />
          <Stat label={t.annualized} value={`${annual.toFixed(1)}%`} />
          <Stat label={t.netGain} value={money(gain - cost)} />
        </div>
      }
    />
  );
}

export function Percentage(_: { tool: Tool }) {
  const t = useT(S);
  const [mode, setMode] = useState<'of' | 'isWhat' | 'change'>('of');
  const [a, setA] = useState(20);
  const [b, setB] = useState(150);
  const result =
    mode === 'of' ? (a / 100) * b :
    mode === 'isWhat' ? (a / b) * 100 :
    ((b - a) / a) * 100;
  const label =
    mode === 'of' ? `${a}% of ${b}` :
    mode === 'isWhat' ? `${a} is what % of ${b}` :
    `% change from ${a} to ${b}`;
  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {([['of', t.xPercentOfY], ['isWhat', t.xIsWhatPercentOfY], ['change', t.percentChange]] as const).map(([m, l]) => (
          <button key={m} onClick={() => setMode(m)} className={mode === m ? 'btn-primary' : 'btn-secondary'}>{l}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <NumField label={mode === 'change' ? t.fromValue : t.valueA} value={a} onChange={setA} />
        <NumField label={mode === 'change' ? t.toValue : t.valueB} value={b} onChange={setB} />
      </div>
      <div className="rounded-2xl bg-brand-600 p-6 text-center text-white">
        <p className="text-sm opacity-80">{label}</p>
        <p className="mt-2 font-display text-3xl font-bold">{result.toFixed(2)}{mode === 'of' ? '' : '%'}</p>
      </div>
    </div>
  );
}

// --- shared calc primitives ---
function CalcGrid({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="space-y-4">{left}</div>
      <div>{right}</div>
    </div>
  );
}

function NumField({
  label, value, onChange, prefix, suffix, step,
}: {
  label: string; value: number; onChange: (n: number) => void; prefix?: string; suffix?: string; step?: number;
}) {
  return (
    <Field label={label}>
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{prefix}</span>}
        <input
          type="number"
          className={`input ${prefix ? 'pl-7' : ''} ${suffix ? 'pr-12' : ''}`}
          value={value}
          step={step ?? 1}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">{suffix}</span>}
      </div>
    </Field>
  );
}
