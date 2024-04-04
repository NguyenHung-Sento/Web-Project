export const creatSlug = string => string.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(' ').join('-')
export const formatMoney =  number => Number(number?.toFixed(1)).toLocaleString()
export const formatSold = number => number?.toLocaleString('en-US', {maximumFractionDigits: 2, notation: 'compact', compactDisplay: 'short'});
