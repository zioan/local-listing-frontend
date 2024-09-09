export const listingTypeOptions = [
  { value: "item_sale", label: "Item for Sale" },
  { value: "item_free", label: "Free Item" },
  { value: "item_wanted", label: "Item Wanted" },
  { value: "service", label: "Service" },
  { value: "job", label: "Job" },
  { value: "housing", label: "Housing" },
  { value: "event", label: "Event" },
  { value: "other", label: "Other" },
];

export const conditionOptions = [
  { value: "new", label: "New" },
  { value: "like_new", label: "Like New" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "poor", label: "Poor" },
];

export const deliveryOptions = [
  { value: "pickup", label: "Pickup Only" },
  { value: "delivery", label: "Delivery Available" },
  { value: "both", label: "Pickup or Delivery" },
  { value: "na", label: "Not Applicable" },
];

export const formatDate = (dateString, includeTime = false) => {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    ...(includeTime && {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
  };
  return new Intl.DateTimeFormat("de-DE", options).format(new Date(dateString));
};
