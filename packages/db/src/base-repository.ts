import { db } from './client.js'

export interface Entity {
  id: string
}

export async function findById<T extends Entity>(table: string, id: string): Promise<T | null> {
  const { data, error } = await db.from(table).select('*').eq('id', id).single()
  if (error) return null
  return data as T
}

export async function findAll<T extends Entity>(
  table: string,
  filters: Record<string, unknown> = {},
): Promise<T[]> {
  let query = db.from(table).select('*')

  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined) query = query.eq(key, value as string)
  }

  const { data, error } = await query
  if (error) throw new Error(`${table}.findAll: ${error.message}`)
  return (data ?? []) as T[]
}

export async function update<T extends Entity>(
  table: string,
  id: string,
  data: Partial<Omit<T, 'id'>>,
): Promise<T> {
  const { data: updated, error } = await db
    .from(table)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .update(data as any)
    .eq('id', id)
    .select('*')
    .single()

  if (error || !updated) throw new Error(`${table}.update: ${error?.message}`)
  return updated as T
}

export async function deleteById(table: string, id: string): Promise<void> {
  const { error } = await db.from(table).delete().eq('id', id)
  if (error) throw new Error(`${table}.deleteById: ${error.message}`)
}
