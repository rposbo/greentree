
exports.buildRequestData = (networkRequestsArray) => {

    const requestData = networkRequestsArray.map(x => {
        let h = {};
        h['host'] = new URL(x.url).hostname;
        h['bytes'] = x.transferSize;
        h['bytesPretty'] = prettyBytes(x.transferSize);
        return h;
    }).filter(x => (x.host != null && x.host.length > 0 ));

    const uniqueHosts = new Set(requestData.map(x => x.host));

    uniqueHosts.forEach(u => {
        let allBytesByHost = requestData
                                .filter(r => r.host == u && r.bytes != null)
                                .map(r => r.bytes)
                                .reduce((a,c) => a + c);

        requestData
            .filter(r => r.host == u && r.bytes > 0)
            .forEach(r => {
                r.totalBytes = allBytesByHost;
                r.totalBytesPretty = prettyBytes(allBytesByHost);
            });
    });        

    return requestData;
}

const prettyBytes = (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (bytes === 0) return '0';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)
    if (i === 0) return `${bytes} ${sizes[i]}`
    return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`
};
