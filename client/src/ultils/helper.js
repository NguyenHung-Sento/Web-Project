export const creatSlug = string => string.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").split(' ').join('-')
export const formatMoney = number => Number(number?.toFixed(1)).toLocaleString()
export const formatSold = number => number?.toLocaleString('en-US', { maximumFractionDigits: 2, notation: 'compact', compactDisplay: 'short' });

export const generateRange = (start, end) => {
    const length = end - start + 1
    return Array.from({ length }, (_, index) => start + index)
}

export const validate = (payload, setInvalidFields) => {
    let invalids = 0
    const newInvalidFields = []
    const formatPayload = Object.entries(payload)

    for (let arr of formatPayload) {
        if (arr[1].trim() === '') {
            invalids++
            newInvalidFields.push({ name: arr[0], mes: 'Require ' })
        }
    }
    for (let arr of formatPayload) {
        switch (arr[0]) {
            case 'email':
                const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                if (!arr[1].toLowerCase().match(regex)) {
                    invalids++
                    newInvalidFields.push({ name: arr[0], mes: 'Invalid ' })
                }
                break;
            case 'password':
                if (arr[1].length < 6) {
                    invalids++
                    newInvalidFields.push({ name: arr[0], mes: 'Must be at least 6 characters of ' })
                }
                break;
            case 'confirmPassword':
                if (arr[1] !== payload.password) {
                    invalids++
                    newInvalidFields.push({ name: arr[0], mes: 'Passwords do not match ' })
                }
                break;
            default:
                break;
        }
    }
    setInvalidFields(newInvalidFields)
    return invalids
}

export function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }