
import moment from 'moment';


class CommonFuctions {

    getDateInDDMMYYYYFormat(value) {
        return moment(value).format("DD/MM/YYYY");
    }

    getValueInRupeesFormat(value) {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);
    }

}

export default new CommonFuctions;