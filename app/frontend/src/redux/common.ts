export interface CommonState {
  isLoading: boolean;
  errorMessage: string | null;
  success?: boolean;
}

export const getErrorMessage = (error: any): string => {
  return error.response && error.response.data.detail
    ? error.response.data.detail
    : error.message;
};
