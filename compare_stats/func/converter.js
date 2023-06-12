export function prepareChartData(data) {
    const dataMap = {
        energy: d3.rollup(data,
            v => d3.mean(v[0][1], d => d.energy), 
            d => d[0]),
        loudness: d3.rollup(data,
            v => d3.mean(v[0][1], d => d.loudness),
            d => d[0]
            ),
        valence: d3.rollup(data,
            v => d3.mean(v[0][1], d => d.valence),
            d => d[0]
            ),
        tempo: d3.rollup(data,
            v => d3.mean(v[0][1], d => d.tempo),
            d => d[0]
        )};
    return dataMap;
}
                    
export function processMap(mapArray, dataKey) {
    const temp = [];
    for (let [key, val] of mapArray[dataKey]) {
        temp.push({
            danceability: key,
            val: val
        });
    }
    return temp;
}