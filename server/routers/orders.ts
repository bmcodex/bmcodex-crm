import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  addTimelineEvent,
  getOrderTimeline,
} from "../db";

export const ordersRouter = router({
  list: protectedProcedure
    .input(
      z.object({
        clientId: z.number().optional(),
        status: z.string().optional(),
        paymentStatus: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      return getOrders(input);
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return getOrderById(input.id);
    }),

  create: protectedProcedure
    .input(
      z.object({
        clientId: z.number(),
        title: z.string().min(1),
        description: z.string().optional(),
        serviceType: z.string().optional(),
        baseCost: z.union([z.string(), z.number()]),
        margin: z.union([z.string(), z.number()]).optional(),
        taxRate: z.union([z.string(), z.number()]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      await createOrder(input);
      return { success: true };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        status: z.string().optional(),
        serviceType: z.string().optional(),
        baseCost: z.union([z.string(), z.number()]).optional(),
        margin: z.union([z.string(), z.number()]).optional(),
        taxRate: z.union([z.string(), z.number()]).optional(),
        paymentStatus: z.string().optional(),
        startDate: z.date().optional(),
        completionDate: z.date().optional(),
        internalNotes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await updateOrder(id, data);
      return { success: true };
    }),

  addTimelineEvent: protectedProcedure
    .input(
      z.object({
        orderId: z.number(),
        eventType: z.string(),
        comment: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await addTimelineEvent({
        ...input,
        createdBy: ctx.user?.id,
      });
      return { success: true };
    }),

  getTimeline: protectedProcedure
    .input(z.object({ orderId: z.number() }))
    .query(async ({ input }) => {
      return getOrderTimeline(input.orderId);
    }),
});
