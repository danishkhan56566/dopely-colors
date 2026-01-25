'use client';

import { useEffect, useState } from 'react';
import { BarChart, Activity, Map, Users, Palette, Heart, Eye, TrendingUp } from 'lucide-react';
import { getAnalyticsData, AnalyticsSummary, DailyStat, TopPalette, AnalyticsExtension } from './actions';
import { toast } from 'sonner';

export default function AdminAnalyticsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<{
        summary: AnalyticsSummary;
        dailyStats: DailyStat[];
        topPalettes: TopPalette[];
        extension: AnalyticsExtension;
    } | null>(null);

    useEffect(() => {
        async function loadData() {
            try {
                const analyticsData = await getAnalyticsData();
                setData(analyticsData);
            } catch (error) {
                toast.error('Failed to load analytics');
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, []);

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Loading analytics...</div>;
    }

    if (!data) {
        return <div className="p-8 text-center text-red-500">Failed to load data.</div>;
    }

    const maxDaily = Math.max(...data.dailyStats.map(d => Math.max(d.palettes, d.users, 1)));

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Platform Analytics</h1>
                    <p className="text-gray-500 text-sm mt-1">Real-time overview of platform performance.</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Users"
                    value={data.summary.totalUsers}
                    icon={<Users className="text-blue-500" size={24} />}
                    bg="bg-blue-50"
                />
                <StatCard
                    title="Total Palettes"
                    value={data.summary.totalPalettes}
                    icon={<Palette className="text-purple-500" size={24} />}
                    bg="bg-purple-50"
                />
                <StatCard
                    title="Total Favorites"
                    value={data.summary.totalFavorites}
                    icon={<Heart className="text-pink-500" size={24} />}
                    bg="bg-pink-50"
                />
                <StatCard
                    title="Total Views"
                    value={data.summary.totalViews}
                    icon={<Eye className="text-emerald-500" size={24} />}
                    bg="bg-emerald-50"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Growth Chart */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-h-[400px]">
                    <div className="flex items-center gap-2 mb-6">
                        <Activity size={20} className="text-gray-500" />
                        <h3 className="text-lg font-bold text-gray-900">30-Day Growth</h3>
                    </div>
                    <div className="h-64 flex items-end gap-1 sm:gap-2">
                        {data.dailyStats.map((stat, i) => (
                            <div key={i} className="flex-1 flex flex-col justify-end gap-1 group relative">
                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs p-2 rounded z-10 whitespace-nowrap">
                                    <div className="font-bold">{stat.date}</div>
                                    <div>Palettes: {stat.palettes}</div>
                                    <div>Users: {stat.users}</div>
                                </div>

                                <div
                                    className="w-full bg-blue-500/30 rounded-t-sm transition-all hover:bg-blue-500"
                                    style={{ height: `${(stat.users / maxDaily) * 100}%` }}
                                ></div>
                                <div
                                    className="w-full bg-purple-500 rounded-t-sm transition-all hover:bg-purple-600"
                                    style={{ height: `${(stat.palettes / maxDaily) * 100}%` }}
                                ></div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-gray-400 border-t pt-2">
                        <span>30 Days Ago</span>
                        <span>Today</span>
                    </div>
                    <div className="flex justify-center gap-4 mt-2 text-xs font-bold">
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-purple-500 rounded-full"></div> New Palettes</div>
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500/50 rounded-full"></div> New Users</div>
                    </div>
                </div>

                {/* Top Palettes */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <TrendingUp size={20} className="text-gray-500" />
                        <h3 className="text-lg font-bold text-gray-900">Top Palettes</h3>
                    </div>
                    <div className="space-y-4">
                        {data.topPalettes.length === 0 ? (
                            <div className="text-center text-gray-400 py-8">No palettes found</div>
                        ) : (
                            data.topPalettes.map((p) => (
                                <div key={p.id} className="flex items-center gap-4 group cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                                    <div className="flex h-12 w-24 rounded-lg overflow-hidden shrink-0 shadow-sm ring-1 ring-black/5">
                                        {p.colors.map((c) => (
                                            <div key={c} className="flex-1 h-full" style={{ backgroundColor: c }} />
                                        ))}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-bold text-gray-900 truncate">{p.name}</div>
                                        <div className="text-xs text-gray-500 flex items-center gap-3">
                                            <span className="flex items-center gap-1"><Heart size={10} /> {p.favorites_count}</span>
                                            <span className="flex items-center gap-1"><Eye size={10} /> {p.views_count}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Extended Analytics - Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Traffic Sources (Real/Empty) */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-h-[300px] flex flex-col">
                    <div className="flex items-center gap-2 mb-6">
                        <BarChart size={20} className="text-gray-500" />
                        <h3 className="text-lg font-bold text-gray-900">Traffic Sources</h3>
                    </div>

                    {data.extension?.trafficSources?.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                                <BarChart size={24} className="text-gray-300" />
                            </div>
                            <p className="text-gray-500 font-medium">No traffic data yet</p>
                            <p className="text-xs text-gray-400 mt-1 max-w-[200px]">Traffic source tracking is currently not active.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Only renders if we actually implement Traffic implementation later */}
                            {data.extension?.trafficSources?.map(s => (
                                <div key={s.name} className="flex justify-between">
                                    <span>{s.name}</span>
                                    <span>{s.count}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* User Retention (Now Real!) */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-h-[300px] flex flex-col">
                    <div className="flex items-center gap-2 mb-6">
                        <Activity size={20} className="text-gray-500" />
                        <h3 className="text-lg font-bold text-gray-900">User Retention</h3>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center">
                        <div className="relative w-40 h-40 flex items-center justify-center">
                            {/* Simple Circular Progress representation */}
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="80" cy="80" r="70"
                                    stroke="currentColor" strokeWidth="15" fill="transparent"
                                    className="text-gray-100"
                                />
                                <circle
                                    cx="80" cy="80" r="70"
                                    stroke="currentColor" strokeWidth="15" fill="transparent"
                                    strokeDasharray={440}
                                    strokeDashoffset={440 - (440 * (data.extension?.retention?.retentionRate || 0)) / 100}
                                    className="text-blue-500 transition-all duration-1000 ease-out"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-black text-gray-900">{data.extension?.retention?.retentionRate}%</span>
                                <span className="text-xs text-gray-400 font-bold uppercase">Retention</span>
                            </div>
                        </div>
                        <div className="mt-6 text-center">
                            <div className="text-2xl font-bold text-gray-900">{data.extension?.retention?.activeUsers}</div>
                            <div className="text-sm text-gray-500">Active users in last 30 days</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Countries (Real/Empty) */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                    <Map size={20} className="text-gray-500" />
                    <h3 className="text-lg font-bold text-gray-900">Top Countries <span className="text-xs font-normal text-gray-400 ml-2">(Location tracking required)</span></h3>
                </div>

                {data.extension?.countries?.length === 0 ? (
                    <div className="py-12 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                            <Map size={24} className="text-gray-300" />
                        </div>
                        <p className="text-gray-500 font-medium">No location data available</p>
                        <p className="text-xs text-gray-400 mt-1 max-w-[200px]">We are not currently tracking user locations.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {data.extension?.countries?.map(c => (
                            <div key={c.name} className="flex items-center gap-4">
                                <span className="text-xl">{c.flag}</span>
                                <div className="flex-1">
                                    <div className="flex justify-between text-sm font-bold mb-1">
                                        <span>{c.name}</span>
                                        <span>{c.percent}</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 rounded-full" style={{ width: c.percent }}></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, bg }: { title: string, value: number, icon: React.ReactNode, bg: string }) {
    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className={`w-12 h-12 ${bg} rounded-lg flex items-center justify-center mb-4`}>
                {icon}
            </div>
            <div className="text-2xl font-black text-gray-900 font-mono tracking-tight">{value.toLocaleString()}</div>
            <div className="text-sm text-gray-500 font-medium">{title}</div>
        </div>
    );
}
