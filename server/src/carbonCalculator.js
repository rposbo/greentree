exports.ecoData = (bytes, green) => {
    const bytesAdjusted = (bytes * 0.75)
                        + (0.02 * bytes * 0.25);

    const energy = bytesAdjusted  * (1.805 / 1073741824);

    const co2Grid = energy * 475;

    const co2Renewable = ((energy * 0.1008) * 33.4)
                        + ((energy * 0.8992) * 475);

    return {
        'energy': energy,
        'type' : green ? 'renewable' : 'grid',
        'co2': {
            'grams': green ? co2Renewable : co2Grid,
            'litres': green ? co2Renewable * 0.5562 : co2Grid * 0.5562
        }
    };
};