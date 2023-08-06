import { pipeline } from 'node:stream';
import { promisify } from 'node:util';
import pino from 'pino';

export const pipelineAsync = promisify(pipeline);

export const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});
