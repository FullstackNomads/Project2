module.exports = {
  format_date: (date) => {
    // Format date as MM/DD/YYYY
    return date.toLocaleDateString();
  },
  format_date_long: (date) => {
    // Format date as mmmm dd, yyyy
    let EventDate = new Date(date);
    return `${new Intl.DateTimeFormat(`en-US`, { month: 'long' }).format(EventDate)} ${EventDate.getDate()}, ${EventDate.getFullYear()}`
  },
  format_date_time: (date) => {
    // Format date as mmmm dd, yyyy hh:mm {am/pm}
    let EventDate = new Date(date);
    return `${new Intl.DateTimeFormat(`en-US`, { month: 'long' }).format(EventDate)} ${EventDate.getDate()}, ${EventDate.getFullYear()} ${EventDate.toLocaleTimeString(`en-US`, {
      hour: '2-digit',
      minute: '2-digit'
    })}`
  },
  format_amount: (amount) => {
    // format large numbers with commas
    return parseInt(amount).toLocaleString();
  },

  getUniqueListBy: (arr, key) => {
    return [...new Map(arr.map(item => [item[key], item])).values()]
  },

  get_emoji: () => {
    const randomNum = Math.random();

    // Return a random emoji
    if (randomNum > 0.7) {
      return `<span for="img" aria-label="lightbulb">💡</span>`;
    } else if (randomNum > 0.4) {
      return `<span for="img" aria-label="laptop">💻</span>`;
    } else {
      return `<span for="img" aria-label="gear">⚙️</span>`;
    }
  },
};
