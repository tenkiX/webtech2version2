
function ShutterService(shutterRequestDAO){

    winston = require('winston');
    md5 = require('md5');
    logger = winston.createLogger({
        level: 'info',
        format: winston.format.json(),
        defaultMeta: { service: 'user-service' },
        transports: [
            new winston.transports.File({ filename: 'error.log', level: 'error' }),
            new winston.transports.File({ filename: 'combined.log' })
        ]
    });
    if(shutterRequestDAO !== undefined && shutterRequestDAO != null){
        this.shutterDAO = shutterRequestDAO;
    }
    else {
        this.shutterDAO = require('../dao/shutterDAO')
    }
}



ShutterService.prototype.listAllOrders = function(callback){
    this.shutterDAO.listAllOrders((requests) => {
        logger.info(`${requests.length} orders were found!`);
        callback(requests)
    })
};

ShutterService.prototype.getStatistics = function(shutterType, callback){
    this.shutterDAO.getStatistics(shutterType,(requests) => {
        callback(requests)
    })
};

ShutterService.prototype.listOrdersByCustomerId = function(userId, callback){
    this.shutterDAO.listOrdersByCustomerId(userId, (requests) =>{
        logger.info(`${requests.length} orders were found!`);
        callback(requests)
    })
};

ShutterService.prototype.finishJob = function(orderId, index, success){

    this.shutterDAO.finishJob(orderId, index, ()=>{success()})
};

ShutterService.prototype.updateDate = function(orderId, newDate, success){

    this.shutterDAO.updateDate(orderId, newDate, ()=>{success()})
};


ShutterService.prototype.getRequiredMaterials = function(shutterType, windowWidth, windowHeight, callback){

    this.shutterDAO.getRequiredMaterials(shutterType, windowWidth, windowHeight, (requests) => {
        logger.info(`${requests.length} materials were found!`);
        callback(requests)
    })
};


ShutterService.prototype.submitOrder = function(request, success, error){
    this.shutterDAO.createRequest(request, ()=>{success()})
};

ShutterService.prototype.getShutterTypes = function(callback){
    this.shutterDAO.getShutterTypes((requests) => {
        callback(requests)
    })
};

module.exports = ShutterService;

