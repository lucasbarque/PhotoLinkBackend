import { verifyJWT } from '@/http/middlewares/verify-jwt';
import { FastifyInstance } from 'fastify';

import { changeCover } from './change-cover';
import { create } from './create';
import { getGallery } from './get-gallery';
import { list } from './list';
import { uploadPhotos } from './upload-photos';

export async function galleriesRoutes(app: FastifyInstance) {
  app.post('/galleries/create', { onRequest: [verifyJWT] }, create);
  app.post(
    '/galleries/upload-photos/:id',
    { onRequest: [verifyJWT] },
    uploadPhotos
  );
  app.get('/galleries/get/:id', { onRequest: [verifyJWT] }, getGallery);
  app.get('/galleries/:userId', { onRequest: [verifyJWT] }, list);
  app.patch(
    '/galleries/change-cover/:id',
    { onRequest: [verifyJWT] },
    changeCover
  );
}
