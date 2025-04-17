export function convertTemp(fahrenheit, unit) {
    if (unit === 'C') {
      return Math.round((fahrenheit - 32) * (5/9));
    }
    // default: return original F
    return Math.round(fahrenheit);
  }
  