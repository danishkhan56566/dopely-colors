'use client';

import { useState } from 'react';
import {
    DollarSign,
    TrendingUp,
    Users,
    CreditCard,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    Download,
    PieChart,
    BarChart3,
    Activity,
    Smartphone,
    Monitor,
    Globe
} from 'lucide-react';
import clsx from 'clsx';

export default function RevenueDashboard() {
    const [timeframe, setTimeframe] = useState('Last 30 Days');

    const stats = [
        { label: 'Monthly Recurring Revenue', value: '$12,450.00', change: '+14.5%', trend: 'up', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Active Subscriptions', value: '1,240', change: '+8.2%', trend: 'up', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Average Revenue Per User', value: '$10.04', change: '-2.1%', trend: 'down', icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Churn Rate', value: '2.4%', change: '-0.5%', trend: 'up', icon: Activity, color: 'text-rose-600', bg: 'bg-rose-50' },
    ];

    const recentTransactions = [
        { id: 'TX-9021', name: 'Premium Pro Annual', user: 'Alex Rivers', amount: '$120.00', status: 'Completed', date: 'Just now', type: 'Annual' },
        { id: 'TX-9020', name: 'Premium Pro Monthly', user: 'Sarah Chen', amount: '$12.00', status: 'Completed', date: '14 mins ago', type: 'Monthly' },
        { id: 'TX-9019', name: 'Premium Pro Monthly', user: 'Mike Ross', amount: '$12.00', status: 'Processing', date: '1 hour ago', type: 'Monthly' },
        { id: 'TX-9018', name: 'Premium Pro Annual', user: 'James Bond', amount: '$120.00', status: 'Completed', date: '4 hours ago', type: 'Annual' },
        { id: 'TX-9017', name: 'Premium Pro Monthly', user: 'Maria Garcia', amount: '$12.00', status: 'Completed', date: 'Yesterday', type: 'Monthly' },
    ];

    return (
        <div className="max-w-7xl mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        <CreditCard className="text-blue-600" size={32} />
                        Revenue Intelligence
                    </h1>
                    <p className="text-gray-500 font-medium mt-1">Real-time subscription metrics and financial performance.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-white border border-gray-100 rounded-2xl p-1 shadow-sm">
                        {['Last 7 Days', 'Last 30 Days', 'All Time'].map((t) => (
                            <button
                                key={t}
                                onClick={() => setTimeframe(t)}
                                className={clsx(
                                    "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                                    timeframe === t ? "bg-gray-900 text-white shadow-lg" : "text-gray-400 hover:text-gray-700 hover:bg-gray-50"
                                )}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                    <button className="p-3 bg-white border border-gray-100 text-gray-700 rounded-2xl hover:bg-gray-50 transition-all shadow-sm">
                        <Download size={20} />
                    </button>
                </div>
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                        <div className="flex items-center justify-between mb-5">
                            <div className={clsx("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                                <stat.icon size={24} />
                            </div>
                            <div className={clsx(
                                "flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                                stat.trend === 'up' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                            )}>
                                {stat.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                {stat.change}
                            </div>
                        </div>
                        <div className="text-2xl font-black text-gray-900 mb-1">{stat.value}</div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Visual Analytics */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Revenue Growth Chart Placeholder */}
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 min-h-[400px] flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Revenue Growth</h3>
                                <p className="text-sm text-gray-500">Subscription revenue over time</p>
                            </div>
                            <div className="flex items-center gap-4 text-xs font-bold">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                                    <span className="text-gray-600">Pro Monthly</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-violet-500" />
                                    <span className="text-gray-600">Pro Annual</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 flex items-end gap-3 pb-4">
                            {[45, 60, 55, 75, 90, 85, 95, 110, 100, 120, 140, 135].map((h, i) => (
                                <div key={i} className="flex-1 space-y-2 group relative">
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                        ${h * 100}
                                    </div>
                                    <div className="flex flex-col gap-1 h-full justify-end">
                                        <div
                                            className="w-full bg-blue-500 rounded-lg transition-all hover:brightness-110 cursor-pointer"
                                            style={{ height: `${h}%` }}
                                        />
                                        <div
                                            className="w-full bg-violet-400 rounded-lg transition-all hover:brightness-110 cursor-pointer"
                                            style={{ height: `${h * 0.4}%` }}
                                        />
                                    </div>
                                    <div className="text-[10px] text-gray-400 font-bold uppercase text-center pt-2">
                                        {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Transaction History */}
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-900 font-jakarta">Recent Transactions</h3>
                            <button className="text-blue-600 text-xs font-bold hover:underline">View All Transcations &rarr;</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50/50 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                        <th className="px-8 py-4">Status</th>
                                        <th className="px-6 py-4">Plan Name</th>
                                        <th className="px-6 py-4">Customer</th>
                                        <th className="px-6 py-4">Revenue</th>
                                        <th className="px-8 py-4 text-right">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {recentTransactions.map((tx) => (
                                        <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors group cursor-pointer">
                                            <td className="px-8 py-5">
                                                <div className={clsx(
                                                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase",
                                                    tx.status === 'Completed' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                                                )}>
                                                    {tx.status === 'Completed' ? <CheckCircle2 size={12} /> : <RefreshCw size={12} className="animate-spin" />}
                                                    {tx.status}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="font-bold text-gray-900 text-sm">{tx.name}</div>
                                                <div className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{tx.type}</div>
                                            </td>
                                            <td className="px-6 py-5 font-medium text-gray-600 text-sm">{tx.user}</td>
                                            <td className="px-6 py-5 font-black text-gray-900">{tx.amount}</td>
                                            <td className="px-8 py-5 text-right font-medium text-gray-400 text-xs">{tx.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-8">
                    {/* Platform Breakdown */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-8 border-b border-gray-50 pb-4">Source Breakdown</h3>
                        <div className="space-y-6">
                            {[
                                { label: 'Web (Direct)', value: 65, icon: Monitor, color: 'bg-blue-500' },
                                { label: 'iOS App', value: 20, icon: Smartphone, color: 'bg-violet-500' },
                                { label: 'Android App', value: 15, icon: Smartphone, color: 'bg-emerald-500' },
                            ].map((platform) => (
                                <div key={platform.label} className="space-y-2">
                                    <div className="flex items-center justify-between text-xs font-bold">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <platform.icon size={14} />
                                            {platform.label}
                                        </div>
                                        <span className="text-gray-900">{platform.value}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div className={clsx("h-full rounded-full", platform.color)} style={{ width: `${platform.value}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-10 p-4 bg-blue-50 rounded-2xl border border-blue-100 italic text-[11px] text-blue-800 leading-relaxed font-medium">
                            * Data shows that web users have a 12% higher conversion rate than mobile users this month.
                        </div>
                    </div>

                    {/* Subscriptions Goals */}
                    <div className="bg-gray-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
                        <h3 className="text-sm font-black uppercase tracking-widest mb-6 opacity-60">Revenue Goal</h3>
                        <div className="flex items-end gap-2 mb-2">
                            <div className="text-4xl font-black">$50,000</div>
                            <div className="text-blue-400 font-bold mb-1 text-sm">/ month</div>
                        </div>
                        <p className="text-gray-400 text-xs mb-8">Currently at 25% of target</p>

                        <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden mb-8">
                            <div className="h-full bg-white rounded-full w-[25%]" />
                        </div>

                        <button className="w-full py-3 bg-white text-black rounded-2xl font-black text-sm hover:scale-[1.02] transition-all shadow-xl active:scale-[0.98]">
                            View Strategy
                        </button>
                    </div>

                    {/* Help Card */}
                    <div className="bg-indigo-50 p-8 rounded-[2.5rem] border border-indigo-100">
                        <h3 className="text-lg font-bold text-indigo-900 mb-2">Need a Payout?</h3>
                        <p className="text-xs text-indigo-600/80 mb-6 leading-relaxed">
                            Connect your bank account via Stripe to enable automatic weekly payouts of your revenue.
                        </p>
                        <button className="flex items-center gap-2 text-indigo-700 font-bold text-sm hover:gap-3 transition-all">
                            Configure Stripe <ArrowUpRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Corrected Icons for the table
function CheckCircle2(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle-2"><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg> }
function RefreshCw(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-refresh-cw"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M3 21v-5h5" /></svg> }
