function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
        minimumFractionDigits: 0,
    }).format(amount);
}


export { formatCurrency };