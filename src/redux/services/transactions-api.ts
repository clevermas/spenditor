import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const transactionsApi = createApi({
  reducerPath: "transactionsApi",
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/transactions/",
  }),
  endpoints: (builder) => ({
    getTransactions: builder.query({
      query: (page = 1) => `/?page=${page}`,
      merge: (cache, newItems) => {
        if (newItems.currentPage > cache.currentPage) {
          cache.data.push(...newItems.data);
          cache.currentPage = newItems.currentPage;
        }
      },
      serializeQueryArgs: ({ endpointName }) => endpointName,
      forceRefetch: ({ currentArg, previousArg }) => currentArg !== previousArg,
    }),
  }),
});

export const { useGetTransactionsQuery } = transactionsApi;
