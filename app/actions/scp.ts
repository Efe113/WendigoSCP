'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { calculateEscalatedClearance } from '@/utils/clearanceCalculator'

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
    const base_clearance = parseInt(formData.get('clearance_level_required') as string, 10)
    const addenda_json = formData.get('addenda_json') as string || '[]'
    const resources_json = formData.get('resources_json') as string || '[]'
    const metadata_json = formData.get('metadata_json') as string || '{}'

    if (!item_number || !codename || !object_class || !containment_procedures || !description || isNaN(base_clearance)) {
      return { error: 'All fields are required.' }
    }

    if (!/^SCP-\d+$/i.test(item_number)) {
      return { error: 'Item number must be in format SCP-XXXX (e.g. SCP-173).' }
    }

    // Parse nested arrays
    const addenda = JSON.parse(addenda_json)
    const resources = JSON.parse(resources_json)
    const metadata = JSON.parse(metadata_json)

    // Calculate dynamic escalated clearance level
    const clearance_level_required = calculateEscalatedClearance(base_clearance, metadata)

    // Insert main SCP item
    const { data: newItem, error: itemError } = await supabase
      .from('scp_items')
      .insert({
        item_number: item_number.toUpperCase(),
        codename,
        object_class,
        containment_procedures,
        description,
        clearance_level_required,
        metadata,
      })
      .select('id')
      .single()

    if (itemError) {
      if (itemError.code === '23505') {
        return { error: `Item ${item_number.toUpperCase()} already exists in the database.` }
      }
      return { error: itemError.message }
    }

    // Insert addenda if any
    if (addenda.length > 0) {
      const addendaToInsert = addenda.map((ad: any) => ({
        scp_item_id: newItem.id,
        title: ad.title,
        content: ad.content,
        type: ad.type,
        clearance_level_required: parseInt(ad.clearance_level_required, 10) || 1,
      }))

      const { error: addendaError } = await supabase
        .from('scp_addenda')
        .insert(addendaToInsert)

      if (addendaError) {
        // Rollback parent insertion
        await supabase.from('scp_items').delete().eq('id', newItem.id)
        return { error: `Failed to insert addenda: ${addendaError.message}` }
      }
    }

    // Insert resources if any
    if (resources.length > 0) {
      const resourcesToInsert = resources.map((res: any) => ({
        scp_item_id: newItem.id,
        caption: res.caption || '',
        url: res.url,
        type: res.type,
      }))

      const { error: resourcesError } = await supabase
        .from('scp_resources')
        .insert(resourcesToInsert)

      if (resourcesError) {
        // Rollback parent insertion
        await supabase.from('scp_items').delete().eq('id', newItem.id)
        return { error: `Failed to insert media resources: ${resourcesError.message}` }
      }
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
    const base_clearance = parseInt(formData.get('clearance_level_required') as string, 10)
    const metadata_json = formData.get('metadata_json') as string || '{}'

    if (!id || !item_number || !codename || !object_class || !containment_procedures || !description || isNaN(base_clearance)) {
      return { error: 'All fields are required.' }
    }

    const metadata = JSON.parse(metadata_json)
    
    // Calculate dynamic escalated clearance level
    const clearance_level_required = calculateEscalatedClearance(base_clearance, metadata)

    const { error } = await supabase
      .from('scp_items')
      .update({
        item_number: item_number.toUpperCase(),
        codename,
        object_class,
        containment_procedures,
        description,
        clearance_level_required,
        metadata,
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
  const profession = formData.get('profession') as string || 'Researcher'
  const rank = formData.get('rank') as string || 'Level 1 Personnel (Junior)'

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
        profession,
        rank,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  return { success: true }
}

export async function updateUserProfile(prevState: any, formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Authentication required.' }
    }

    const username = formData.get('username') as string
    const profession = formData.get('profession') as string
    const rank = formData.get('rank') as string

    if (!username || !profession || !rank) {
      return { error: 'Username, profession, and rank are required.' }
    }

    const { error } = await supabase
      .from('user_profiles')
      .update({
        username,
        profession,
        rank,
      })
      .eq('id', user.id)

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/')
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'An unexpected error occurred.' }
  }
}

export async function updateUserStatus(userId: string, newStatus: 'approved' | 'suspended' | 'rejected') {
  try {
    const supabase = await createClient()
    const { profile } = await getUserClearance()

    if (!profile?.is_o5_1) {
      return { error: 'SECURITY VIOLATION: O5-1 CREDENTIALS REQUIRED.' }
    }

    const { error } = await supabase
      .from('user_profiles')
      .update({ status: newStatus })
      .eq('id', userId)

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/')
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'An unexpected error occurred.' }
  }
}

export async function updateSystemConfig(key: string, value: string) {
  try {
    const supabase = await createClient()
    const { profile } = await getUserClearance()

    if (!profile?.is_o5_1) {
      return { error: 'SECURITY VIOLATION: O5-1 CREDENTIALS REQUIRED.' }
    }

    const { error } = await supabase
      .from('system_config')
      .upsert({ key, value })

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/')
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'An unexpected error occurred.' }
  }
}

export async function createCustomRole(prevState: any, formData: FormData) {
  try {
    const supabase = await createClient()
    const { profile } = await getUserClearance()

    if (!profile?.is_o5_1) {
      return { error: 'SECURITY VIOLATION: O5-1 CREDENTIALS REQUIRED.' }
    }

    const role_type = formData.get('role_type') as string
    const title = formData.get('title') as string
    const clearance_level = parseInt(formData.get('clearance_level') as string, 10)
    const description = formData.get('description') as string
    const purpose = formData.get('purpose') as string
    const department = formData.get('department') as string
    const responsibilities = formData.get('responsibilities') as string
    const equipment_auth = formData.get('equipment_auth') as string
    const reporting_to = formData.get('reporting_to') as string
    const hazard_allowance = formData.get('hazard_allowance') as string
    const psych_eval_freq = formData.get('psych_eval_freq') as string
    const weapons_auth = formData.get('weapons_auth') as string
    const anomaly_limit = formData.get('anomaly_limit') as string
    const medical_freq = formData.get('medical_freq') as string
    const site_access = formData.get('site_access') as string
    const override_code = formData.get('override_code') as string
    const termination_protocol = formData.get('termination_protocol') as string
    const amnestic_susceptibility = formData.get('amnestic_susceptibility') as string
    const active_status = formData.get('active_status') as string
    const notes = formData.get('notes') as string

    if (!role_type || !title || isNaN(clearance_level) || !description || !purpose || !department || !responsibilities || !equipment_auth || !reporting_to || !hazard_allowance || !psych_eval_freq || !weapons_auth || !anomaly_limit || !medical_freq || !site_access || !override_code || !termination_protocol || !amnestic_susceptibility || !active_status) {
      return { error: 'All 20+ required fields must be populated.' }
    }

    const { error } = await supabase
      .from('custom_roles')
      .insert({
        role_type,
        title,
        clearance_level,
        description,
        purpose,
        department,
        responsibilities,
        equipment_auth,
        reporting_to,
        hazard_allowance,
        psych_eval_freq,
        weapons_auth,
        anomaly_limit,
        medical_freq,
        site_access,
        override_code,
        termination_protocol,
        amnestic_susceptibility,
        active_status,
        notes,
      })

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/')
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'An unexpected error occurred.' }
  }
}

export async function submitComplaint(prevState: any, formData: FormData) {
  try {
    const supabase = await createClient()

    const sender_name = formData.get('sender_name') as string || 'ANONYMOUS'
    const subject = formData.get('subject') as string
    const complaint_body = formData.get('complaint_body') as string
    const target_user_id = formData.get('target_user_id') as string || null

    if (!subject || !complaint_body) {
      return { error: 'Subject and complaint body are required.' }
    }

    const { error } = await supabase
      .from('ethics_complaints')
      .insert({
        sender_name,
        subject,
        complaint_body,
        target_user_id: target_user_id === '' ? null : target_user_id,
      })

    if (error) {
      return { error: error.message }
    }

    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'An unexpected error occurred.' }
  }
}

export async function resolveComplaint(prevState: any, formData: FormData) {
  try {
    const supabase = await createClient()
    const { profile } = await getUserClearance()

    if (!profile?.is_o5_1 && profile?.profession !== 'Ethics Committee Liaison') {
      return { error: 'SECURITY VIOLATION: ETHICS LIAISON OR O5 CREDENTIALS REQUIRED.' }
    }

    const complaint_id = formData.get('complaint_id') as string
    const status = formData.get('status') as 'under_investigation' | 'resolved' | 'dismissed'
    const action_taken = formData.get('action_taken') as string
    const reviewer_notes = formData.get('reviewer_notes') as string
    const target_user_id = formData.get('target_user_id') as string

    if (!complaint_id || !status) {
      return { error: 'Complaint ID and status are required.' }
    }

    // Begin updates
    const { error: complaintError } = await supabase
      .from('ethics_complaints')
      .update({
        status,
        action_taken,
        reviewer_notes,
      })
      .eq('id', complaint_id)

    if (complaintError) {
      return { error: complaintError.message }
    }

    // If disciplinary actions trigger account status changes
    if (target_user_id && action_taken) {
      let newProfileStatus: 'approved' | 'suspended' = 'approved'
      if (action_taken.toLowerCase().includes('suspend') || action_taken.toLowerCase().includes('close') || action_taken.toLowerCase().includes('terminate')) {
        newProfileStatus = 'suspended'
      }

      if (newProfileStatus === 'suspended') {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .update({ status: 'suspended' })
          .eq('id', target_user_id)

        if (profileError) {
          return { error: `Complaint resolved, but user profile update failed: ${profileError.message}` }
        }
      }
    }

    revalidatePath('/')
    revalidatePath('/ethics/dashboard')
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'An unexpected error occurred.' }
  }
}


