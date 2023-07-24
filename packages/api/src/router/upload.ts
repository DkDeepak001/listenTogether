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
        imageUrl: z.string(),
        songUrl: z.string(),
        ImageMetadataId: z.string(),
        SongMetadataId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.song.create({
          data: {
            name: input.name,
            album: input.albumName,
            artist: input.artistName,
            imageUri: input.imageUrl,
            songUri: input.songUrl,
            createdBy: {
              connect: {
                id: ctx?.userId,
              },
            },
            songMetadata: {
              connect: {
                id: input.SongMetadataId,
              },
            },
            imageMetadata: {
              connect: {
                id: input.ImageMetadataId,
              },
            },
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
  getPrsignedUrl: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        type: z.enum([FileType.AUDIO, FileType.IMAGE]),
        format: z.enum(["mp3", "jpg", "m4a", "wav", "png", "jpeg"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const metaData = await ctx.prisma.fileMetadata.create({
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

        const Key = `${input.type}/${ctx?.userId}/${metaData.id}.${input.format}`;

        const url = s3.getSignedUrl("putObject", {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: Key,
          Expires: 60,
          ContentType: `${input.type.toLowerCase()}/${input.format}`,
        });

        return {
          url,
          type: `${input.type.toLowerCase()}/${input.format}`,
          key: Key,
          metaDataId: metaData.id,
          resourceUrl: `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${Key}`,
        };
      } catch (error) {
        console.log(error);
      }
    }),
});
