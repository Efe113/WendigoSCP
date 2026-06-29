'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

// Authorization check helper
async function verifyAuthorityClearance() {
  const { currentLevel } = await getUserClearance()
  if (currentLevel < 4) {
    throw new Error('SECURITY VIOLATION: LEVEL 4+ SECURITY CREDENTIALS REQUIRED FOR MUTATION.')
  }
}

export async function createScpItem(prevState: any, formData: FormData) {
  try {
    const supabase = await createClient()

    const item_number = formData.get('item_number') as string
    const codename = formData.get('codename') as string
    const object_class = formData.get('object_class') as string
    const containment_procedures = formData.get('containment_procedures') as string
    const description = formData.get('description') as string
    const clearance_level_required = parseInt(formData.get('clearance_level_required') as string, 10)

    if (!item_number || !codename || !object_class || !containment_procedures || !description || isNaN(clearance_level_required)) {
      return { error: 'All fields are required.' }
    }

    if (!/^SCP-\d+$/i.test(item_number)) {
      return { error: 'Item number must be in format SCP-XXXX (e.g. SCP-173).' }
    }

    const { error } = await supabase.from('scp_items').insert({
      item_number: item_number.toUpperCase(),
      codename,
      object_class,
      containment_procedures,
      description,
      clearance_level_required,
    })

    if (error) {
      if (error.code === '23505') {
        return { error: `Item ${item_number.toUpperCase()} already exists in the database.` }
      }
      return { error: error.message }
    }

    revalidatePath('/')
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'An unexpected error occurred.' }
  }
}

export async function updateScpItem(prevState: any, formData: FormData) {
  try {
    await verifyAuthorityClearance()
    const supabase = await createClient()

    const id = formData.get('id') as string
    const item_number = formData.get('item_number') as string
    const codename = formData.get('codename') as string
    const object_class = formData.get('object_class') as string
    const containment_procedures = formData.get('containment_procedures') as string
    const description = formData.get('description') as string
    const clearance_level_required = parseInt(formData.get('clearance_level_required') as string, 10)

    if (!id || !item_number || !codename || !object_class || !containment_procedures || !description || isNaN(clearance_level_required)) {
      return { error: 'All fields are required.' }
    }

    const { error } = await supabase
      .from('scp_items')
      .update({
        item_number: item_number.toUpperCase(),
        codename,
        object_class,
        containment_procedures,
        description,
        clearance_level_required,
      })
      .eq('id', id)

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/')
    revalidatePath(`/scp/${item_number.toLowerCase()}`)
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'An unexpected error occurred.' }
  }
}

export async function deleteScpItem(id: string, item_number: string) {
  try {
    await verifyAuthorityClearance()
    const supabase = await createClient()

    const { error } = await supabase
      .from('scp_items')
      .delete()
      .eq('id', id)

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/')
    revalidatePath(`/scp/${item_number.toLowerCase()}`)
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'An unexpected error occurred.' }
  }
}

// Addenda management Actions
export async function addAddendum(prevState: any, formData: FormData) {
  try {
    await verifyAuthorityClearance()
    const supabase = await createClient()

    const scp_item_id = formData.get('scp_item_id') as string
    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const type = formData.get('type') as string
    const clearance_level_required = parseInt(formData.get('clearance_level_required') as string, 10)
    const item_number = formData.get('item_number') as string

    if (!scp_item_id || !title || !content || !type || isNaN(clearance_level_required)) {
      return { error: 'All fields are required.' }
    }

    const { error } = await supabase.from('scp_addenda').insert({
      scp_item_id,
      title,
      content,
      type,
      clearance_level_required,
    })

    if (error) {
      return { error: error.message }
    }

    revalidatePath(`/scp/${item_number.toLowerCase()}`)
    revalidatePath(`/scp/${item_number.toLowerCase()}/edit`)
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'An unexpected error occurred.' }
  }
}

export async function deleteAddendum(id: string, item_number: string) {
  try {
    await verifyAuthorityClearance()
    const supabase = await createClient()

    const { error } = await supabase
      .from('scp_addenda')
      .delete()
      .eq('id', id)

    if (error) {
      return { error: error.message }
    }

    revalidatePath(`/scp/${item_number.toLowerCase()}`)
    revalidatePath(`/scp/${item_number.toLowerCase()}/edit`)
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'An unexpected error occurred.' }
  }
}

// Resource management Actions
export async function addResource(prevState: any, formData: FormData) {
  try {
    await verifyAuthorityClearance()
    const supabase = await createClient()

    const scp_item_id = formData.get('scp_item_id') as string
    const caption = formData.get('caption') as string
    const url = formData.get('url') as string
    const type = formData.get('type') as string
    const item_number = formData.get('item_number') as string

    if (!scp_item_id || !url || !type) {
      return { error: 'All fields are required.' }
    }

    const { error } = await supabase.from('scp_resources').insert({
      scp_item_id,
      caption,
      url,
      type,
    })

    if (error) {
      return { error: error.message }
    }

    revalidatePath(`/scp/${item_number.toLowerCase()}`)
    revalidatePath(`/scp/${item_number.toLowerCase()}/edit`)
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'An unexpected error occurred.' }
  }
}

export async function deleteResource(id: string, item_number: string) {
  try {
    await verifyAuthorityClearance()
    const supabase = await createClient()

    const { error } = await supabase
      .from('scp_resources')
      .delete()
      .eq('id', id)

    if (error) {
      return { error: error.message }
    }

    revalidatePath(`/scp/${item_number.toLowerCase()}`)
    revalidatePath(`/scp/${item_number.toLowerCase()}/edit`)
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'An unexpected error occurred.' }
  }
}

// Auth management Actions
export async function setSimulatedClearance(level: number) {
  const cookieStore = await cookies()
  if (level === 0) {
    cookieStore.delete('scp_clearance_override')
  } else {
    cookieStore.set('scp_clearance_override', level.toString(), { maxAge: 60 * 60 * 24 })
  }
  revalidatePath('/')
}

export async function updateRealClearance(level: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Must be authenticated to update user profile.' }
  }

  const { error } = await supabase
    .from('user_profiles')
    .update({ clearance_level: level })
    .eq('id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  return { success: true }
}

export async function getUserClearance() {
  const supabase = await createClient()
  const cookieStore = await cookies()
  
  const override = cookieStore.get('scp_clearance_override')?.value
  const simulatedLevel = override ? parseInt(override, 10) : null

  const { data: { user } } = await supabase.auth.getUser()
  let profile = null
  let realLevel = 1

  if (user) {
    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    if (data) {
      profile = data
      realLevel = data.clearance_level
    }
  }

  return {
    user,
    profile,
    realLevel,
    simulatedLevel,
    currentLevel: simulatedLevel !== null ? simulatedLevel : realLevel,
  }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/')
}

export async function login(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  return { success: true }
}

export async function signup(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const username = formData.get('username') as string

  if (!email || !password || !username) {
    return { error: 'Username, email and password are required.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  return { success: true }
}
