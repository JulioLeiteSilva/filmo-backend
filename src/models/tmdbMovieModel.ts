export interface Movie {
    id: number;
    title: string;
    overview: string;
    release_date: string;
}

export interface TMDbResponse {
    page: number;
    results: Movie[];
    total_results: number;
    total_pages: number;
}