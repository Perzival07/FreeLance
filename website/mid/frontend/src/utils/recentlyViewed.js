const KEY = "recentlyViewed";
const MAX = 12;

// Stored per browser only; failures (private mode, blocked storage) are ignored
export const getRecentlyViewed = () => {
  try {
    const list = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
};

export const addRecentlyViewed = (productId) => {
  try {
    const list = getRecentlyViewed().filter((id) => id !== productId);
    list.unshift(productId);
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
  } catch {
    // ignore
  }
};
