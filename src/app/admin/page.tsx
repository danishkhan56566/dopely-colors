import { Users, CreditCard, Palette, TrendingUp } from 'lucide-react';

const STATS = [
    { label: 'Total Revenue', value: '$24,500', change: '+12%', icon: CreditCard, color: 'bg-green-500' },
    { label: 'Active Users', value: '1,240', change: '+18%', icon: Users, color: 'bg-blue-500' },
    { label: 'Palettes Created', value: '85,432', change: '+5%', icon: Palette, color: 'bg-purple-500' },
    { label: 'Conversion Rate', value: '3.2%', change: '+0.4%', icon: TrendingUp, color: 'bg-orange-500' },
];

export const metadata = {
    title: 'Admin Dashboard | Dopely Colors',
};

export default function AdminDashboard() {
    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="text-gray-500 text-sm mt-1">Welcome back, Admin.</p>
                </div>
                <div className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-sm font-medium text-gray-600 shadow-sm">
                    Last updated: Just now
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {STATS.map((stat) => (
                    <div key={stat.label} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-lg ${stat.color}`}>
                                <stat.icon size={20} />
                            </div>
                            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">{stat.change}</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                        <div className="text-sm text-gray-500">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Recent Activity Mockup */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Activity</h2>
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center gap-4 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-xs text-gray-500">
                                U{i}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">User_{i} started a Pro subscription</p>
                                <p className="text-xs text-gray-400">2 minutes ago</p>
                            </div>
                            <div className="text-sm font-bold text-green-600">+$12.00</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
