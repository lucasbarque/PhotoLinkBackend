import { env } from '@/env';
import { prisma } from '@/lib/prisma';
import { logger, pipelineAsync } from '@/utils';
import Busboy from '@fastify/busboy';
import { randomUUID } from 'node:crypto';
import { createWriteStream } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

import { GalleriesRepository } from '@/repositories/galleries-repository';

const ON_UPLOAD_EVENT = 'file-uploaded';

export default class UploadHandler {
  #io: any;
  #socketId: string;
  #googleDriveClient: any;
  #folderId: string;
  #galleryId: string;
  #galleriesRepository: GalleriesRepository;
  constructor(
    io: any,
    socketId: string,
    googleDriveClient: any,
    folderId: string,
    galleryId: string,
    galleriesRepository: GalleriesRepository
  ) {
    this.#io = io;
    this.#socketId = socketId;
    this.#googleDriveClient = googleDriveClient;
    this.#folderId = folderId;
    this.#galleryId = galleryId;
    this.#galleriesRepository = galleriesRepository;
  }

  registerEvents(headers: any, onFinish: any) {
    const busboy = new Busboy({ headers });
    busboy.on('file', this.#onFile.bind(this));
    busboy.on('finish', onFinish);
    return busboy;
  }

  #handleFileBytes(filename: string) {
    async function* handleData(data: any) {
      for await (const item of data) {
        const size = item.length;
        logger.info(
          //@ts-ignore
          `File [${filename}] got ${size} bytes to ${this.#socketId}`
        );
        //@ts-ignore
        this.#io.to(this.#socketId).emit(ON_UPLOAD_EVENT, size);

        yield item;
      }
    }

    return handleData.bind(this);
  }

  async #uploadToGoogleDrive(file: any) {
    const filename = randomUUID();

    const fileMetadata = {
      name: filename,
      parents: [this.#folderId],
    };

    const media = {
      mimeType: 'application/octet-stream',
      body: file,
    };

    const response = await this.#googleDriveClient.files.create({
      // @ts-ignore
      resource: fileMetadata,
      media,
      field: 'id',
    });

    await this.#galleriesRepository.update(this.#galleryId, {
      photos_count: {
        increment: 1,
      },
    });

    logger.info(
      `File [${filename}] uploaded to Google Drive! File ID: ${response.data.id}`
    );
  }

  async #onFile(_: string, file: any, filename: string) {
    logger.info('Uploading: ' + filename);
    const saveFileTo = join(
      __dirname,
      '../../',
      'downloads',
      randomUUID() + filename
    );

    await pipelineAsync(
      file,
      this.#handleFileBytes.apply(this, [filename]),
      // this.#uploadToGoogleDrive.bind(this, file)
      createWriteStream(saveFileTo)
    );

    logger.info(`File [${filename}] finished!`);
  }
}
