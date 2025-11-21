import { createClient } from '@/lib/supabase';
import { verifyToken } from '@/lib/jwt';
import { newsletterBlogSchema } from '@/lib/validation';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json({ error: 'Authentication required' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return Response.json({ error: 'Invalid token' }, { status: 401 });
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from('newsletter_blogs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return Response.json(data, { status: 200 });
  } catch (error) {
    return Response.json({ error: 'Failed to fetch newsletter/blog subscriptions' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json({ error: 'Authentication required' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return Response.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = newsletterBlogSchema.parse(body);

    const supabase = createClient();
    const { data, error } = await supabase
      .from('newsletter_blogs')
      .insert([validatedData])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return Response.json(data, { status: 201 });
  } catch (error) {
    if (error.name === 'ZodError') {
      return Response.json({ error: 'Invalid data provided', issues: error.errors }, { status: 400 });
    }
    return Response.json({ error: 'Failed to create newsletter/blog subscription' }, { status: 500 });
  }
}