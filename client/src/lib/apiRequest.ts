/**
 * Enhanced API request wrapper with better error handling
 * Silently handles expected authentication failures during app initialization
 */

interface ApiRequestOptions extends RequestInit {
    suppressAuthErrors?: boolean;
}

export async function apiRequest(
    url: string,
    method: string = 'GET',
    data?: any,
    options?: ApiRequestOptions
): Promise<Response> {
    const { suppressAuthErrors = false, ...fetchOptions } = options || {};

    const config: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...fetchOptions.headers,
        },
        credentials: 'include', // Include cookies for session
        ...fetchOptions,
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        config.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, config);

        // Silently handle expected auth failures for certain endpoints
        if ((response.status === 401 || response.status === 403) && suppressAuthErrors) {
            // Return a mock successful response with empty data
            return new Response(JSON.stringify([]), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return response;
    } catch (error) {
        // Network errors
        console.error('API request failed:', error);
        throw error;
    }
}

export default apiRequest;

