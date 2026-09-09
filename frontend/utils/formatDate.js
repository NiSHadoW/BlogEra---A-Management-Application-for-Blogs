export const formatDate = (dateString, options = { year: "numeric", month: "short", day: "numeric" }) =>
  new Date(dateString).toLocaleDateString("en-US", options);
