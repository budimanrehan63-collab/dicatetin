import { z } from "zod";

export const TransactionItemSchema = z.object({
  name: z.string(),
  qty: z.number().default(1),
  price: z.number().default(0),
  subtotal: z.number().default(0),
});

export const ParsedTransactionSchema = z.object({
  type: z.enum(["income", "expense", "transfer"]).default("expense"),
  amount: z.number(),
  category: z.string(),
  wallet: z.string().optional(),
  to_wallet: z.string().optional(),
  occurred_at: z.string().optional(),
  note: z.string().optional(),
  merchant: z.string().optional(),
  items: z.array(TransactionItemSchema).optional(),
});

export const AIParserResponseSchema = z.object({
  transactions: z.array(ParsedTransactionSchema),
  needs_clarification: z.boolean().default(false),
  question: z.string().optional(),
});

export type ParsedTransaction = z.infer<typeof ParsedTransactionSchema>;
export type AIParserResponse = z.infer<typeof AIParserResponseSchema>;
