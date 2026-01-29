import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    // canonical redirect
    const hostname = request.headers.get('host')
    if (process.env.NODE_ENV === 'production' && hostname === 'dopley-colors.vercel.app') {
        const newUrl = new URL(request.url)
        newUrl.host = 'dopelycolors.com'
        newUrl.protocol = 'https'
        return NextResponse.redirect(newUrl, { status: 301 })
    }

    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabaseUrl = 'https://cafwmpzdgatxpavuwnvh.supabase.co';
    const supabaseKey = 'sb_publishable_S5cNoYZ_FXWt9nHOwWGHjg_N1mVxbvV';

    if (!supabaseUrl || !supabaseKey) {
        // Run in limited mode if keys are missing
        return response;
    }

    const supabase = createServerClient(
        supabaseUrl,
        supabaseKey,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        request.cookies.set(name, value)
                        response.cookies.set(name, value, options)
                    })
                },
            },
        }
    )

    const isProtectedRoute = request.nextUrl.pathname.startsWith('/profile') ||
        request.nextUrl.pathname.startsWith('/settings') ||
        request.nextUrl.pathname.startsWith('/dashboard');

    if (isProtectedRoute) {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
