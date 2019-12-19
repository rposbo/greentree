const request = require('request');
const fs = require('fs');

const aggregator = require("./src/aggregator.js");
const energyData = require("./src/energy.js");
const treemap = require("./src/treemapConverter.js");

const wptResultsEndpoint = "http://www.webpagetest.org/jsonResult.php?test=";

const getResults = (testId) => {
    return new Promise((resolve, reject) => {
        
        const endpoint = wptResultsEndpoint + testId;
        console.log("Getting results from " + endpoint);
        
        var options = {
            url: endpoint,
            method: 'GET',
            json: true
        };
        
        try {
          request(options, async (error, response, body) => {
                const networkRequestsArray = body.data.lighthouse.audits['network-requests'].details.items;
                const requestData = aggregator.buildRequestData(networkRequestsArray);
                const energyRequestData = energyData.enrich(requestData);
                resolve(energyRequestData); 
            });
        }
        catch(e){
            var msg = "ERROR in getResults: " + JSON.stringify(e);
            console.log(msg);
            reject();
        }
    });
};


exports.handler = (event, context, callback) => {

    getResults(event.queryStringParameters.id)
    .then(results => {
        fs.writeFileSync('./data/green.json', JSON.stringify(results, null, 2));
        fs.writeFileSync('./data/green_bytes.json', JSON.stringify(treemap.buildMapData(results, 'bytes') , null, 2));
        fs.writeFileSync('./data/green_energy.json', JSON.stringify(treemap.buildMapData(results, 'energy') , null, 2));
        fs.writeFileSync('./data/green_co2Grams.json', JSON.stringify(treemap.buildMapData(results, 'co2Grams') , null, 2));
        fs.writeFileSync('./data/green_co2Litres.json', JSON.stringify(treemap.buildMapData(results, 'co2Litres') , null, 2));
    })
    .catch(e => {
        var msg = "ERROR in getResults: " + JSON.stringify(e);
        console.log(msg);
    });

}

 this.handler(
     {
         "queryStringParameters" : {"id": "191206_NE_82831089b7e519db7acc0eaa1bdd5c06"}
     }
 );