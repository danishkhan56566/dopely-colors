import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Users, Heart, Palette, Globe } from 'lucide-react';
import Image from 'next/image';

export const metadata = {
    title: 'About Us - Dopely Colors',
    description: 'Learn about the mission, team, and story behind Dopely Colors.',
};

export default function AboutPage() {
    return (
        <DashboardLayout>
            <div className="bg-white">
                {/* Hero */}
                <div className="relative isolate px-6 pt-14 lg:px-8">
                    <div className="mx-auto max-w-2xl py-12 md:py-20 text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6">
                            We're building the future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">color design</span>.
                        </h1>
                        <p className="text-lg leading-8 text-gray-600">
                            Dopely Colors is on a mission to democratize professional design tools. We believe that beautiful, accessible color systems should be available to everyone—from hobbyists to enterprise teams.
                        </p>
                    </div>
                </div>

                {/* Values Section */}
                <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
                    <div className="mx-auto max-w-2xl lg:max-w-none">
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                            <div className="flex flex-col bg-gray-50/50 p-8 rounded-2xl border border-gray-100">
                                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                                    <Palette className="h-6 w-6 text-white" aria-hidden="true" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Design Intelligence</h3>
                                <p className="text-base leading-7 text-gray-600 flex-auto">
                                    We combine classic color theory with modern AI to generate palettes that aren't just random, but harmoniously engineered for digital screens.
                                </p>
                            </div>
                            <div className="flex flex-col bg-gray-50/50 p-8 rounded-2xl border border-gray-100">
                                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-600">
                                    <Heart className="h-6 w-6 text-white" aria-hidden="true" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Accessibility First</h3>
                                <p className="text-base leading-7 text-gray-600 flex-auto">
                                    Beauty shouldn't compromise usability. Our tools prioritize WCAG compliance, ensuring your designs are inclusive and readable for everyone.
                                </p>
                            </div>
                            <div className="flex flex-col bg-gray-50/50 p-8 rounded-2xl border border-gray-100">
                                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-pink-600">
                                    <Globe className="h-6 w-6 text-white" aria-hidden="true" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Community Driven</h3>
                                <p className="text-base leading-7 text-gray-600 flex-auto">
                                    We are built for the community, by the community. Our open library of thousands of palettes inspires designers worldwide every day.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Story Section */}
                <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
                    <div className="mx-auto max-w-3xl prose prose-gray lg:prose-lg">
                        <h2>Our Story</h2>
                        <p>
                            Started in 2026, Dopely Colors began as a simple frustration: why are color tools so disconnected from modern workflows? Existing generators were either too simple or overly complex enterprise suites.
                        </p>
                        <p>
                            We set out to build the "middle ground"—a tool that feels like magic but exports production-ready code. Today, thousands of developers and designers use Dopely to kickstart their projects.
                        </p>
                        <p>
                            Whether you're building a personal blog or a global design system, we're here to help you find the perfect shade.
                        </p>
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
}
