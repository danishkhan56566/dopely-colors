import { Users, Heart, Palette, UserPlus, TrendingUp, Award, Clock } from 'lucide-react';
import { getDashboardStats } from './actions';
import { formatDistanceToNow } from 'date-fns';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const data = await getDashboardStats();

    if (!data) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-gray-500">Failed to load dashboard statistics.</p>
            </div>
        );
    }

    const { stats, activity, favoritesGrowth, popularity } = data;

    const STAT_CARDS = [
        { label: 'Total Palettes', value: stats.totalPalettes.toLocaleString(), icon: Palette, color: 'bg-indigo-500', trend: '+12%' },
        { label: 'Total Favorites', value: stats.totalFavorites.toLocaleString(), icon: Heart, color: 'bg-pink-500', trend: '+24%' },
        { label: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: Users, color: 'bg-blue-500', trend: '+5%' },
        { label: "Today's Palettes", value: stats.todaysPalettes.toLocaleString(), icon: UserPlus, color: 'bg-green-500', trend: '+18%' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
                    <p className="text-gray-500 text-sm mt-1">Live platform health and community activity.</p>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-2xl border border-gray-100 text-xs font-bold text-gray-400 shadow-sm uppercase tracking-widest">
                    <Clock size={14} className="text-violet-500" />
                    Last updated: Just now
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {STAT_CARDS.map((stat) => (
                    <div key={stat.label} className="group bg-white p-6 rounded-[2rem] border border-gray-50 shadow-sm hover:shadow-xl hover:shadow-gray-100 transition-all duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                                <stat.icon size={24} />
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-black text-green-600 bg-green-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                                <TrendingUp size={10} />
                                {stat.trend}
                            </div>
                        </div>
                        <div className="text-3xl font-black text-gray-900 mb-1">{stat.value}</div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Favorites Growth Chart */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Favorites Growth</h2>
                            <p className="text-xs text-gray-400 font-medium">Last 30 days performance</p>
                        </div>
                        <Heart size={20} className="text-pink-500" />
                    </div>

                    <div className="h-48 w-full flex items-end gap-1">
                        {favoritesGrowth.map((d, i) => {
                            const max = Math.max(...favoritesGrowth.map(x => x.count), 1);
                            const height = (d.count / max) * 100;
                            return (
                                <div key={i} className="flex-1 group relative">
                                    <div
                                        style={{ height: `${Math.max(height, 5)}%` }}
                                        className="w-full bg-pink-100 rounded-t-md group-hover:bg-pink-500 transition-all duration-300 relative"
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                            {d.count} favs
                                        </div>
                                    </div>
                                    {i % 7 === 0 && (
                                        <div className="absolute -bottom-6 left-0 text-[10px] font-bold text-gray-300 whitespace-nowrap uppercase">
                                            {d.date}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-10 pt-6 border-t border-gray-50 flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Historical Trend</span>
                        <span className="text-xs font-black text-pink-500 uppercase">Strong Engagement</span>
                    </div>
                </div>

                {/* Categories Popularity */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Top Categories</h2>
                            <p className="text-xs text-gray-400 font-medium">By content volume</p>
                        </div>
                        <Award size={20} className="text-amber-500" />
                    </div>

                    <div className="space-y-5">
                        {popularity.length > 0 ? popularity.map((cat, i) => {
                            const max = Math.max(...popularity.map(x => x.palette_count || 0), 1);
                            const width = ((cat.palette_count || 0) / max) * 100;
                            return (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-gray-900">{cat.name}</span>
                                        <span className="text-gray-400">{(cat.palette_count || 0).toLocaleString()}</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                                        <div
                                            style={{ width: `${width}%` }}
                                            className="h-full bg-violet-500 rounded-full"
                                        />
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="flex items-center justify-center h-48 text-gray-300 text-xs font-bold italic">
                                No category data available
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-[2.5rem] border border-gray-50 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                    <h2 className="text-lg font-bold text-gray-900">Recent Platform Activity</h2>
                    <button className="text-xs font-black text-violet-600 uppercase tracking-widest hover:underline transition-all">View All Activity</button>
                </div>
                <div className="divide-y divide-gray-50">
                    {activity.map((item, i) => (
                        <div key={item.id} className="p-6 flex items-center gap-6 hover:bg-gray-50/30 transition-colors">
                            <div className="w-10 h-10 rounded-2xl bg-white border border-gray-100 flex items-center justify-center font-black text-[10px] text-gray-900 shadow-sm">
                                {item.user.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <span className="text-sm font-bold text-gray-900">{item.user}</span>
                                    <span className="text-xs text-gray-500 font-medium">{item.detail}</span>
                                </div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                    {formatDistanceToNow(new Date(item.time), { addSuffix: true })}
                                </p>
                            </div>
                            <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${item.type === 'palette' ? 'bg-indigo-50 text-indigo-600' :
                                    item.type === 'favorite' ? 'bg-pink-50 text-pink-600' :
                                        'bg-emerald-50 text-emerald-600'
                                }`}>
                                {item.type}
                            </div>
                        </div>
                    ))}
                    {activity.length === 0 && (
                        <div className="p-20 text-center text-gray-300 text-xs font-bold italic">
                            Quiet day on the platform. No recent activity.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
