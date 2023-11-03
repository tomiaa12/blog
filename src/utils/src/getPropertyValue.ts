export const getPropertyValue = (
  key: string,
  root = document.documentElement
) => window.getComputedStyle(root).getPropertyValue(key)
