const axios = require('axios');

async function getAPILocalhost(method = "GET", url = "", data = {}) {
    // Default options are marked with *
    const response = await axios({
        method: method,
        url: url,
        data: data,
        // headers: {
        //     'Content-Type': 'application/json',
        //     'Content-type': 'application/x-www-form-urlencoded'
        //     },
        validateStatus: function (status) {
            return status >= 200 && status < 400
        }
    });
    console.log(response.data);
    return response;
}

getAPILocalhost("POST",url="http://127.0.0.1:3000/auth/login",{email:"tor.36105@gmail.com",password:"1234"} );