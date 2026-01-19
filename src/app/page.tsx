import { Hero } from '@/components/landing/Hero';
import { TrustedBy } from '@/components/landing/TrustedBy';
import { LivePreviewSection } from '@/components/landing/LivePreviewSection';
import { FeatureGrid } from '@/components/landing/FeatureGrid';
import { IndustryGrid } from '@/components/landing/IndustryGrid';
import { Pricing } from '@/components/landing/Pricing';
import { Footer } from '@/components/layout/Footer';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function LandingPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col min-h-screen bg-white">
        <Hero />
        <TrustedBy />
        <LivePreviewSection />

        {/* Export & Developer Features (using FeatureGrid for now, will enhance later) */}
        <FeatureGrid />

        {/* Industry Use Cases */}
        <IndustryGrid />

        {/* Pricing & Final CTA */}
        <Pricing />

        {/* Final CTA Section */}
        <section className="py-24 bg-white text-center">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Design with confidence. Ship faster.</h2>
            <button className="bg-black text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl">
              Generate Palette Free
            </button>
          </div>
        </section>

        <Footer />
      </div>
    </DashboardLayout>
  );
}
