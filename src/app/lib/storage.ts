export const getAccessToken = () => {
    return localStorage.getItem('accessToken');
}

export const getRefreshToken = () => {
    return localStorage.getItem('refreshToken');
}