import { createClient } from './client';

export async function getInterviews() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('interview')
    .select(
      `
      *,
      stores(
        name,
        person
      )
    `,
    )

  if (error) throw error;
  return data;
}


