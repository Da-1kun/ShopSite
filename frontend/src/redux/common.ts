export interface CommonState {
  isLoading: boolean;
  errorMessage: string | null;
}

export const getErrorMessage = (error: any): string => {
  return error.response && error.response.data.detail
    ? error.response.data.detail
    : error.message;
};
