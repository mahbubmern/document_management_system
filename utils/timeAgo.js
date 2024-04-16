// Helper function to calculate time elapsed
const timeAgo = (updatedAt) => {
  const currentTime = new Date();
  const postUpdatedAt = new Date(updatedAt);
  const timeDifference = currentTime - postUpdatedAt;

  // Calculate the time difference in seconds
  const secondsDifference = Math.floor(timeDifference / 1000);

  if (secondsDifference < 60) {
    return `${secondsDifference} second${
      secondsDifference !== 1 ? "s" : ""
    } ago`;
  } else if (secondsDifference < 3600) {
    const minutesDifference = Math.floor(secondsDifference / 60);
    return `${minutesDifference} minute${
      minutesDifference !== 1 ? "s" : ""
    } ago`;
  } else if (secondsDifference < 86400) {
    const hoursDifference = Math.floor(secondsDifference / 3600);
    return `${hoursDifference} hour${hoursDifference !== 1 ? "s" : ""} ago`;
  } else if (secondsDifference < 2592000) {
    const daysDifference = Math.floor(secondsDifference / 86400);
    return `${daysDifference} day${daysDifference !== 1 ? "s" : ""} ago`;
  } else if (secondsDifference < 31536000) {
    const monthsDifference = Math.floor(secondsDifference / 2592000);
    return `${monthsDifference} month${monthsDifference !== 1 ? "s" : ""} ago`;
  } else {
    const yearsDifference = Math.floor(secondsDifference / 31536000);
    return `${yearsDifference} year${yearsDifference !== 1 ? "s" : ""} ago`;
  }
};

export default timeAgo;


