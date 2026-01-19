import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Palette, Users, Globe, Award } from 'lucide-react';

export default function CompanyPage() {
    return (
        <DashboardLayout>
            <div className="bg-white">
                {/* Hero */}
                <div className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32">
                    <div className="hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl" aria-hidden="true">
                        <div className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
                    </div>
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl lg:mx-0">
                            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">We help the world design better.</h2>
                            <p className="mt-6 text-lg leading-8 text-gray-300">
                                Dopley Colors was born from a simple idea: color is hard, but it doesn't have to be. We're building the intelligence layer for global design systems.
                            </p>
                        </div>
                        <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
                            <div className="grid grid-cols-1 gap-x-8 gap-y-6 text-base font-semibold leading-7 text-white sm:grid-cols-2 md:flex lg:gap-x-10">
                                <a href="#">Open Roles <span aria-hidden="true">&rarr;</span></a>
                                <a href="#">Internships <span aria-hidden="true">&rarr;</span></a>
                                <a href="#">Our Values <span aria-hidden="true">&rarr;</span></a>
                            </div>
                            <dl className="mt-16 grid grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
                                <div className="flex flex-col-reverse">
                                    <dt className="text-base leading-7 text-gray-300">Palettes Generated</dt>
                                    <dd className="text-2xl font-bold leading-9 tracking-tight text-white">12M+</dd>
                                </div>
                                <div className="flex flex-col-reverse">
                                    <dt className="text-base leading-7 text-gray-300">Designers</dt>
                                    <dd className="text-2xl font-bold leading-9 tracking-tight text-white">500k+</dd>
                                </div>
                                <div className="flex flex-col-reverse">
                                    <dt className="text-base leading-7 text-gray-300">Countries</dt>
                                    <dd className="text-2xl font-bold leading-9 tracking-tight text-white">180</dd>
                                </div>
                                <div className="flex flex-col-reverse">
                                    <dt className="text-base leading-7 text-gray-300">Uptime</dt>
                                    <dd className="text-2xl font-bold leading-9 tracking-tight text-white">99.9%</dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>

                {/* Values Section */}
                <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
                    <div className="mx-auto max-w-2xl lg:mx-0">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Values</h2>
                        <p className="mt-6 text-lg leading-8 text-gray-600">
                            The principles that guide our product and people.
                        </p>
                    </div>
                    <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 text-base leading-7 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                        <div>
                            <dt className="font-semibold text-gray-900 flex items-center gap-2">
                                <Palette className="text-blue-600" size={20} />
                                Beauty is Functional
                            </dt>
                            <dd className="mt-1 text-gray-600">Aesthetics aren't just decoration. They usability, trust, and clarity.</dd>
                        </div>
                        <div>
                            <dt className="font-semibold text-gray-900 flex items-center gap-2">
                                <Users className="text-purple-600" size={20} />
                                For Everyone
                            </dt>
                            <dd className="mt-1 text-gray-600">Design tools should be accessible to pros and beginners alike.</dd>
                        </div>
                        <div>
                            <dt className="font-semibold text-gray-900 flex items-center gap-2">
                                <Award className="text-yellow-500" size={20} />
                                Craft Matters
                            </dt>
                            <dd className="mt-1 text-gray-600">We sweat the details so you don't have to.</dd>
                        </div>
                    </dl>
                </div>

                {/* Spacer */}
                <div className="h-32"></div>
            </div>
        </DashboardLayout>
    );
}
