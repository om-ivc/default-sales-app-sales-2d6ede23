import { createClient } from '@supabase/supabase-js';
import { hash } from 'bcryptjs';
import { z } from 'zod';
import { NextResponse } from 'next/server';

const UserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export async function POST(request) {
  try {
    const body = await request.json();

    // Validate input
    const parsed = UserSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    // Initialize Supabase client with service role key for admin access
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Check if user already exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw new Error(`Database error: ${fetchError.message}`);
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Insert new user
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          name,
          email,
          password: hashedPassword,
          created_at: new Date().toISOString()
        }
      ])
      .select('id, name, email, created_at')
      .single();

    if (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }

    return NextResponse.json(
      {
        message: 'User registered successfully',
        user: {
          id: data.id,
          name: data.name,
          email: data.email,
          created_at: data.created_at
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);

    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error.message || 'Something went wrong during registration'
      },
      { status: 500 }
    );
  }
}