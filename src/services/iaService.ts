import axios from 'axios';
import { TMDbResponse } from '../models/tmdbMovieModel';

const apiKey = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMzc4MzFiYWQ5YTY3OGM2NDZkZDlmYWFkZDIzMDI5MiIsInN1YiI6IjY2MDlmMDI3NjJmY2QzMDE3Y2UwNGZhNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.77D_K8boI8f1NbgfPaMctB-n36DExhnndycRyMEWBVk'; // Coloque sua API Key aqui

export class MovieService {
    private apiUrl: string = 'https://api.themoviedb.org/3/search/movie';
    private apiKey: string = apiKey;

    public async searchMovie(query: string): Promise<TMDbResponse> {
        try {
            const url = `${this.apiUrl}?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`;
            const options = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${this.apiKey}`
                }
            };
            const response = await axios.get(url, options);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                // Erro de Axios
                console.error(`Error fetching data for query "${query}": ${error.message}`);
                throw new Error(`Error fetching data from TMDb: ${error.message}`);
            } else if (error instanceof Error) {
                // Outros erros
                console.error(`Error fetching data for query "${query}": ${error.message}`);
                throw new Error(`Error fetching data from TMDb: ${error.message}`);
            } else {
                // Caso o erro seja realmente desconhecido
                console.error(`Unknown error fetching data for query "${query}"`);
                throw new Error('Unknown error fetching data from TMDb');
            }

        }
    }
}
