if(process.env.NODE_ENV === 'production'){
  module.exports={mongoURI:'your database url'}
}else{
  module.exports={mongoURI:'mongodb://localhost/vidjot-dev'
}}