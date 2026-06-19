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
  const { name, product, phone, _hp } = body

  // Honeypot — bots preenchem, humanos não
  if (_hp) return NextResponse.json({ ok: true })

  const trimName = (name ?? '').trim()
  if (trimName.length < 2 || trimName.length > 80) {
    return NextResponse.json({ error: 'Nome inválido.' }, { status: 400 })
  }
  if (!PRODUCTS.includes(product)) {
    return NextResponse.json({ error: 'Produto inválido.' }, { status: 400 })
  }

  // Telefone é opcional; aceita só E.164 BR (+55 + 10/11 dígitos)
  const cleanPhone =
    typeof phone === 'string' && /^\+55\d{10,11}$/.test(phone) ? phone : null

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  // Insert com phone; se a coluna `phone` ainda não existir, refaz sem ela
  // para nunca perder o lead.
  if (cleanPhone) {
    const { error } = await supabase
      .from('leads')
      .insert([{ name: trimName, product, phone: cleanPhone }])
    if (error) {
      await supabase.from('leads').insert([{ name: trimName, product }])
    }
  } else {
    await supabase.from('leads').insert([{ name: trimName, product }])
  }

  return NextResponse.json({ ok: true })
}
