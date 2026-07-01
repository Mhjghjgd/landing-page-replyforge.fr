"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const GOLD = "#d4a574";
const GOLD_DIM = "#a77e3a";
const COLORS_STAR = ["#ef4444", "#f97316", "#eab308", "#84cc16", "#22c55e"];
const SURFACE = "#1a1814";
const BORDER = "rgba(212,165,116,0.15)";

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
      <h3 className="font-display text-lg text-[var(--color-foreground)] mb-5">{title}</h3>
      {children}
    </div>
  );
}

export interface RatingPoint {
  label: string;
  avg: number;
}

export interface VolumePoint {
  label: string;
  count: number;
}

export interface StarDist {
  star: number;
  count: number;
}

export interface LangDist {
  lang: string;
  count: number;
}

export interface StatsData {
  ratingTrend: RatingPoint[];
  volumeTrend: VolumePoint[];
  starDist: StarDist[];
  langDist: LangDist[];
  responseRate: number;
  avgResponseHours: number | null;
  totalReviews: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-[12px] shadow-lg">
      <p className="text-[var(--color-foreground-muted)] mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color ?? GOLD }} className="font-medium">
          {p.name}: {typeof p.value === "number" && p.value % 1 !== 0 ? p.value.toFixed(2) : p.value}
          {p.name === "Note moyenne" ? " ★" : ""}
        </p>
      ))}
    </div>
  );
};

export function RatingTrendChart({ data }: { data: RatingPoint[] }) {
  return (
    <ChartCard title="Évolution de la note">
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={BORDER} vertical={false} />
          <XAxis dataKey="label" tick={{ fill: "#9a8a7a", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis domain={[1, 5]} tick={{ fill: "#9a8a7a", fontSize: 11 }} axisLine={false} tickLine={false} ticks={[1, 2, 3, 4, 5]} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: BORDER }} />
          <Line
            type="monotone"
            dataKey="avg"
            name="Note moyenne"
            stroke={GOLD}
            strokeWidth={2}
            dot={{ fill: GOLD, strokeWidth: 0, r: 3 }}
            activeDot={{ fill: GOLD, r: 5, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function VolumeTrendChart({ data }: { data: VolumePoint[] }) {
  return (
    <ChartCard title="Volume d'avis">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={BORDER} vertical={false} />
          <XAxis dataKey="label" tick={{ fill: "#9a8a7a", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} tick={{ fill: "#9a8a7a", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(212,165,116,0.05)" }} />
          <Bar dataKey="count" name="Avis" fill={GOLD_DIM} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function StarDistChart({ data }: { data: StarDist[] }) {
  return (
    <ChartCard title="Répartition des notes">
      <div className="space-y-2.5">
        {[5, 4, 3, 2, 1].map((star) => {
          const entry = data.find((d) => d.star === star);
          const count = entry?.count ?? 0;
          const total = data.reduce((s, d) => s + d.count, 0);
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <div key={star} className="flex items-center gap-3">
              <span className="w-10 text-[12px] text-[var(--color-foreground-muted)] shrink-0">{star} ★</span>
              <div className="flex-1 h-2 rounded-full bg-[var(--color-surface-elevated)] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, backgroundColor: COLORS_STAR[star - 1] }}
                />
              </div>
              <span className="w-8 text-right text-[12px] text-[var(--color-foreground-muted)] shrink-0">{count}</span>
            </div>
          );
        })}
      </div>
    </ChartCard>
  );
}

export function LangDistChart({ data }: { data: LangDist[] }) {
  const PALETTE = [GOLD, "#6366f1", "#22c55e", "#f97316", "#ec4899"];
  const total = data.reduce((s, d) => s + d.count, 0);
  return (
    <ChartCard title="Langues des avis">
      <div className="flex items-center gap-6">
        <ResponsiveContainer width={140} height={140}>
          <PieChart>
            <Pie data={data} dataKey="count" nameKey="lang" cx="50%" cy="50%" innerRadius={40} outerRadius={64} paddingAngle={2}>
              {data.map((_, i) => (
                <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: unknown, name: unknown) => [`${value} avis`, String(name)]}
              contentStyle={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-col gap-2">
          {data.map((d, i) => (
            <div key={d.lang} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: PALETTE[i % PALETTE.length] }} />
              <span className="text-[12px] text-[var(--color-foreground-muted)]">
                {d.lang} — {total > 0 ? Math.round((d.count / total) * 100) : 0}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </ChartCard>
  );
}

export function ResponseRateCard({ rate, avgHours }: { rate: number; avgHours: number | null }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <h3 className="font-display text-lg text-[var(--color-foreground)] mb-4">Taux de réponse</h3>
        <div className="flex items-end gap-2 mb-4">
          <span className="font-display text-5xl text-[var(--color-gold-400)]">{rate}</span>
          <span className="text-[18px] text-[var(--color-foreground-muted)] pb-1">%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-[var(--color-surface-elevated)] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${rate}%`, backgroundColor: GOLD }}
          />
        </div>
        <p className="mt-2 text-[11px] text-[var(--color-foreground-muted)]">
          Avis avec réponse publiée sur le total
        </p>
      </div>

      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <h3 className="font-display text-lg text-[var(--color-foreground)] mb-4">Temps de réponse moyen</h3>
        {avgHours !== null ? (
          <>
            <div className="flex items-end gap-2 mb-1">
              <span className="font-display text-5xl text-[var(--color-gold-400)]">
                {avgHours < 1 ? Math.round(avgHours * 60) : Math.round(avgHours)}
              </span>
              <span className="text-[18px] text-[var(--color-foreground-muted)] pb-1">
                {avgHours < 1 ? "min" : "h"}
              </span>
            </div>
            <p className="text-[11px] text-[var(--color-foreground-muted)]">
              Entre réception de l&apos;avis et publication de la réponse
            </p>
          </>
        ) : (
          <p className="text-[13px] text-[var(--color-foreground-muted)]">
            Pas encore de réponses publiées avec horodatage complet.
          </p>
        )}
      </div>
    </div>
  );
}
