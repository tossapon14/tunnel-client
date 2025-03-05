const axios = require('axios');
require('dotenv').config()
const tunnel = process.env.TUNNEL;
const server = process.env.SERVER;
const baseKey = process.env.KEY;
const OKCYAN = '\x1b[36m';
const OKGREEN = '\x1b[32m';
const WARNING = '\x1b[33m';
const ERROR = '\x1b[31m'
const WHITE = '\x1b[37m'
const eventKey = "mycloud" + baseKey;
var myclientKey = ""
const io = require('socket.io-client');
const socket = io.connect(tunnel, {  
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 10000, // Wait 2 seconds between retries
  timeout: 8000,});
socket.on("connect", (res) => {
    console.log("\nlocalhost IP ready connected public IP ");
});
socket.on("welcome", (id) => {
    myclientKey = baseKey + id;
});
socket.on(eventKey, async function (key, callback) {
    if (key.key === myclientKey) {
        const myurl = server + key.endpoint;
        getAPILocalhost(key.method, myurl,key.headers, key.data).then((responseData) => {
            callback({ data: responseData.data, status: responseData.status });

            let cstatus;
            if (responseData.status >= 200 && responseData.status < 250) {
                cstatus = OKGREEN;
            } else if (responseData.status >= 400 && responseData.status < 500) {
                cstatus = WARNING;
            } else {
                cstatus = ERROR
            }
            const date_ob = new Date();
            const date = ("0" + date_ob.getDate()).slice(-2);
            const month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
            const year = date_ob.getFullYear();
            const hours = date_ob.getHours();
            const minutes = date_ob.getMinutes();


            const seconds = date_ob.getSeconds();
            const time = ("[" + date + "-" + month + "-" + year + " " + hours + ":" + minutes + ":" + seconds + "]");
            console.log(`${OKCYAN}${key.method} ${WHITE}${server} - - ${time} - - ${key.endpoint} ${cstatus}${responseData.status}\x1b[0m`);
        }).catch((error) => {
            if (error.response) {
                callback({ data: error.response.data, status: error.response.status });

                console.log(ERROR + 'Error', error.response.data);
                console.log(ERROR + 'Error', error.response.status);
                console.log(ERROR + 'Error', error.response.headers);
            } else if (error.request) {
                callback({ data: `Failed to connect to ${server + key.endpoint}: Connection refused`, status: 503 });

                console.log(ERROR + `Failed to connect to ${server + key.endpoint}: Connection refused`
                );
            } else {
                callback({ data: error.message, status: 501 });
                console.log(ERROR + 'Error', error.message);
            }
            // console.log(ERROR + 'Error5', error.config);
        });

    }
});
socket.on("disconnect", (reason) => {
    console.warn("server disconnected");
    if (socket.active) {
        console.warn("waitting reconnected ....");
    } else {
        console.log(reason);
    }
});

async function getAPILocalhost(method = "GET", url = "", headers, data = {}) {
    // Default options are marked with *

    const response = await axios({
        method: method,
        url: url,
        data: data,
        headers: headers,
        validateStatus: function (status) {
            return status >= 200 && status < 400
        }
    });
    return response;
}

