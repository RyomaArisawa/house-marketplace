//価格を$ + カンマ区切りの数字へフォーマット
export const formatDisplayPrice = (price: number) => {
  return `$${price.toLocaleString()}`;
};
