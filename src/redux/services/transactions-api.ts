import { TransactionsResponseDTO } from "@/app/api/transactions";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const transactionsApi = createApi({
  reducerPath: "transactionsApi",
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/transactions/",
  }),
  endpoints: (builder) => ({
    getTransactions: builder.query<TransactionsResponseDTO, null>({
      query: () => "/",
    }),
  }),
});

export const { useGetTransactionsQuery } = transactionsApi;
