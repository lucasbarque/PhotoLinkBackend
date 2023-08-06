import { logger, pipelineAsync } from '@/utils';
import Busboy from '@fastify/busboy';

const ON_UPLOAD_EVENT = 'file-uploaded';

export default class UploadHandler {
  #io: any;
  #socketId: string;
  constructor(io: any, socketId: string) {
    this.#io = io;
    this.#socketId = socketId;
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
          `File [${filename}] got ${size} bytes to ${this.#socketId}`
        );
        // this.#io.to(this.#socketId).emit(ON_UPLOAD_EVENT, size);

        yield item;
      }
    }

    return handleData.bind(this);
  }

  async #onFile(fieldname: string, file: any, filename: string) {
    logger.info('Uploading: ' + filename);

    await pipelineAsync(
      file,
      this.#handleFileBytes.apply(this, [filename])
      // createWriteStream(saveFileTo) //Upload Google Drive
    );

    logger.info(`File [${filename}] finished!`);
  }
}
