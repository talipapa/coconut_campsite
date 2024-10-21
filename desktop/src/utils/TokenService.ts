let token: string | null = null;

export async function setToken(newToken: string | null) {
    token = newToken;

    if (token !== null) {
        localStorage.setItem('token', newToken !== null ? newToken.toString() : '');
    } else {
        // Clear token from storage
        localStorage.removeItem('token');
    }
}

export async function getToken() {
    if (token !== null) {
        return token;
    }
    // Retrieve the encrypted token from storage (e.g., localStorage)
    token = localStorage.getItem('token');
    return token;
}
