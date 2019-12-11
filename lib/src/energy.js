const gwf = require("./greenWebFoundationAPI.js");
const carbonCalculator = require("./carbonCalculator.js");

exports.enrich = async (requestData) => {
    // green api doens't like getting hammered, so process in serial 
    // instead of parallel and only once per host                
    const uniqueHosts = Array.from(new Set(requestData.map(x => x.host)));

    await asyncForEach(uniqueHosts, async (u) => {
        // get value
        let greenHost = await gwf.checkGreen(u);
        
        // update all requests for this host
        requestData
        .filter(r => r.host == u)
        .forEach(x => {
            x.greenHost = greenHost;
            x.ecoData = carbonCalculator.ecoData(x.bytes, greenHost);
        });
    });
    
    uniqueHosts.forEach(u => {
        let allEnergyByHost = requestData.filter(r => r.host == u).map(r => r.ecoData.energy);
        let allCO2GramsByHost = requestData.filter(r => r.host == u).map(r => r.ecoData.co2.grams);
        let allCO2LitresByHost = requestData.filter(r => r.host == u).map(r => r.ecoData.co2.litres);

        requestData
            .filter(r => r.host == u && r.bytes > 0)
            .forEach(r => {
                r.totalEnergy = allEnergyByHost.reduce((a,c) => a + c);
                r.totalCO2Grams = allCO2GramsByHost.reduce((a,c) => a + c);
                r.totalCO2Litres = allCO2LitresByHost.reduce((a,c) => a + c);
            });
    });

    return requestData;
};

const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
    }
}