import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { rateLimit } from '@/lib/rate-limit'

const PRODUCTS = [
  'LED Neon',
  'Fachada ACM',
  'Fachada / Letra Caixa',
  'Letra 3D',
  'Adesivos',
  'Comunicação Visual',
]

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'

  if (!rateLimit(ip)) {
    return NextResponse.json({ error: 'Aguarde antes de enviar novamente.' }, { status: 429 })
  }

  const body = await req.json()
  const { name, product, _hp } = body

  // Honeypot — bots preenchem, humanos não
  if (_hp) return NextResponse.json({ ok: true })

  const trimName = (name ?? '').trim()
  if (trimName.length < 2 || trimName.length > 80) {
    return NextResponse.json({ error: 'Nome inválido.' }, { status: 400 })
  }
  if (!PRODUCTS.includes(product)) {
    return NextResponse.json({ error: 'Produto inválido.' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  await supabase.from('leads').insert([{ name: trimName, product }])

  return NextResponse.json({ ok: true })
}
