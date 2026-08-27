/**
 * Sliding window rate limiter with a pluggable store.
 *
 * Illustrative version, written for this repository. It is not the file running
 * in production.
 *
 * The naive version of this is a module level `Map`, and it is wrong on any
 * serverless platform. Each instance gets its own memory, the platform starts
 * several instances under load, and a cold start wipes the counter. The limit
 * ends up being per instance instead of per IP, which is close to no limit at
 * all once someone sends requests in parallel.
 *
 * So the store is an interface. Memory is fine for a single long lived process
 * or for a test; anything deployed needs Redis or a table.
 */

export interface JanelaStore {
  /** Registra um hit e devolve quantos hits existem na janela para essa chave. */
  registrar(chave: string, janelaMs: number, agora: number): Promise<number>;
}

/** Só para teste e para processo único. Não usar em serverless. */
export class StoreEmMemoria implements JanelaStore {
  private hits = new Map<string, number[]>();

  async registrar(chave: string, janelaMs: number, agora: number): Promise<number> {
    const corte = agora - janelaMs;
    const anteriores = (this.hits.get(chave) ?? []).filter((t) => t > corte);
    anteriores.push(agora);
    this.hits.set(chave, anteriores);
    return anteriores.length;
  }
}

/**
 * Redis com `ZSET`, que é o que aguenta produção.
 *
 * Remove o que saiu da janela, adiciona o hit, conta e renova o TTL, tudo numa
 * pipeline. A contagem é global entre instâncias, que é o ponto.
 */
export class StoreRedis implements JanelaStore {
  constructor(private readonly redis: RedisMinimo) {}

  async registrar(chave: string, janelaMs: number, agora: number): Promise<number> {
    const k = `rl:${chave}`;
    const [, , contagem] = await this.redis
      .pipeline()
      .zremrangebyscore(k, 0, agora - janelaMs)
      .zadd(k, agora, `${agora}-${Math.random()}`)
      .zcard(k)
      .pexpire(k, janelaMs)
      .exec();
    return Number(contagem);
  }
}

export interface RedisMinimo {
  pipeline(): {
    zremrangebyscore(k: string, min: number, max: number): any;
    zadd(k: string, score: number, membro: string): any;
    zcard(k: string): any;
    pexpire(k: string, ms: number): any;
    exec(): Promise<any[]>;
  };
}

export interface Limite {
  /** Quantos hits a janela aceita. */
  maximo: number;
  /** Tamanho da janela em milissegundos. */
  janelaMs: number;
}

export async function dentroDoLimite(
  store: JanelaStore,
  chave: string,
  limite: Limite,
  agora = Date.now(),
): Promise<{ permitido: boolean; usados: number; restam: number }> {
  const usados = await store.registrar(chave, limite.janelaMs, agora);
  return {
    permitido: usados <= limite.maximo,
    usados,
    restam: Math.max(0, limite.maximo - usados),
  };
}

/**
 * A chave vem do IP, e o IP vem de um header que o cliente pode forjar.
 *
 * `x-forwarded-for` é uma lista, e quem escreve o valor confiável é o proxy da
 * borda, que anexa o IP real no fim. Ler o primeiro item aceita o que o cliente
 * mandou. Em plataforma que expõe um header próprio e já validado, ele ganha.
 */
export function chaveDeOrigem(headers: Headers): string {
  const daPlataforma = headers.get('x-real-ip') ?? headers.get('cf-connecting-ip');
  if (daPlataforma) return daPlataforma.trim();

  const encaminhados = (headers.get('x-forwarded-for') ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return encaminhados.at(-1) ?? 'desconhecido';
}
