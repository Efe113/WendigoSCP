import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Do not remove this. Refreshing the session is required for RLS to work correctly.
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch maintenance mode
  const { data: maintenanceConfig } = await supabase
    .from('system_config')
    .select('value')
    .eq('key', 'maintenance_mode')
    .maybeSingle()
  
  const isMaintenance = maintenanceConfig?.value === 'true'

  let profile = null
  if (user) {
    const { data } = await supabase
      .from('user_profiles')
      .select('is_o5_1, status')
      .eq('id', user.id)
      .maybeSingle()
    profile = data
  }

  const path = request.nextUrl.pathname
  // Check if path is public: login, ethics filing page, static files, or media files
  const isPublicPage = 
    path === '/login' || 
    path === '/ethics' || 
    path.startsWith('/_next') || 
    path.includes('.') || 
    path.startsWith('/api')

  // Enforce Maintenance Mode
  if (isMaintenance && !profile?.is_o5_1 && !isPublicPage) {
    return new Response(
      `<html>
         <head>
           <title>SCP TERMINAL - OFFLINE</title>
           <style>
             body { background: #050505; color: #ff3333; font-family: monospace; padding: 50px; text-align: center; }
             h1 { text-shadow: 0 0 5px rgba(255, 51, 51, 0.5); font-size: 24px; margin-bottom: 20px; }
             p { font-size: 14px; margin: 10px 0; }
             a { color: #ff3333; text-decoration: none; border: 1px solid #ff3333; padding: 8px 15px; font-size: 12px; font-weight: bold; transition: all 0.2s; }
             a:hover { background: rgba(255, 51, 51, 0.15); box-shadow: 0 0 8px rgba(255, 51, 51, 0.4); }
           </style>
         </head>
         <body>
           <h1>[SYSTEM LOCKDOWN - MAINTENANCE IN PROGRESS]</h1>
           <p style="color: #00ff66;">DATABASE NODE OFFLINE FOR O5 LEVEL BACKUP AND ENCRYPTION UPGRADES.</p>
           <p style="color: #666; font-size: 11px;">TIMESTAMP: ${new Date().toISOString()}</p>
           <br/><br/>
           <p><a href="/login">O5 COMMAND LOGIN</a></p>
         </body>
       </html>`,
      { headers: { 'Content-Type': 'text/html' } }
    )
  }

  // Enforce User Approval Status
  if (user && !profile?.is_o5_1 && !isPublicPage) {
    if (profile?.status === 'pending') {
      return new Response(
        `<html>
           <head>
             <title>SCP ACCESS - PENDING</title>
             <style>
               body { background: #050505; color: #ffaa00; font-family: monospace; padding: 50px; text-align: center; }
               h1 { text-shadow: 0 0 5px rgba(255, 170, 0, 0.5); font-size: 24px; margin-bottom: 20px; }
               p { font-size: 14px; margin: 10px 0; }
               a { color: #ffaa00; text-decoration: none; border: 1px solid #ffaa00; padding: 8px 15px; font-size: 12px; font-weight: bold; }
               a:hover { background: rgba(255, 170, 0, 0.15); }
             </style>
           </head>
           <body>
             <h1>[ACCESS PENDING COMMAND APPROVAL]</h1>
             <p style="color: #00ff66;">YOUR AGENT REGISTRATION FORM HAS BEEN TRANSMITTED TO O5-1 DIRECT CONTROL PANEL.</p>
             <p style="color: #666; font-size: 11px;">AGENT IDENTIFIER: ${user.id}</p>
             <p style="color: #666; font-size: 11px;">STATUS: AWAITING AUTHORIZATION</p>
             <br/><br/>
             <p><a href="/login">ACCESS PROFILE (DISCONNECT)</a></p>
           </body>
         </html>`,
        { headers: { 'Content-Type': 'text/html' } }
      )
    }

    if (profile?.status === 'suspended') {
      return new Response(
        `<html>
           <head>
             <title>SCP ACCESS - SUSPENDED</title>
             <style>
               body { background: #050505; color: #ff3333; font-family: monospace; padding: 50px; text-align: center; }
               h1 { text-shadow: 0 0 5px rgba(255, 51, 51, 0.5); font-size: 24px; margin-bottom: 20px; }
               p { font-size: 14px; margin: 10px 0; }
               a { color: #ff3333; text-decoration: none; border: 1px solid #ff3333; padding: 8px 15px; font-size: 12px; font-weight: bold; }
               a:hover { background: rgba(255, 51, 51, 0.15); }
             </style>
           </head>
           <body>
             <h1>[ACCESS TERMINATED - ACCOUNT SUSPENDED]</h1>
             <p>THIS ACCOUNT HAS BEEN SUSPENDED OR CLOSED BY THE ETHICS COMMITTEE FOR SECURITY VIOLATIONS.</p>
             <p style="color: #666; font-size: 11px;">CASE STATUS: RESOLVED - CLASS-A AMNESTICS ORDERED</p>
             <br/><br/>
             <p><a href="/login">DISCONNECT FROM TERMINAL</a></p>
           </body>
         </html>`,
        { headers: { 'Content-Type': 'text/html' } }
      )
    }
  }

  return supabaseResponse
}
