import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const accountApi = createApi({
  reducerPath: "accountApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_ACCOUNT_API_URL,
  }),
  tagTypes: ["AccountData", "Statistics"],
  endpoints: (builder) => ({
    accountData: builder.query({
      queryFn: async (page, store, _, baseQuery) => {
        let query, limit;

        try {
          // see: https://github.com/reduxjs/redux-toolkit/issues/1685
          const state = store.getState() as any;
          const isRevalidatingAllTransactions = !!Object.keys(
            state.accountApi.mutations
          )?.length;

          if (isRevalidatingAllTransactions) {
            const data =
              state.accountApi.queries.accountData.data?.recentTransactions;
            page = 1;
            limit = data.currentPage * data.limit;
          }

          query = await baseQuery({
            url: `?${new URLSearchParams({
              page,
              ...(limit ? { limit } : {}),
            }).toString()}`,
          });
        } catch (e) {
          console.error(e);
        }
        return { data: query?.data, error: query?.error };
      },
      providesTags: () => ["AccountData"],
      merge: (cache, newTransactionsData) => {
        const cacheData = cache.recentTransactions;
        const newData = newTransactionsData?.recentTransactions;

        const isRevalidatingAllTransactions =
          newData?.currentPage === 1 &&
          newData?.limit === cacheData.currentPage * cacheData.limit;

        if (newData?.currentPage > cacheData.currentPage) {
          cache.recentTransactions.data.push(...newData?.data);
          cache.recentTransactions.currentPage = newData?.currentPage;
          cache.recentTransactions.totalPages = newData.totalPages;
        } else if (isRevalidatingAllTransactions) {
          cache.recentTransactions.data = [...newData?.data];
          cache.balance = newTransactionsData?.balance;
          cache.recentTransactions.totalPages =
            newData.totalPages > 1
              ? cache.recentTransactions.totalPages + 1
              : Math.ceil(newData.data?.length / cacheData.limit);
          cache.recentTransactions.currentPage =
            cacheData.currentPage > cache.recentTransactions.totalPages
              ? cache.recentTransactions.totalPages
              : cacheData.currentPage;
        }
      },
      serializeQueryArgs: ({ endpointName }) => endpointName,
      forceRefetch: ({ currentArg, previousArg }) => currentArg !== previousArg,
    }),

    statistics: builder.query({
      query: () => ({
        url: `statistics`,
        method: "GET",
      }),
      providesTags: () => ["Statistics"],
    }),

    addTransaction: builder.mutation({
      query: (transaction) => ({
        url: `transaction`,
        method: "POST",
        body: transaction,
      }),
      invalidatesTags: ["AccountData", "Statistics"],
    }),

    updateTransaction: builder.mutation({
      query: (transaction) => ({
        url: `transaction/${transaction._id}`,
        method: "PUT",
        body: transaction,
      }),
      invalidatesTags: ["AccountData", "Statistics"],
    }),

    removeTransaction: builder.mutation({
      query: (transactionId) => ({
        url: `transaction/${transactionId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AccountData", "Statistics"],
    }),
  }),
});

export const {
  useAccountDataQuery,
  useStatisticsQuery,
  useAddTransactionMutation,
  useUpdateTransactionMutation,
  useRemoveTransactionMutation,
} = accountApi;
