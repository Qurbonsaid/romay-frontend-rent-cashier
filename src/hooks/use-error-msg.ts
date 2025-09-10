/* eslint-disable @typescript-eslint/no-explicit-any */
export const useErrorMsg = () => (error: any) =>
  typeof error === 'string'
    ? error
    : typeof error === 'object'
      ? error?.error?.msg ||
        error?.data?.msg ||
        error?.msg ||
        error?.[0]?.password ||
        'An error occurred'
      : 'An error occurred'
