const tour = require('../models/tour.model')
const randomTourId = async () => {
    try {
        const tourExist = await tour.findOne({}, {}, { sort: { 'tourId' : -1 } });
        if(tourExist == null || tourExist == []){
            return 10000000;
        }else{
            const tourId = Number.parseInt(tourExist.tourId) + 1;
            return tourId;
        }
    } catch (error) {
        return -1;
    }
}
module.exports = {
    randomTourId
}