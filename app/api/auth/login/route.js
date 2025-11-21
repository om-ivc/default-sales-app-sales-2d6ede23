import { createClient } from '@/lib/supabase'
import { validateLogin } from '@/lib/validation'
import { createToken } from '@/lib/jwt'
import bcrypt from 'bcryptjs'

export async function POST(request) {
  try {
    const supabase = createClient()
    const body = await request.json()

    const validation = validateLogin(body)
    if (!validation.success) {
      return Response.json(
        { error: 'Invalid input', details: validation.error.flatten() },
        { status: 400 }
      )
    }

    const { email, password } = validation.data

    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, password_hash, name')
      .eq('email', email)
      .single()

    if (error || !user) {
      return Response.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash)
    if (!isPasswordValid) {
      return Response.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const token = createToken({ 
      id: user.id, 
      email: user.email,
      name: user.name
    })

    const { password_hash, ...userWithoutPassword } = user

    return Response.json({
      user: userWithoutPassword,
      token
    }, { status: 200 })

  } catch (error) {
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}