
const HTTP_BAD_REQUEST = {code: 400, defaultMessage: "Bad Request"};
const HTTP_UNAUTHORIZED =  {code: 401, defaultMessage: "Unauthorized"};
const HTTP_PAYMENT_REQUIRED =  {code: 402, defaultMessage: "Payment Required"};
const HTTP_FORBIDDEN =  {code: 403, defaultMessage: "Forbidden"};
const HTTP_NOT_FOUND =  {code: 404, defaultMessage: "Not Found"};
const HTTP_INTERNAL_SERVER_ERROR =  {code: 500, defaultMessage: "Internal Server Error"};

module.exports = {
    HTTP_BAD_REQUEST, 
    HTTP_UNAUTHORIZED,
    HTTP_PAYMENT_REQUIRED,
    HTTP_FORBIDDEN,
    HTTP_NOT_FOUND,
    HTTP_INTERNAL_SERVER_ERROR,
};

