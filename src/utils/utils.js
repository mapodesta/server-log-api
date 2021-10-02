import { LIMIT } from '../constants/constants';

export const getPaginationValue = totalResults => ({
  totalResults,
  maxResultsPerPage: LIMIT,
  totalPages: (() => Math.ceil(totalResults / LIMIT))()
});
