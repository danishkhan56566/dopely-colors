import { NextResponse } from 'next/server';
import { createCheckout, lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Admin Client for secure DB checks bridging
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    try {
        const { userId, productId } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        // You must create a Lemon Squeezy account and put your API Key into .env.local
        const apiKey = process.env.LEMONSQUEEZY_API_KEY;
        const storeId = process.env.LEMONSQUEEZY_STORE_ID;
        
        if (!apiKey || !storeId) {
            // MOCK STATE FOR DEVELOPMENT BEFORE ACCOUNT CREATION
            console.warn("Lemon Squeezy API keys missing. Generating Mock URL for UI testing.");
            return NextResponse.json({ url: `https://dopelycolors.com/dashboard?mock_upgrade=true&user_id=${userId}` });
        }

        // Configure the SDK globally using standard setup
        lemonSqueezySetup({ apiKey });

        // Retrieve user email to prefill checkout (better conversion UX)
        const { data: userRecord } = await supabaseAdmin.auth.admin.getUserById(userId);
        const email = userRecord?.user?.email;

        // Fetch user's profile to see if they're already subbed? Optional.

        // Use the SDK to instantiate a checkout URL
        // Variant ID refers to Monthly or Yearly specific variants in Lemon Squeezy
        const { data, error } = await createCheckout(storeId, productId, {
            checkoutData: {
                email: email || '',
                custom: {
                    user_id: userId // CRITICAL: This allows the Webhook to know WHO paid
                }
            },
            productOptions: {
                receiptButtonText: 'Return to Dopely Colors',
                receiptThankYouNote: 'Thank you for upgrading! Your neural design capabilities are unlocked.'
            }
        });

        if (error) {
            throw new Error(error.message);
        }

        // Return the secure hosted URL which the client UI will redirect to
        return NextResponse.json({ url: data?.data.attributes.url });

    } catch (error: any) {
        console.error('Checkout creation error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
