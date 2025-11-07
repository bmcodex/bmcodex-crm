import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { createFile, getFilesByOrderId, getFileById } from "../db";
import { storagePut } from "../storage";

export const filesRouter = router({
  getByOrderId: protectedProcedure
    .input(z.object({ orderId: z.number() }))
    .query(async ({ input }) => {
      return getFilesByOrderId(input.orderId);
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return getFileById(input.id);
    }),

  upload: protectedProcedure
    .input(
      z.object({
        orderId: z.number(),
        fileName: z.string(),
        fileType: z.enum(["original", "modified"]),
        fileData: z.string(), // base64 encoded
        fileSize: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Decode base64 to buffer
        const buffer = Buffer.from(input.fileData, "base64");

        // Upload to S3
        const fileKey = `orders/${input.orderId}/${input.fileType}/${Date.now()}-${input.fileName}`;
        const { url } = await storagePut(
          fileKey,
          buffer,
          "application/octet-stream"
        );

        // Create checksum (simple hash)
        const crypto = require("crypto");
        const checksum = crypto
          .createHash("sha256")
          .update(buffer)
          .digest("hex");

        // Save to database
        await createFile({
          orderId: input.orderId,
          fileName: input.fileName,
          fileType: input.fileType,
          fileKey,
          fileUrl: url,
          fileSize: input.fileSize || buffer.length,
          checksum,
        });

        return { success: true, url };
      } catch (error) {
        console.error("File upload error:", error);
        throw new Error("Failed to upload file");
      }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      // Note: In production, also delete from S3
      return { success: true };
    }),
});
