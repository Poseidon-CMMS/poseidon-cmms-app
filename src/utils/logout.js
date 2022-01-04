export const logout = () => {
    sessionStorage.removeItem('name');
    sessionStorage.removeItem('id');
    sessionStorage.removeItem('type');
    location.reload();
}