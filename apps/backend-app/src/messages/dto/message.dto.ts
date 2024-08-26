import { z } from 'zod';

export const createMessageDtoSchema = z.object({
  value: z.string().min(1),
  senderId: z.number(),
  recipientId: z.number(),
});

export const updateMessageDtoSchema = z.object({
  value: z.string().min(1),
});

export const getMessageListQueryParamsSchema = z.object({
  senderId: z.preprocess(
    (val?: string) => parseInt(val ?? '', 10),
    z.number().min(1)
  ),
  recipientId: z.preprocess(
    (val?: string) => parseInt(val ?? '', 10),
    z.number().min(1)
  ),
  dateFrom: z.string().date(),
  dateTo: z.string().date(),
  itemsPerPage: z.preprocess(
    (val?: string) => parseInt(val ?? '', 10),
    z.number().min(1).max(100)
  ),
  page: z.preprocess(
    (val?: string) => parseInt(val ?? '', 10),
    z.number().min(1)
  ),
});

export type CreateMessageDto = z.infer<typeof createMessageDtoSchema>;
export type UpdateMessageDto = z.infer<typeof updateMessageDtoSchema>;
export type GetMessageListQueryParams = z.infer<
  typeof getMessageListQueryParamsSchema
>;

export type CreateMessagePayload = {
  userId: number;
  senderId: number;
  recipientId: number;
  value: string;
};
export type UpdateMessagePayload = {
  messageId: number;
  userId: number;
  value: string;
};
export type GetMessageListPayload = GetMessageListQueryParams & {
  userId: number;
};
