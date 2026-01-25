export default function Loading() {
    return (
        <div className="min-h-screen bg-[#FBFBFB] flex flex-col items-center justify-center pt-20">
            <div className="w-full max-w-2xl bg-white rounded-[32px] shadow-xl overflow-hidden h-[600px] animate-pulse">
                <div className="h-[400px] bg-slate-200 w-full" />
                <div className="p-8 space-y-4">
                    <div className="h-8 bg-slate-200 rounded w-1/3" />
                    <div className="grid grid-cols-5 gap-4">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="h-12 w-12 bg-slate-200 rounded-full" />
                        ))}
                    </div>
                </div>
            </div>
            <div className="mt-8 text-slate-400 font-medium animate-pulse">
                Loading Palette...
            </div>
        </div>
    );
}
