import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// Requires service role key to bypass RLS and securely mark users as pro models
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    try {
        const rawBody = await req.text();
        const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

        // Security: Validate the webhook originated from Lemon Squeezy via HMAC
        const hmac = crypto.createHmac('sha256', secret || '');
        const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
        const signature = Buffer.from(req.headers.get('x-signature') || '', 'utf8');

        if (!secret) {
            console.warn("No webhook secret configured! Bypassing validation (DANGEROUS). Only for isolated dev testing.");
        } else if (digest.length !== signature.length || !crypto.timingSafeEqual(digest, signature)) {
            return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
        }

        const payload = JSON.parse(rawBody);
        const eventName = payload.meta.event_name;
        
        // Critical custom data injected during checkout checkoutData
        const customData = payload.meta.custom_data;
        const userId = customData?.user_id;

        if (!userId) {
            console.error("Payload missing user_id. Cannot update database.", payload);
            return NextResponse.json({ error: 'Missing user context' }, { status: 400 });
        }

        // Handle Subscription Events
        if (eventName === 'subscription_created' || eventName === 'subscription_updated') {
            const subscriptionId = payload.data.id;
            const customerId = payload.data.attributes.customer_id;
            const status = payload.data.attributes.status; // 'active', 'past_due', 'cancelled'
            const currentPeriodEnd = new Date(payload.data.attributes.renews_at).toISOString();

            const isPro = status === 'active' || status === 'on_trial';

            const { error } = await supabaseAdmin
                .from('profiles')
                .update({
                    is_pro: isPro,
                    subscription_tier: 'pro',
                    subscription_id: subscriptionId.toString(),
                    lemon_squeezy_customer_id: customerId.toString(),
                    subscription_status: status,
                    current_period_end: currentPeriodEnd
                })
                .eq('id', userId);

            if (error) {
                console.error("Supabase Database Update Failed:", error);
                throw error;
            }
        } 
        else if (eventName === 'subscription_cancelled' || eventName === 'subscription_expired') {
            await supabaseAdmin
                .from('profiles')
                .update({
                    is_pro: false,
                    subscription_status: payload.data.attributes.status,
                })
                .eq('id', userId);
        }

        return NextResponse.json({ received: true });
    } catch (err: any) {
        console.error('Webhook Error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
