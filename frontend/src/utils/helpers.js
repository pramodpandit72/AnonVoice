export const formatTimeAgo = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)}w ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
  return `${Math.floor(diffInSeconds / 31536000)}y ago`;
};

export const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};

export const getShareUrl = (postId) => {
  return `${window.location.origin}/post/${postId}`;
};

export const categories = [
  { value: 'all', label: 'All', icon: 'fa-globe' },
  { value: 'general', label: 'General', icon: 'fa-comments' },
  { value: 'politics', label: 'Politics', icon: 'fa-landmark' },
  { value: 'government', label: 'Government', icon: 'fa-building-columns' },
  { value: 'education', label: 'Education', icon: 'fa-graduation-cap' },
  { value: 'social', label: 'Social', icon: 'fa-users' }
];
