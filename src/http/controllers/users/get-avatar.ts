import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

let avatarUrl: string = '';
let CACHE_EXPIRATION_TIME = 0;
const CACHE_DURATION_IN_MS = 24 * 60 * 60 * 1000; // 1 dia

export async function getAvatar(request: FastifyRequest, reply: FastifyReply) {
  const changeAvatarParamsSchema = z.object({
    id: z.string(),
  });

  const { id } = changeAvatarParamsSchema.parse(request.params);
  const NOW = Date.now();

  if (!avatarUrl || NOW >= CACHE_EXPIRATION_TIME) {
    try {
      const response = await fetch(
        `https://drive.google.com/uc?export=view&id=${id}`
      );

      if (response.ok) {
        avatarUrl = response.url;
        CACHE_EXPIRATION_TIME = NOW + CACHE_DURATION_IN_MS;
      } else {
        reply.code(response.status).send('Erro ao carregar o avatar.');
        return;
      }
    } catch (error) {
      reply.code(500).send('Erro ao carregar o avatar.');
      return;
    }
  }
  reply.redirect(avatarUrl);
}
