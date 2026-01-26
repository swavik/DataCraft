import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface Profile {
  full_name: string;
  phone_number: string;
  email: string;
}

interface AuthContextType {
  user: User | null
  profile: Profile | null // Added profile state
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, name?: string, phoneNumber?: string) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  // Temporarily disable Supabase calls to prevent "Failed to fetch" errors
  const SUPABASE_ENABLED = true

  // Function to fetch profile from the public.profiles table
  const fetchProfile = async (userId: string) => {
    if (!SUPABASE_ENABLED) return

    try {
      console.log('Fetching profile for user:', userId)

      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, phone_number, email')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        return
      }

      console.log('Profile fetched successfully:', data)
      setProfile(data)
    } catch (error) {
      console.error('Error in fetchProfile:', error)
    }
  }

  useEffect(() => {
    if (!SUPABASE_ENABLED) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error)
        setLoading(false)
        return
      }
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      setLoading(false)
    }).catch((error) => {
      console.error('Error in getSession:', error)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, name?: string, phoneNumber?: string) => {
    if (!SUPABASE_ENABLED) {
      // Mock successful signup for development
      console.log('Mock signup:', { email, name, phoneNumber })
      return { error: null }
    }

    try {
      console.log('Signing up user:', { email, name, phoneNumber })

      const result = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || '',
            phone_number: phoneNumber || '',
          }
        }
      })

      console.log('Supabase signup result:', result)

      if (result.error) {
        console.error('Signup error:', result.error)
      } else {
        console.log('Signup successful, user data:', result.data.user)
        console.log('User metadata:', result.data.user?.user_metadata)
        console.log('User app_metadata:', result.data.user?.app_metadata)
      }

      return result
    } catch (error) {
      console.error('Error in signUp:', error)
      return { error }
    }
  }

  const signIn = async (email: string, password: string) => {
    if (!SUPABASE_ENABLED) {
      // Mock successful signin for development
      console.log('Mock signin:', { email })
      setUser({ id: 'mock-user', email } as User)
      return { error: null }
    }

    try {
      return await supabase.auth.signInWithPassword({ email, password })
    } catch (error) {
      console.error('Error in signIn:', error)
      return { error }
    }
  }

  const signOut = async () => {
    if (!SUPABASE_ENABLED) {
      console.log('Mock signout')
      setUser(null)
      setProfile(null)
      setSession(null)
      return
    }

    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Error in signOut:', error)
    }
  }

  const value = { user, profile, session, loading, signUp, signIn, signOut }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}