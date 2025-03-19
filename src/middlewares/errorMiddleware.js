const errorMiddleware = (err, req, res, next) =>{
    console.log(err);
    res.status(500).json({ message: "Internal server error"});
}
module.exports = errorMiddleware;