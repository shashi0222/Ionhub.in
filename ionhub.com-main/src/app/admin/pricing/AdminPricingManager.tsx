'use client';

import React, { useState } from 'react';
import { 
  IroningPricingConfig, 
  SubscriptionPlan, 
  AdminPricingStats, 
  AuditLog 
} from '@/types/database';
import { adminUpdateIroningConfig, adminUpdateSubscriptionPlan } from '@/app/actions/admin';
import { 
  Tag, 
  Gift, 
  Zap, 
  Bike, 
  TrendingUp, 
  Save, 
  Check, 
  AlertCircle, 
  History, 
  Loader2, 
  ShieldCheck,
  CheckCircle2,
  Users,
  Shirt
} from 'lucide-react';

interface AdminPricingManagerProps {
  initialConfig: IroningPricingConfig;
  initialPlans: SubscriptionPlan[];
  stats: AdminPricingStats;
  auditLogs: AuditLog[];
}

export function AdminPricingManager({
  initialConfig,
  initialPlans,
  stats,
  auditLogs,
}: AdminPricingManagerProps) {
  const [config, setConfig] = useState<IroningPricingConfig>(initialConfig);
  const [plans, setPlans] = useState<SubscriptionPlan[]>(initialPlans);
  const [savingConfig, setSavingConfig] = useState(false);
  const [savingPlanId, setSavingPlanId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Save General Ironing Config
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingConfig(true);
    setMessage(null);

    const res = await adminUpdateIroningConfig(config as unknown as Record<string, unknown>);
    setSavingConfig(false);

    if (res?.error) {
      setMessage({ type: 'error', text: res.error });
    } else {
      setMessage({ type: 'success', text: 'Ironing pricing and promotional rules updated successfully!' });
    }
  };

  // Save specific subscription plan
  const handleSavePlan = async (plan: SubscriptionPlan) => {
    setSavingPlanId(plan.id);
    setMessage(null);

    const res = await adminUpdateSubscriptionPlan(plan.id, plan as unknown as Record<string, unknown>);
    setSavingPlanId(null);

    if (res?.error) {
      setMessage({ type: 'error', text: res.error });
    } else {
      setMessage({ type: 'success', text: `Plan "${plan.name}" updated successfully!` });
    }
  };

  return (
    <div className="space-y-10">
      
      {/* Alert banner */}
      {message && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center justify-between ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="text-xs opacity-60 hover:opacity-100">
            ✕
          </button>
        </div>
      )}

      {/* 1. ACTUAL LIVE DATABASE METRICS */}
      <div className="space-y-3">
        <h3 className="text-sm font-black text-[#12312C] uppercase tracking-wider flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#3E8E4A]" />
          <span>Live Operations & Revenue Analytics (Real DB Records)</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-[#E0EBDD] shadow-soft">
            <span className="text-[11px] font-bold text-[#5A7065] uppercase block">
              Active Subscribers
            </span>
            <span className="text-3xl font-black text-[#0B4F47] block mt-1">
              {stats.activeSubscribersByPlan.total}
            </span>
            <span className="text-[10px] text-[#5A7065] block mt-0.5">
              Starter: {stats.activeSubscribersByPlan.starter} | Std: {stats.activeSubscribersByPlan.standard} | Prem: {stats.activeSubscribersByPlan.premium}
            </span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-[#E0EBDD] shadow-soft">
            <span className="text-[11px] font-bold text-[#5A7065] uppercase block">
              Monthly Sub Revenue
            </span>
            <span className="text-3xl font-black text-[#3E8E4A] block mt-1">
              ₹{stats.monthlySubscriptionRevenue}
            </span>
            <span className="text-[10px] text-[#5A7065] block mt-0.5">
              Active recurring revenue
            </span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-[#E0EBDD] shadow-soft">
            <span className="text-[11px] font-bold text-[#5A7065] uppercase block">
              Ironing Orders & Rev
            </span>
            <span className="text-3xl font-black text-[#12312C] block mt-1">
              {stats.totalIroningOrders}
            </span>
            <span className="text-[10px] text-[#0B4F47] font-bold block mt-0.5">
              Revenue: ₹{stats.ironingOrderRevenue}
            </span>
          </div>

          <div className="p-5 rounded-3xl bg-[#EAF5E8] border border-[#3E8E4A]/30 shadow-soft">
            <span className="text-[11px] font-black text-[#0B4F47] uppercase block">
              Free Rewards Claimed
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-[#0B4F47]">
                {stats.totalFreeRewardsRedeemed}
              </span>
              <span className="text-xs text-[#5A7065] font-semibold">
                / {stats.totalFreeRewardsEarned} earned
              </span>
            </div>
            <span className="text-[10px] text-[#3E8E4A] font-bold block mt-0.5">
              Failed/Refunds: {stats.refundsAndFailedCount}
            </span>
          </div>
        </div>
      </div>

      {/* 2. EDITABLE CONFIGURATION FORM */}
      <form onSubmit={handleSaveConfig} className="space-y-8">
        
        {/* SECTION A: PER-ORDER PRICING */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E0EBDD] shadow-soft space-y-6">
          <div className="flex items-center gap-3 border-b border-[#E0EBDD]/70 pb-4">
            <div className="w-10 h-10 rounded-xl bg-[#EAF5E8] text-[#0B4F47] flex items-center justify-center">
              <Tag className="w-5 h-5 text-[#3E8E4A]" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#12312C]">1. Per-Order Ironing Pricing</h3>
              <p className="text-xs text-[#5A7065]">
                Configure unit price and business definition of what constitutes a pair.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#12312C] uppercase mb-1">
                Price Per Pair (₹)
              </label>
              <input
                type="number"
                min="1"
                required
                value={config.price_per_pair}
                onChange={(e) => setConfig({ ...config, price_per_pair: parseFloat(e.target.value) || 25 })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E0EBDD] bg-[#FAF9F2] text-sm font-bold text-[#0B4F47]"
              />
              <span className="text-[10px] text-[#5A7065] mt-1 block">Default: ₹25 per pair</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#12312C] uppercase mb-1">
                Pricing Unit Label
              </label>
              <input
                type="text"
                required
                value={config.pair_unit_name}
                onChange={(e) => setConfig({ ...config, pair_unit_name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E0EBDD] bg-[#FAF9F2] text-xs font-semibold"
              />
              <span className="text-[10px] text-[#5A7065] mt-1 block">Displayed on website & booking forms</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#12312C] uppercase mb-1">
                Overage Price Per Garment (₹)
              </label>
              <input
                type="number"
                min="1"
                required
                value={config.overage_price_per_garment}
                onChange={(e) => setConfig({ ...config, overage_price_per_garment: parseFloat(e.target.value) || 15 })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E0EBDD] bg-[#FAF9F2] text-sm font-bold text-[#0B4F47]"
              />
              <span className="text-[10px] text-[#5A7065] mt-1 block">When customer exceeds subscription</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#12312C] uppercase mb-1">
              Business Definition of a Pair
            </label>
            <textarea
              rows={2}
              value={config.pair_definition}
              onChange={(e) => setConfig({ ...config, pair_definition: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E0EBDD] bg-[#FAF9F2] text-xs font-medium"
            />
            <span className="text-[10px] text-[#5A7065] mt-0.5 block italic">
              * Business policy definition preventing silent conversion into individual garments.
            </span>
          </div>
        </div>

        {/* SECTION B: PROMOTIONAL OFFER — EVERY 5TH ORDER FREE */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E0EBDD] shadow-soft space-y-6">
          <div className="flex items-center gap-3 border-b border-[#E0EBDD]/70 pb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
              <Gift className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#12312C]">2. Promotional Offer — Every 5th Order FREE</h3>
              <p className="text-xs text-[#5A7065]">
                "Place 4 eligible paid ironing orders, and your 5th eligible ironing order is FREE!"
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#12312C] uppercase mb-1">
                Eligible Paid Orders Required
              </label>
              <input
                type="number"
                min="1"
                required
                value={config.free_order_threshold}
                onChange={(e) => setConfig({ ...config, free_order_threshold: parseInt(e.target.value) || 4 })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E0EBDD] bg-[#FAF9F2] text-sm font-black text-[#0B4F47]"
              />
              <span className="text-[10px] text-[#5A7065] mt-1 block">Default: 4 orders</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#12312C] uppercase mb-1">
                Reward Validity (Days)
              </label>
              <input
                type="number"
                min="1"
                required
                value={config.free_order_validity_days}
                onChange={(e) => setConfig({ ...config, free_order_validity_days: parseInt(e.target.value) || 30 })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E0EBDD] bg-[#FAF9F2] text-sm font-semibold"
              />
              <span className="text-[10px] text-[#5A7065] mt-1 block">Default: 30 days</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#12312C] uppercase mb-1">
                Promotion Status
              </label>
              <select
                value={config.free_order_enabled ? 'true' : 'false'}
                onChange={(e) => setConfig({ ...config, free_order_enabled: e.target.value === 'true' })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E0EBDD] bg-[#FAF9F2] text-xs font-bold text-[#0B4F47]"
              >
                <option value="true">Enabled (Active)</option>
                <option value="false">Disabled (Paused)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#12312C] uppercase mb-1">
                Combine with Subscription?
              </label>
              <select
                value={config.allow_combine_subscription_and_reward ? 'true' : 'false'}
                onChange={(e) => setConfig({ ...config, allow_combine_subscription_and_reward: e.target.value === 'true' })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E0EBDD] bg-[#FAF9F2] text-xs font-bold text-[#12312C]"
              >
                <option value="false">Disallow (Separate)</option>
                <option value="true">Allow Combining</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION C: WORKER PAYOUT MODEL */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E0EBDD] shadow-soft space-y-6">
          <div className="flex items-center gap-3 border-b border-[#E0EBDD]/70 pb-4">
            <div className="w-10 h-10 rounded-xl bg-[#EAF5E8] text-[#0B4F47] flex items-center justify-center">
              <Bike className="w-5 h-5 text-[#3E8E4A]" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#12312C]">3. Worker Payout Model</h3>
              <p className="text-xs text-[#5A7065]">
                Independent payout calculation ensuring workers receive compensation regardless of customer discounts.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#12312C] uppercase mb-1">
                Base Payout Per Order (₹)
              </label>
              <input
                type="number"
                min="0"
                required
                value={config.worker_base_payout}
                onChange={(e) => setConfig({ ...config, worker_base_payout: parseFloat(e.target.value) || 20 })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E0EBDD] bg-[#FAF9F2] text-sm font-bold text-[#0B4F47]"
              />
              <span className="text-[10px] text-[#5A7065] mt-1 block">Base callout fee for specialist</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#12312C] uppercase mb-1">
                Worker Payout Per Pair (₹)
              </label>
              <input
                type="number"
                min="0"
                required
                value={config.worker_payout_per_pair}
                onChange={(e) => setConfig({ ...config, worker_payout_per_pair: parseFloat(e.target.value) || 15 })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E0EBDD] bg-[#FAF9F2] text-sm font-bold text-[#0B4F47]"
              />
              <span className="text-[10px] text-[#5A7065] mt-1 block">Volume pressing commission</span>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={savingConfig}
              className="px-6 py-3 rounded-xl bg-[#0B4F47] hover:bg-[#176B5D] text-white font-extrabold text-xs shadow-md transition flex items-center gap-2 disabled:opacity-50"
            >
              {savingConfig ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Configuration...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save General Pricing & Rules</span>
                </>
              )}
            </button>
          </div>
        </div>

      </form>

      {/* SECTION D: MONTHLY SUBSCRIPTION PLANS MANAGEMENT */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E0EBDD] shadow-soft space-y-6">
        <div className="flex items-center gap-3 border-b border-[#E0EBDD]/70 pb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-900 flex items-center justify-center">
            <Zap className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-black text-[#12312C]">4. Monthly Subscription Plans Management</h3>
            <p className="text-xs text-[#5A7065]">
              Configure exact allowances, prices, and Premium plan type (fixed vs unlimited).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p, idx) => {
            return (
              <div
                key={p.id}
                className="p-5 rounded-2xl bg-[#FAF9F2] border border-[#E0EBDD] space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-black text-[#0B4F47]">
                    Plan {p.slug.toUpperCase()}: {p.name}
                  </h4>
                  <span className="text-[10px] font-bold uppercase bg-white border border-[#E0EBDD] px-2 py-0.5 rounded-full">
                    {p.slug}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-[#12312C] mb-1">
                      Monthly Price (₹)
                    </label>
                    <input
                      type="number"
                      value={p.monthly_price}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        const copy = [...plans];
                        copy[idx].monthly_price = val;
                        setPlans(copy);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-[#E0EBDD] bg-white font-black text-[#0B4F47]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#12312C] mb-1">
                      Included Garment Allowance
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={p.garment_allowance}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        const copy = [...plans];
                        copy[idx].garment_allowance = val;
                        setPlans(copy);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-[#E0EBDD] bg-white font-bold"
                    />
                  </div>

                  {/* Premium specific: Fixed or Unlimited */}
                  {p.slug === 'premium' && (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
                      <label className="block text-[11px] font-black text-amber-900 uppercase">
                        Premium Allowance Type:
                      </label>
                      <select
                        value={p.allowance_type}
                        onChange={(e) => {
                          const val = e.target.value as 'fixed' | 'unlimited';
                          const copy = [...plans];
                          copy[idx].allowance_type = val;
                          setPlans(copy);
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-amber-300 bg-white font-bold text-xs"
                      >
                        <option value="fixed">Fixed Allowance ({p.garment_allowance} Garments)</option>
                        <option value="unlimited">Unlimited Garments</option>
                      </select>
                      <p className="text-[10px] text-amber-800 italic">
                        * Strict requirement: Do not advertise unlimited ironing unless explicitly set here.
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-bold text-[#12312C] mb-1">
                      Plan Description
                    </label>
                    <input
                      type="text"
                      value={p.description}
                      onChange={(e) => {
                        const copy = [...plans];
                        copy[idx].description = e.target.value;
                        setPlans(copy);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-[#E0EBDD] bg-white"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  disabled={savingPlanId === p.id}
                  onClick={() => handleSavePlan(p)}
                  className="w-full py-2 px-3 rounded-xl bg-[#0B4F47] hover:bg-[#176B5D] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {savingPlanId === p.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>Save {p.name} Plan</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION E: AUDIT LOGS TABLE */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E0EBDD] shadow-soft space-y-4">
        <div className="flex items-center justify-between border-b border-[#E0EBDD]/70 pb-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#3E8E4A]" />
            <h3 className="text-base font-black text-[#12312C]">Pricing & Redemption Audit Trail</h3>
          </div>
          <span className="text-xs text-[#5A7065]">{auditLogs.length} events logged</span>
        </div>

        {auditLogs.length === 0 ? (
          <p className="text-xs text-[#5A7065] py-2">No audit events logged yet.</p>
        ) : (
          <div className="rounded-2xl border border-[#E0EBDD] overflow-hidden divide-y divide-[#E0EBDD]/60 text-xs">
            {auditLogs.slice(0, 10).map((log) => (
              <div key={log.id} className="p-3 bg-[#FAF9F2] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#0B4F47]">{log.action}</span>
                  <span className="text-[#5A7065] ml-2">
                    {log.entity_type} ({log.entity_id})
                  </span>
                </div>
                <span className="text-[11px] text-[#5A7065]">
                  {new Date(log.created_at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
