export class Movie {
    id: number;
    title: string;
    description: string;
    rating: {
        score: number;
        support: number;
    }
}