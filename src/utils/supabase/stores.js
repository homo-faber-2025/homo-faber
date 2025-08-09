import { createClient } from './client';

export async function getStores() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('stores')
    .select(
      `
      *,
      store_contacts(
        phone,
        email,
        website
      ),
      store_tags(
        industry_types(name),
        capacity_types(name),
        material_types(name)
      )
    `,
    )
    .order('name');

  if (error) throw error;
  return data;
}

export async function getStoreById(id) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('stores')
    .select(
      `
      *,
      store_contacts(
        phone,
        email,
        website
      ),
      store_tags(
        industry_types(name),
        capacity_types(name),
        material_types(name)
      )
    `,
    )
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}
