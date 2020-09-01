const _ = require("lodash");

module.exports = {
    formatDate: (date) => {
        const [dateOnly, time] = _.split(date, 'T');
        const [timeOnly] = _.split(time, '.');

        console.log(`${dateOnly} ${timeOnly}`);

        return `${dateOnly} ${timeOnly}`;
    }
};
