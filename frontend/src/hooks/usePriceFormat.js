// Pakistani Rupee formatter — "Rs. 1,250" style with comma thousand separator,
// no paisa decimals (whole rupees only).
export const formatPrice = (value) => {
  if (value == null || isNaN(value)) return "";
  return `Rs. ${Number(value).toLocaleString("en-PK", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};
