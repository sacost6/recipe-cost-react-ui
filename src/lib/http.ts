type ApiSuccess<T> = {
    status: 'success';
    data: T;
};

type ApiErrorResponse = {
    status: 'error';
    message: string;    
};

export class ApiError extends Error {
    statusCode: number; 

    constructor(message: string, statusCode: number) {
        super(message);
        this.name = 'ApiError';
        this.statusCode = statusCode;
    }
}

export async function apiRequest<T>(
    path: string, 
    options: RequestInit = {},
): Promise<T> {

    const response = await fetch(path, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options, 
    });

    if(response.status == 204) {
        return undefined as T;
    }

    const text = await response.text(); 

    const body = text ? (JSON.parse(text) as ApiSuccess<T> | ApiErrorResponse) : null; 

    if(!response.ok) {
        throw new ApiError(
            body && 'message' in body ? body.message : 'Request failed',
            response.status,
        )
    }

    if (!body || !('data' in body)) {
        throw new ApiError('Invalid API response', response.status);
    }

    return (body as ApiSuccess<T>).data;
}    