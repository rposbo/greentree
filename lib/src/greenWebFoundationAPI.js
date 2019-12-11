const fetch = require('node-fetch');

exports.checkGreen = async (host) => {
    return new Promise((resolve, reject) => {
        fetch('http://api.thegreenwebfoundation.org/greencheck/' + host,
        {
            method: 'GET'
        })
        .then(r => r.json())
        .then(data => { 
            if (data) {
                resolve(data.green);
            } else {
                resolve(false)
            }
        })
        .catch(e => {
            resolve(false);
        })
    });
};