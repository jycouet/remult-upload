import { Fields, Entity, BackendMethod, isBackend, remult } from "remult";
import type { deleteInS3, base64ToS3, getFromS3 } from "./server";

@Entity<Media>("media", {
  allowApiCrud: true,
  async deleting(entity, e) {
    if (isBackend()) {
      try {
        await Media.abstractDeleteInS3(Media.getKey(entity));
      } catch (error) {
        console.log("error", error);
        e.preventDefault();
      }
    }
  },
})
export class Media {
  @Fields.cuid()
  id!: string;
  @Fields.updatedAt()
  updatedAt = new Date();
  @Fields.string({ includeInApi: false })
  folder!: string;
  @Fields.date()
  fileLastModified!: Date;
  @Fields.string()
  fileName!: string;
  @Fields.string()
  fileType!: string;
  // @Fields.string<Media>({
  //   saving: (e) => {
  //     e.userId = remult.user?.id;
  //   },
  // })
  // userId?: string;

  @Fields.string<Media>({
    serverExpression: () => "",
    async saving(entity, fieldRef, e) {
      if (isBackend()) {
        try {
          await Media.abstractBase64ToS3(
            Media.getKey(entity),
            entity.base64 ?? ""
          );
        } catch (error) {
          console.log("error", error);
          e.preventDefault();
        }
        entity.base64 = "";
      }
    },
  })
  base64?: string;

  static getKey(e: Partial<Media>) {
    const key = [];
    if (e.folder) {
      key.push(e.folder);
    }
    key.push(e.id);
    return key.join("/");
  }

  static abstractBase64ToS3: typeof base64ToS3;
  static abstractGetFromS3: typeof getFromS3;
  static abstractDeleteInS3: typeof deleteInS3;

  @BackendMethod({ allowed: true })
  static async getFromS3(e: Partial<Media>) {
    return Media.abstractGetFromS3(Media.getKey(e));
  }
}

@Entity<MediaWithUrl>("MediaWithUrl", {
  dbName: "media",
  allowApiCrud: true,
})
export class MediaWithUrl extends Media {
  @Fields.string<MediaWithUrl>({
    serverExpression: async (e) => {
      return (await Media.getFromS3(e)).url;
    },
  })
  url!: string;
}

// // //

@Entity<AppMedia>("AppMedia", {
  allowApiCrud: false,
})
export class AppMedia extends Media {}
