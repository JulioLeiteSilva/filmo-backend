export interface Movie {
    id: number;
    title: string;
    overview: string;
    release_date: string;
    // Adicione outros campos conforme necessário
}

export interface TMDbResponse {
    page: number;
    results: Movie[];
    total_results: number;
    total_pages: number;
}