import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { AUTH_COOKIE_NAME, verifyAdminAuth } from '@/lib/admin-auth'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || (process.env.NODE_ENV !== 'production' ? 'virat2026' : undefined)

export async function GET() {
  const isAuthenticated = await verifyAdminAuth()
  if (isAuthenticated) {
    return NextResponse.json({ authenticated: true })
  }
  return NextResponse.json({ authenticated: false }, { status: 401 })
}

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json(
        { success: false, error: 'Password is required' },
        { status: 400 }
      )
    }

    if (!ADMIN_PASSWORD) {
      console.error('CRITICAL: ADMIN_PASSWORD environment variable is not defined.')
      return NextResponse.json(
        { success: false, error: 'Administrator authentication is not properly configured on server.' },
        { status: 500 }
      )
    }

    if (password === ADMIN_PASSWORD) {
      const response = NextResponse.json({ success: true, message: 'Authenticated successfully' })
      
      // Set an HTTP-only secure cookie valid for 7 days
      response.cookies.set(AUTH_COOKIE_NAME, 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      })

      return response
    }

    return NextResponse.json(
      { success: false, error: 'Incorrect administrator password' },
      { status: 401 }
    )
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid request' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' })
  response.cookies.set(AUTH_COOKIE_NAME, '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  })
  return response
}
