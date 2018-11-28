const express = require("express"),
  app = express(),
  PORT = process.env.PORT || 3000;

app.use(express.static(__dirname+'/public'));

app.get('/', (req,res)=>{
  res.sendfile(__dirname+'/index.html');
})

app.listen(PORT, () => {
  console.log(`App listening to ${PORT}....`);
  console.log('Press Ctrl+C to quit.');
})