// app/api/admin/events/route.ts
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseClient'

export async function GET() {
  // List all for admin dashboard
  const { data, error } = await supabaseAdmin
    .from('events')
    .select('*')
    .order('event_date', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const { event_date, title, time, venue } = await req.json()
  const { data, error } = await supabaseAdmin
    .from('events')
    .insert([{ event_date, title, time: time || null, venue: venue || null }])
    .select()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

export async function DELETE(req: Request) {
  const { id } = await req.json()
  const { error } = await supabaseAdmin
    .from('events')
    .delete()
    .eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
