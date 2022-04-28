import { FileUpload } from "graphql-upload";
import ApolloUploadError from "./apolloErrors/ApolloUploadError";
import shortId from "shortid";
import { createWriteStream, unlink } from "fs";

export enum FilePurpose {
  AVATAR = "/public/uploads/avatars/",
  TEST_AUDIO = "/public/uploads/tests/audio/",
  TEST_IMAGE = "/public/uploads/tests/images/",
}

const storeUpload = async (
  upload: Promise<FileUpload> | undefined,
  purpose: FilePurpose
): Promise<string | undefined> => {
  try {
    if (!upload) return undefined;

    const { createReadStream, filename } = await upload;
    const stream = createReadStream();
    const id = shortId.generate();
    const path = `.${purpose}${id}-${filename}`;
    const storedFilename = path.substring(1);

    await new Promise((resolve, reject) => {
      const writeStream = createWriteStream(path);
      writeStream.on("finish", resolve);
      writeStream.on("error", (error) => {
        unlink(path, () => reject(error));
      });

      stream.on("error", (error) => writeStream.destroy(error));
      stream.pipe(writeStream);
    });

    return storedFilename;
  } catch (e) {
    throw new ApolloUploadError();
  }
};

export default storeUpload;
