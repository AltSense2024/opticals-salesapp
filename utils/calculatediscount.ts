interface DiscountResult {
  discountInPercent: number;
  discountInRupees: number;
  total: number;
}

export const calculateDiscount = (
  qty: number,
  price: number,
  discountInPercent: number,
  discountInRupees: number,
  lastEdited: "percent" | "rupees" | null
): DiscountResult => {
  const totalAmount = qty * price;
  let percent = discountInPercent || 0;
  let rupees = discountInRupees || 0;

  if (lastEdited === "percent") {
    rupees = (percent / 100) * totalAmount;
  } else if (lastEdited === "rupees") {
    percent = totalAmount > 0 ? (rupees / totalAmount) * 100 : 0;
  }

  const total = totalAmount - rupees;
  return { discountInPercent: percent, discountInRupees: rupees, total };
};
