export const creatSlug = string => string.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").split(' ').join('-')
export const formatMoney =  number => Number(number?.toFixed(1)).toLocaleString()
export const formatSold = number => number?.toLocaleString('en-US', {maximumFractionDigits: 2, notation: 'compact', compactDisplay: 'short'});

export const generateRange = (start, end) => {
    const length = end-start+1
    return Array.from({length}, (_, index) => start + index)
}
