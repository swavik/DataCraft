import { supabase } from '@/lib/supabase'

export const testSupabaseConnection = async () => {
  try {
    // Test basic connection
    const { data, error } = await supabase.from('profiles').select('count').limit(1)
    if (error) {
      console.error('Supabase connection test failed:', error)
      return { success: false, error: error.message }
    }

    console.log('Supabase connection successful')
    return { success: true, data }
  } catch (err) {
    console.error('Supabase connection error:', err)
    return { success: false, error: err.message }
  }
}

export const checkUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching user profile:', error)
      return { success: false, error: error.message }
    }

    console.log('User profile:', data)
    return { success: true, data }
  } catch (err) {
    console.error('Error checking user profile:', err)
    return { success: false, error: err.message }
  }
}