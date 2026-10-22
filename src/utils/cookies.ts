// Lưu cookie (mặc định sống 7 ngày)
export const setCookie = (name: string, value: string) => {
  document.cookie = `${name}=${value}; path=/; max-age=604800`;
};

// Lấy cookie theo tên
export const getCookie = (name: string) => {
  const cookies = document.cookie.split('; ');
  for (const item of cookies) {
    const [key, value] = item.split('=');
    if (key === name) {
      return value;
    }
  }
  return null;
};

// Xoá cookie (đặt max-age về 0 là cookie tự mất)
export const removeCookie = (name: string) => {
  document.cookie = `${name}=; path=/; max-age=0`;
};
