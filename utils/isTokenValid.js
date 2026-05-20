export default async function isTokenValid(accessToken) {
  const tokenInfoURL = "https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=";
  try {
    const response = await fetch(tokenInfoURL + accessToken);
    await response.json();

    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Ошибка при проверке токена:', error);
    return false;
  }
}