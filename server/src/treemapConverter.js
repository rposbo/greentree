exports.buildMapData = (data, type) => {
    const mapData = {};

    mapData.name = `Treemap for ${type}`;
    mapData.children = [];

    const uniqueHosts = Array.from(new Set(data.map(x => x.host)));
    uniqueHosts.forEach(u => {
        const uniqueHost = {
            name: u,
            children: []
        };

        data.filter(r => r.host == u).forEach(r => {
            uniqueHost.green = r.greenHost,
            uniqueHost.bytesPretty = r.totalBytesPretty;
            
            uniqueHost.value = 
                type == 'bytes' ? r.totalBytes : 
                type == 'energy' ? r.totalEnergy : 
                type == 'co2Grams' ? r.totalCO2Grams :
                r.totalCO2Litres;

            const i = 
                type == 'bytes' ? r.bytes : 
                type == 'energy' ? r.ecoData.energy : 
                type == 'co2Grams' ? r.ecoData.co2.grams :
                r.ecoData.co2.litres;

            if (i > 0)
            uniqueHost.children.push({
                name:  i,
                value: i,
                green: r.greenHost,
                bytesPretty: r.bytesPretty
            });
        });
        
        if (uniqueHost.value > 0)
        mapData.children.push(uniqueHost);
    });
    return mapData;
};