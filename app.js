const express = require('express');
const http = require('http');
const moment = require('moment');
const url = require('url');
const config =  require('config');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const database = require('./common/databaseCon');
const port = 3002;

let httpServer;

async function startApp(){
try {
    const db = await database.databaseConnection();
    sequelizeCon = db.sequelizeCon;
    const commonObjects = {
        config: config,
        sequelizeCon:  db.sequelizeCon,
        sequiliseConnetion:  db.Sequelize,
        path: path,
        db: db,
        moment: moment,
      }
      await intializeWebServer(commonObjects);
} catch(error){
    console.log('error while application start up',error);
    process.exit(1); // Non-zero failure code
}
  
}
startApp();

async function intializeWebServer(commonObjects){
    try{
        const config = commonObjects.config;
        const db = commonObjects.db;
        return new Promise((resolve,reject) =>{
            const app = express();
            httpServer = http.createServer(app);
            app.use(morgan('combined'));
            app.use(bodyParser.urlencoded({ extended: true }));
            app.use(bodyParser.json({ limit: '150mb' }));
            app.use(bodyParser.urlencoded({
                extended: false, limit: '150mb', parameterLimit: 50000
            }));
            app.use(cors());

            app.use(async (req, res, next) => {
                console.log('========>>>>>> webserver headers =====>>>>>>>', JSON.stringify(req.headers));
                console.log('========>>>>>> webserver headers token ======>>>>>>', req.headers.token);

                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
                    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, token');
                    res.setHeader('Access-Control-Expose-Headers', 'X-Requested-With, content-type, token');
                    res.setHeader('Access-Control-Allow-Credentials', true);
                next();
            });
            app.use('/assets', express.static(path.join(__dirname, '../assets')));
            const versionsList = config.availableVersions;
            for (let i = 0; i < versionsList.length; i++) {
                app.use('/api/' + versionsList[i].toLowerCase() + '/', require('./common/' + versionsList[i].toUpperCase() + '/router.js')(commonObjects));
            }
            httpServer.listen(port).on('listening', () => {
                resolve();
                console.log('listening to port :-',port);
            }).on('error', err => { 
                reject(err);
             });
        })


    }catch(error){
        console.log('===========error while intializing server',error);
    }
}
