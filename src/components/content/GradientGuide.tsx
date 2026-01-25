import React from 'react';

export const GradientGuide = () => {
    return (
        <section className="max-w-5xl mx-auto py-20 px-6 text-gray-700">
            <div className="prose prose-lg prose-indigo max-w-none">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">The Ultimate Guide to Modern CSS Gradients</h2>
                    <p className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
                        Learn how to design, implement, and optimize beautiful gradients for web applications in 2026. From basic linear transitions to complex mesh effects.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-start mb-20">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Gradients Matter in UI Design</h3>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            Gradients have evolved far beyond the simple two-color transitions of the Web 2.0 era. In modern interface design, they serve as powerful functional tools that can guide user attention, create depth without heavy drop shadows, and establish a unique brand identity.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            Psychologically, gradients feel more "organic" to the human eye than flat colors because light in the real world is rarely uniform. By mimicking natural lighting, gradients can make digital interfaces feel more immersive and less clinical.
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-3xl border border-indigo-100">
                        <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">✓</span>
                            Key Benefits
                        </h4>
                        <ul className="space-y-3">
                            <li className="flex gap-3 text-sm font-medium text-gray-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-2 shrink-0"></span>
                                Increases perceived depth and dimension
                            </li>
                            <li className="flex gap-3 text-sm font-medium text-gray-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-2 shrink-0"></span>
                                Smoother transitions between distinct sections
                            </li>
                            <li className="flex gap-3 text-sm font-medium text-gray-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-2 shrink-0"></span>
                                Higher "brand recall" compared to flat colors
                            </li>
                            <li className="flex gap-3 text-sm font-medium text-gray-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-2 shrink-0"></span>
                                Reduced banding on high-resolution displays
                            </li>
                        </ul>
                    </div>
                </div>

                <h3 className="text-3xl font-bold text-gray-900 mb-8">Understanding the Syntax</h3>

                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    <div className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                        <div className="h-24 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 mb-4 shadow-inner"></div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2">Linear Gradient</h4>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded text-pink-600 font-mono block mb-3">linear-gradient(direction, color1, color2)</code>
                        <p className="text-sm text-gray-600">
                            Transitions colors along a straight line. You can control the direction using degrees (e.g., <span className="font-mono text-gray-800">135deg</span>) or keywords like <span className="font-mono text-gray-800">to bottom right</span>.
                        </p>
                    </div>

                    <div className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                        <div className="h-24 rounded-xl bg-[radial-gradient(circle_at_center,#6366f1,#a855f7)] mb-4 shadow-inner"></div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2">Radial Gradient</h4>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded text-pink-600 font-mono block mb-3">radial-gradient(shape at position, start, end)</code>
                        <p className="text-sm text-gray-600">
                            Radiates outward from a central point. Ideal for creating spotlights, glowing effects, or simulating 3D spheres.
                        </p>
                    </div>

                    <div className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                        <div className="h-24 rounded-xl bg-[conic-gradient(from_0deg,#ec4899,#ef4444,#eab308,#ec4899)] mb-4 shadow-inner"></div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2">Conic Gradient</h4>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded text-pink-600 font-mono block mb-3">conic-gradient(from angle, colors)</code>
                        <p className="text-sm text-gray-600">
                            Rotates colors around a central point, like a clock or pie chart. Essential for creating color wheels and metallic CD-like reflections.
                        </p>
                    </div>
                </div>

                <div className="bg-gray-900 text-white rounded-3xl p-8 md:p-12 mb-16 relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold mb-4 text-white">Pro Tip: Avoiding the "Gray Dead Zone"</h3>
                        <p className="text-gray-300 leading-relaxed max-w-2xl mb-6">
                            When fading between complementary colors (like Blue to Orange), standard RGB interpolation often creates a muddy gray color in the middle. This happens because the shortest path between the two hues cuts through the desaturated center of the color wheel.
                        </p>
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="flex-1">
                                <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Bad (RGB Interpolation)</div>
                                <div className="h-12 w-full rounded-lg bg-gradient-to-r from-blue-600 to-orange-500 mb-2"></div>
                                <p className="text-xs text-gray-400">Notice the muddy gray area in the center.</p>
                            </div>
                            <div className="flex-1">
                                <div className="text-xs font-bold uppercase tracking-wider text-green-400 mb-2">Good (With Midpoint)</div>
                                <div className="h-12 w-full rounded-lg bg-gradient-to-r from-blue-600 via-purple-500 to-orange-500 mb-2"></div>
                                <p className="text-xs text-gray-400">Adding a purple midpoint keeps the saturation high.</p>
                            </div>
                        </div>
                    </div>
                    {/* Decorative Blob */}
                    <div className="absolute top-[-50%] right-[-10%] w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[100px]"></div>
                </div>

                <h3 className="text-3xl font-bold text-gray-900 mb-6">Accessibility Best Practices</h3>
                <p className="text-gray-600 mb-8">
                    While gradients are beautiful, they can pose accessibility challenges if not used carefully. The primary concern is <strong>contrast ratio</strong>. Text placed over a gradient must maintain a 4.5:1 contrast ratio against <em>every part</em> of the gradient it covers.
                </p>

                <div className="border-l-4 border-indigo-500 pl-6 py-2 mb-12 bg-indigo-50/50 rounded-r-xl">
                    <h4 className="font-bold text-indigo-900 mb-2">Our Recommendation</h4>
                    <p className="text-indigo-800 text-sm">
                        Use our <a href="/contrast" className="underline decoration-indigo-300 underline-offset-2 hover:text-indigo-600">Contrast Checker</a> to test your text color against the lightest and darkest parts of your gradient. If the gradient is dynamic (animated), consider using a solid color background behind the text or adding a semi-transparent overlay to ensure legibility.
                    </p>
                </div>

                <h3 className="text-3xl font-bold text-gray-900 mb-8">Browser Support & Performance</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse mb-8">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="py-4 font-bold text-gray-900">Feature</th>
                                <th className="py-4 font-bold text-gray-900">Chrome</th>
                                <th className="py-4 font-bold text-gray-900">Firefox</th>
                                <th className="py-4 font-bold text-gray-900">Safari</th>
                                <th className="py-4 font-bold text-gray-900">GPU Cost</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-600">
                            <tr className="border-b border-gray-100">
                                <td className="py-4 font-medium">Linear Gradient</td>
                                <td className="py-4 text-green-600 font-bold">26+</td>
                                <td className="py-4 text-green-600 font-bold">16+</td>
                                <td className="py-4 text-green-600 font-bold">7+</td>
                                <td className="py-4">Low</td>
                            </tr>
                            <tr className="border-b border-gray-100">
                                <td className="py-4 font-medium">Radial Gradient</td>
                                <td className="py-4 text-green-600 font-bold">26+</td>
                                <td className="py-4 text-green-600 font-bold">16+</td>
                                <td className="py-4 text-green-600 font-bold">7+</td>
                                <td className="py-4">Medium</td>
                            </tr>
                            <tr>
                                <td className="py-4 font-medium">Conic Gradient</td>
                                <td className="py-4 text-green-600 font-bold">69+</td>
                                <td className="py-4 text-green-600 font-bold">83+</td>
                                <td className="py-4 text-green-600 font-bold">12.1+</td>
                                <td className="py-4 text-orange-500 font-bold">High</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p className="text-gray-500 text-sm italic mb-12">
                    *Performance note: Animating gradients (e.g., animating `background-position`) triggers paint operations on every frame. For high-performance animations, consider using WebGL or CSS Opacity transitions between two stacked pseudo-elements instead.
                </p>

            </div>
        </section>
    );
};
