if(process.env.NODE_ENV == "production"){
    module.exports = {mongoURI: 'mongodb+srv://admin:meuprojetomongo@seucluster.mongodb.net/?retryWrites=true&w=majority'}
}else{
    module.exports = {mongoURI: 'mongodb://localhost/blogapp'}
}