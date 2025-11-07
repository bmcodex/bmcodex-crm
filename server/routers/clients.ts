import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  createClient,
  getClients,
  getClientById,
  updateClient,
} from "../db";

export const clientsRouter = router({
  list: protectedProcedure
    .input(
      z.object({
        search: z.string().optional(),
        loyaltyStatus: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      return getClients(input);
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return getClientById(input.id);
    }),

  create: protectedProcedure
    .input(
      z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().email().optional(),
        phone: z.string().min(1),
        vin: z.string().optional(),
        vehicleModel: z.string().optional(),
        vehicleYear: z.number().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      await createClient(input);
      return { success: true };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        vin: z.string().optional(),
        vehicleModel: z.string().optional(),
        vehicleYear: z.number().optional(),
        loyaltyStatus: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await updateClient(id, data);
      return { success: true };
    }),
});
