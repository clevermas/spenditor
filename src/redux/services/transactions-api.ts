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
            url: `/account/?${new URLSearchParams({
              page,
              ...(limit ? { limit } : {}),
            }).toString()}`,
          });
        } catch (e) {
          console.error(e);
        }
        return { data: query?.data, error: query?.error };
      },
      providesTags: () => ["Transactions"],
      merge: (cache, newItems) => {
        const cacheData = cache.recentTransactions;
        const newItemsData = newItems?.recentTransactions;

        const isRevalidatingAllTransactions =
          newItemsData?.currentPage === 1 &&
          newItemsData?.limit === cacheData.currentPage * cacheData.limit;

        if (newItemsData?.currentPage > cacheData.currentPage) {
          cache.recentTransactions.data.push(...newItemsData?.data);
          cache.recentTransactions.currentPage = newItemsData?.currentPage;
        } else if (isRevalidatingAllTransactions) {
          cache.recentTransactions.data = [...newItemsData?.data];
          cache.balance = newItems?.balance;
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
        url: `transaction/${transaction._id}`,
        method: "PUT",
        body: transaction,
      }),
      invalidatesTags: ["Transactions"],
    }),

    removeTransaction: builder.mutation({
      query: (transactionId) => ({
        url: `transaction/${transactionId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Transactions"],
    }),
  }),
});

export const {
  useGetTransactionsQuery,
  useAddTransactionMutation,
  useUpdateTransactionMutation,
  useRemoveTransactionMutation,
} = transactionsApi;
