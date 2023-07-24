import { z } from "zod";

import { FileType } from "@acme/db";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { s3 } from "./utils";

export const uploadRouter = createTRPCRouter({
  uploadSong: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        albumName: z.string(),
        artistName: z.string(),
        image: z.object({
          key: z.string(),
          url: z.string(),
        }),
      }),
    )
    .mutation(({ input }) => {
      try {
        console.log(
          "uploadSong",
          input.name,
          input.albumName,
          input.artistName,
        );
        return;
      } catch (error) {
        console.log(error);
      }
    }),
  getPrsignedUrl: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        type: z.enum([FileType.AUDIO, FileType.IMAGE]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const metaData = await ctx.prisma.filMetadata.create({
          data: {
            name: input.name,
            type: input.type,
            createdBy: {
              connect: {
                id: ctx?.userId,
              },
            },
          },
        });

        const extention = input.type === FileType.AUDIO ? "mp3" : "jpg";
        const Key = `${ctx?.userId}/${metaData.id}.${
          input.type === FileType.AUDIO ? "mp3" : "jpg"
        }`;

        const url = s3.getSignedUrl("putObject", {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: Key,
          Expires: 60,
          ContentType: `${input.type.toLowerCase()}/${extention}`,
        });

        return {
          url,
          type: `${input.type.toLowerCase()}/${extention}`,
          key: Key,
          metaData,
        };

        // return new Promise((resolve, reject) => {
        //   s3.createPresignedPost(
        //     {
        //       Bucket: process.env.S3_BUCKET_NAME,
        //       Fields: {
        //         key: Key,
        //       },
        //       Expires: 60,
        //       Conditions: [
        //         ["content-length-range", 0, 1048576 * 10], // up to 10 MB
        //         { "content-type": `${input.type.toLowerCase()}/${extention}` },
        //       ],
        //     },
        //     (err, signed) => {
        //       if (err) {
        //         console.log(err);
        //         return reject(err);
        //       }
        //       return resolve({
        //         url: signed.url,
        //         type: `${input.type.toLowerCase()}/${extention}`,
        //         key: Key,
        //         metaData,
        //         fields: signed.fields,
        //       });
        //     },
        //   );
        // });
      } catch (error) {
        console.log(error);
      }
    }),
});
