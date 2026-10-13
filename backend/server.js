const express         = require('express')
const app             = express('localhost');
const http            = require('http');
const mongoose        = require('mongoose');
const config          = require('config');
const cors            = require('cors')

app.use(express.urlencoded({ extended: true} ));
app.use(express.json())


const Port            = config.get("port.serverPort") || 4000;
const db_connection   = config.get("db.connection-string");

const MasterRouter = require('./api/Routes/masterRouter')
app.use(express.static('public/images'))

const httpServer = http.createServer(app);

const db_options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}
  
const connection = mongoose.createConnection( db_connection, db_options )

app.use(cors());
app.use('/api/master' , MasterRouter)


mongoose
  .connect( db_connection , db_options)
  .then(async res => {

    httpServer.listen(4000, () => {
      console.log(`HTTP Server running on port ${Port}`);
    });

  })
  .catch(err => console.log(err));