import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const transactionsApi = createApi({
  reducerPath: "transactionsApi",
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/",
  }),
  tagTypes: ["Transactions"],
  endpoints: (builder) => ({
    getTransactions: builder.query({
      queryFn: async (page, store, _, baseQuery) => {
        let query, limit;

        try {
          const state = store.getState();
          const isRevalidatingAllTransactions = !!Object.keys(
            state.transactionsApi.mutations
          )?.length;

          if (isRevalidatingAllTransactions) {
            const data = state.transactionsApi.queries.getTransactions.data;
            page = 1;
            limit = data.currentPage * data.limit;
          }

          query = await baseQuery({
            url: `/transactions/?${new URLSearchParams({
              page,
              ...(limit ? { limit } : {}),
            }).toString()}`,
          });
        } catch (e) {
          console.error(e);
        }
        return { data: query.data };
      },
      providesTags: () => ["Transactions"],
      merge: (cache, newItems) => {
        const isRevalidatingAllTransactions =
          newItems.currentPage === 1 &&
          newItems.limit === cache.currentPage * cache.limit;

        if (newItems.currentPage > cache.currentPage) {
          cache.data.push(...newItems.data);
          cache.currentPage = newItems.currentPage;
        } else if (isRevalidatingAllTransactions) {
          cache.data = [...newItems.data];
        }
      },
      serializeQueryArgs: ({ endpointName }) => endpointName,
      forceRefetch: ({ currentArg, previousArg }) => currentArg !== previousArg,
    }),

    addTransaction: builder.mutation({
      query: (transaction) => ({
        url: `transaction`,
        method: "POST",
        body: transaction,
      }),
      invalidatesTags: ["Transactions"],
    }),

    updateTransaction: builder.mutation({
      query: (transaction) => ({
        url: `transaction/${transaction.id}`,
        method: "PUT",
        body: transaction,
      }),
      invalidatesTags: ["Transactions"],
    }),
  }),
});

export const {
  useGetTransactionsQuery,
  useAddTransactionMutation,
  useUpdateTransactionMutation,
} = transactionsApi;
