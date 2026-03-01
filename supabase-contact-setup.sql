-- Create contact_messages table
CREATE TABLE public.contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policy for public insert (anyone can send a message)
CREATE POLICY "Anyone can insert contact messages." ON public.contact_messages
  FOR INSERT WITH CHECK (true);

-- Create policy for viewing messages
CREATE POLICY "Authenticated users can view contact messages." ON public.contact_messages
  FOR SELECT USING (auth.role() = 'authenticated');
