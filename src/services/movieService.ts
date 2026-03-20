import axios from "axios";
import type { Movie } from "../types/movie";

export interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

const token = import.meta.env.VITE_TMDB_TOKEN;
const BASE_URL = "https://api.themoviedb.org/3/search/movie";

export const fetchMovies = async (
  query: string,
  page: number = 1
): Promise<MoviesResponse> => {
  const { data } = await axios.get<MoviesResponse>(BASE_URL, {
    params: {
      query,
      page,
    },
    headers: {
        Authorization: `Bearer ${token}`,
      },
  });
  return data;
};