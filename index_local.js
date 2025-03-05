const axios = require('axios');
require('dotenv').config()
const tunnel = process.env.TUNNEL;
const tunnel2 = process.env.LOCALHOST
const server = process.env.SERVER;
const baseKey = process.env.KEY;
const OKCYAN = '\x1b[36m';
const OKGREEN = '\x1b[32m';
const WARNING = '\x1b[33m';
const ERROR = '\x1b[31m'
const WHITE = '\x1b[37m'
const eventKey = "mycloud" + baseKey;
var myclientKey = ""
const regex = /\.(?:png|jpg|jpeg|gif|svg|webp)$/i; // Case-insensitive check




const io = require('socket.io-client');
const socket = io.connect(tunnel2, { reconnect: true });
socket.on("connect", (res) => {
    console.log("localhost IP is connecting public IP port :"+tunnel2);
});
socket.on("welcome", (id) => {
    myclientKey = baseKey + id;
});
socket.on("connect_error", (error) => {
    console.log(ERROR + "Connection error:", error);
});

socket.on("connect_timeout", () => {
    console.log(ERROR + "Connection timeout");
});
socket.on(eventKey, async function (key, callback) {
    if (key.key === myclientKey) {
        const myurl = server + key.endpoint;

        getAPILocalhost(key.method, myurl, key.data).then((responseData) => {
            if (regex.test(key.endpoint)) {
                // const base64Image = Buffer.from(responseData.data, 'binary').toString('base64');
                const extension = key.endpoint.slice(key.endpoint.lastIndexOf('.') + 1); // Get the file extension
                const mimeType = `image/${extension}`; // Set the correct MIME type dynamically
                const img="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII="
                const base64Image = Buffer.from(img, 'binary').toString('base64');

                callback({ 
                    data: `${base64Image}`, 
                    type: mimeType, 
                    status: responseData.status 
                });
            } else {
                callback({ data: responseData.data, status: responseData.status });
            }
            

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
                // console.log(ERROR + 'Error', error.response.status);
                // console.log(ERROR + 'Error', error.response.headers);
            } else if (error.request) {
                callback({ data: `Failed to connect to ${server + key.endpoint}: Connection refused`, status: 503 });

                console.log(ERROR + `Failed to connect to ${server + key.endpoint}: Connection refused`
                );
            } else {
                callback({ data: error.message, status: 501 });
                console.log(ERROR + 'Error', error.message);
            }
        });

    }
});
socket.on("disconnect", (reason) => {
    console.warn("server disconnected");
    if (socket.active) {
        cosole.warn("waitting reconnected ....");
    } else {
        console.log(reason);
    }
});

async function getAPILocalhost(method = "GET", url = "", data = {}) {
    // Default options are marked with *
    const response = await axios({
        method: method,
        url: url,
        data: data,
        validateStatus: function (status) {
            return status >= 200 && status < 400
        }
    });
    return response;
}
