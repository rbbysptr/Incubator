function formatToRupiah(number) {
        const formatter = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        });
        return formatter.format(number);
    }

module.exports = formatToRupiah;
