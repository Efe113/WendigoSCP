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

  const crtStyles = `
    @keyframes flicker {
      0% { opacity: 0.98; }
      50% { opacity: 1; }
      100% { opacity: 0.99; }
    }
    body { 
      background: #030303; 
      font-family: monospace; 
      padding: 50px; 
      text-align: center; 
      position: relative; 
      animation: flicker 0.15s infinite;
      overflow: hidden;
      margin: 0;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .scanlines {
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100%;
      background: linear-gradient(
        rgba(18, 16, 16, 0) 50%, 
        rgba(0, 0, 0, 0.3) 50%
      );
      background-size: 100% 4px;
      z-index: 99;
      pointer-events: none;
    }
    .vignette {
      position: fixed;
      inset: 0;
      background: radial-gradient(circle, transparent 60%, rgba(0,0,0,0.85) 100%);
      z-index: 100;
      pointer-events: none;
    }
    .container {
      border: 1px solid currentColor;
      background: rgba(0,0,0,0.8);
      padding: 40px;
      max-width: 600px;
      width: 90%;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.8);
      z-index: 10;
      position: relative;
    }
    h1 { 
      text-shadow: 0 0 8px currentColor; 
      font-size: 20px; 
      margin-bottom: 20px; 
      letter-spacing: 2px;
    }
    p { font-size: 12px; margin: 12px 0; }
    a { 
      color: inherit; 
      text-decoration: none; 
      border: 1px solid currentColor; 
      padding: 8px 18px; 
      font-size: 11px; 
      font-weight: bold; 
      transition: all 0.2s; 
      background: transparent;
      display: inline-block;
      margin-top: 20px;
    }
    a:hover { 
      background: currentColor; 
      color: #000;
      box-shadow: 0 0 10px currentColor; 
    }
  `

  // Enforce Maintenance Mode
  if (isMaintenance && !profile?.is_o5_1 && !isPublicPage) {
    return new Response(
      `<html>
         <head>
           <title>SCP TERMINAL - OFFLINE</title>
           <style>
             ${crtStyles}
             body { color: #ff3333; }
           </style>
         </head>
         <body>
           <div class="scanlines"></div>
           <div class="vignette"></div>
           <div class="container">
             <div style="font-size:30px; margin-bottom:15px;">&#9888;</div>
             <h1>[SYSTEM LOCKDOWN - MAINTENANCE IN PROGRESS]</h1>
             <p style="color: #00ff66;">DATABASE NODE OFFLINE FOR O5 LEVEL BACKUP AND ENCRYPTION UPGRADES.</p>
             <p style="color: #666; font-size: 10px;">TIMESTAMP: ${new Date().toISOString()}</p>
             <a href="/login">O5 COMMAND LOGIN</a>
           </div>
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
               ${crtStyles}
               body { color: #ffaa00; }
             </style>
           </head>
           <body>
             <div class="scanlines"></div>
             <div class="vignette"></div>
             <div class="container">
               <div style="font-size:30px; margin-bottom:15px;">&#8987;</div>
               <h1>[ACCESS AWAITING OVERSEER APPROVAL]</h1>
               <p style="color: #00ff66;">YOUR AGENT REGISTRATION FORM HAS BEEN TRANSMITTED TO O5-1 DIRECT CONTROL PANEL.</p>
               <p style="color: #666; font-size: 10px;">AGENT IDENTIFIER: ${user.id}</p>
               <p style="color: #666; font-size: 10px;">STATUS: AWAITING AUTHORIZATION</p>
               <a href="/login">ACCESS PROFILE (DISCONNECT)</a>
             </div>
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
               ${crtStyles}
               body { color: #ff3333; }
             </style>
           </head>
           <body>
             <div class="scanlines"></div>
             <div class="vignette"></div>
             <div class="container">
               <div style="font-size:30px; margin-bottom:15px;">&#9760;</div>
               <h1>[ACCESS TERMINATED - ACCOUNT SUSPENDED]</h1>
               <p>THIS ACCOUNT HAS BEEN SUSPENDED OR CLOSED BY THE ETHICS COMMITTEE FOR SECURITY VIOLATIONS.</p>
               <p style="color: #666; font-size: 10px;">CASE STATUS: RESOLVED - CLASS-A AMNESTICS ORDERED</p>
               <a href="/login">DISCONNECT FROM TERMINAL</a>
             </div>
           </body>
         </html>`,
        { headers: { 'Content-Type': 'text/html' } }
      )
    }
  }

  return supabaseResponse
}
