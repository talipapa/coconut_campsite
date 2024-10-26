const FormatCurrency = (value: number|undefined) => {
    if (value === undefined) return '₱ 0'
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(value)
}

export default FormatCurrency