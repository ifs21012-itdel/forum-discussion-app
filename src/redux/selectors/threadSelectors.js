/* eslint-disable linebreak-style */
export const selectThreads = (state) => state.thread.threads;
export const selectThreadsLoading = (state) => state.thread.loading;
export const selectThreadsError = (state) => state.thread.error;
export const selectDetailThread = (state) => state.thread.detailThread;
export const selectDetailThreadLoading = (state) => state.thread.loadingDetail;
export const selectDetailThreadError = (state) => state.thread.errorDetail;
