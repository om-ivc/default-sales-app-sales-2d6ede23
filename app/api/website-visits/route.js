import { createClient } from '@/lib/supabase';
import { verifyToken } from '@/lib/jwt';
import { websiteVisitSchema } from '@/lib/validation';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json(
        { error: 'Unauthorized: No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return Response.json(
        { error: 'Unauthorized: Invalid token' },
        { status: 401 }
      );
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from('website_visits')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return Response.json(
        { error: 'Failed to fetch website visits' },
        { status: 500 }
      );
    }

    return Response.json({ 
      data,
      count: data.length
    });
  } catch (err) {
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json(
        { error: 'Unauthorized: No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return Response.json(
        { error: 'Unauthorized: Invalid token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = websiteVisitSchema.parse(body);

    const supabase = createClient();
    const { data, error } = await supabase
      .from('website_visits')
      .insert([validatedData])
      .select()
      .single();

    if (error) {
      return Response.json(
        { error: 'Failed to create website visit record' },
        { status: 500 }
      );
    }

    return Response.json({ 
      message: 'Website visit record created successfully',
      data 
    }, { status: 201 });
  } catch (err) {
    if (err.name === 'ZodError') {
      return Response.json(
        { error: 'Validation error', details: err.errors },
        { status: 400 }
      );
    }

    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}