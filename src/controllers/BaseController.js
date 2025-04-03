const Errors = require('../Errors.js');
const Testable = require('../test/Testable.js');

class BaseController extends Testable
{
    constructor(name){
        super(name);      

        this.sendInternalServerError = this.sendInternalServerError.bind(this);
        this.sendBadRequest = this.sendBadRequest.bind(this);
        this.sendError = this.sendError.bind(this);

        this.validateBodyInt = this.validateBodyInt.bind(this);
        this.validateBodyString = this.validateBodyString.bind(this);        
    }

    sendInternalServerError(res, msg){
        this.sendError(res, Errors.HTTP_INTERNAL_SERVER_ERROR, msg);
    }

    sendUnauthorized(res, msg){
        console.log("sendBadRequest - msg: ", msg);
        this.sendError(res, Errors.HTTP_UNAUTHORIZED, msg);
    }

    sendBadRequest(res, msg){
        console.log("sendBadRequest - msg: ", msg);
        this.sendError(res, Errors.HTTP_BAD_REQUEST, msg);
    }

    sendNotFound(res, msg){
        this.sendError(res, Errors.HTTP_NOT_FOUND, msg);
    }

    sendError(res, error, msg){
        if(res != null){
            var errorObj = {code: error.code, msg};

            if(msg == null){
                errorObj.msg = error.defaultMessage;
            }

            if(!process.env.UNIT_TESTING_ENABLED){
                console.log("ERROR - \n", errorObj);
            }
            res.json(errorObj);
        }
    }

    validateBodyInt(req, res, paramName){
        const _this = this;

        var errorMsg = null;
        if((req.body[paramName] == null) && !this.sentError){
            _this.sendBadRequest(res, paramName + " not sent in POST body");
            return null;
        }

        const param = req.bodyInt(paramName);
        return param;
    }

    validateBodyString(req, res, paramName){
        const _this = this;

        if(req.body[paramName] == null){
            _this.sendBadRequest(res, paramName + " not sent in POST body");
            return null;
        }

        const param = req.bodyString(paramName);
        return param;
    }
};

module.exports = BaseController;
