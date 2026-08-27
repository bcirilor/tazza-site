/**
 * Captação de lead, com as quatro camadas na ordem em que elas custam.
 *
 * Versão ilustrativa, escrita para este repositório. Não é o arquivo que roda em
 * produção, e os nomes de campo, a lista de produtos e a camada de persistência
 * foram trocados de propósito.
 *
 * A ordem importa: rejeitar por limite de taxa antes de ler o corpo, rejeitar o
 * bot antes de validar, validar antes de tocar no banco. Cada passo evita o
 * custo do seguinte.
 */
import { dentroDoLimite, chaveDeOrigem, type JanelaStore } from './rate-limit';

/**
 * Produto vem de allowlist, não de texto livre.
 *
 * Texto livre num campo que vira relatório é como categoria vira lixo: em um mês
 * existem quarenta grafias de "fachada". A lista real do site é outra.
 */
const PRODUTOS = ['Categoria A', 'Categoria B', 'Categoria C'] as const;

/**
 * O campo do honeypot é escondido por CSS e nenhum humano o preenche.
 *
 * O nome real não está aqui, e não deveria estar em lugar público: o valor do
 * honeypot depende de o bot não saber qual campo ignorar. Trocar o nome de
 * tempos em tempos custa pouco.
 */
const CAMPO_ARMADILHA = 'campo_oculto';

const LIMITE = { maximo: 5, janelaMs: 60_000 };

export interface Deps {
  store: JanelaStore;
  salvar(lead: { nome: string; produto: string; telefone: string | null }): Promise<void>;
}

/** Aceita `+55` seguido de DDD e número, com 10 ou 11 dígitos. */
function telefoneValido(bruto: unknown): string | null {
  return typeof bruto === 'string' && /^\+55\d{10,11}$/.test(bruto) ? bruto : null;
}

export async function postLead(req: Request, deps: Deps): Promise<Response> {
  const limite = await dentroDoLimite(deps.store, chaveDeOrigem(req.headers), LIMITE);
  if (!limite.permitido) {
    return Response.json(
      { erro: 'Aguarde antes de enviar novamente.' },
      { status: 429, headers: { 'Retry-After': String(LIMITE.janelaMs / 1000) } },
    );
  }

  let corpo: Record<string, unknown>;
  try {
    corpo = await req.json();
  } catch {
    return Response.json({ erro: 'Corpo inválido.' }, { status: 400 });
  }

  // Bot preencheu a armadilha. Responder 200 sem gravar: um 400 aqui ensina o
  // bot que foi barrado, e ele volta ajustado.
  if (corpo[CAMPO_ARMADILHA]) return Response.json({ ok: true });

  const nome = String(corpo.nome ?? '').trim();
  if (nome.length < 2 || nome.length > 80) {
    return Response.json({ erro: 'Nome inválido.' }, { status: 400 });
  }

  const produto = String(corpo.produto ?? '');
  if (!PRODUTOS.includes(produto as (typeof PRODUTOS)[number])) {
    return Response.json({ erro: 'Produto inválido.' }, { status: 400 });
  }

  await deps.salvar({ nome, produto, telefone: telefoneValido(corpo.telefone) });
  return Response.json({ ok: true });
}
