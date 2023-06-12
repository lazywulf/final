const parseNA = string => (string === "NA"? undefined: string);
const parseDate = string => d3.timeParse("%Y-%m-%d")(string);

export function type(d) {
    return {
        track: parseNA(d.Track),
        danceability: +d.Danceability,
        energy: +d.Energy,
        loudness: +d.Loudness + 60,
        valence: +d.Valence,
        tempo: +d.Tempo,
        licensed: parseNA(d.Licensed)
    }
}

export function filterData(data) {
    return data.filter(
        d => {
            return (
                d.track &&
                d.danceability > 0 && d.danceability < 1 && 
                d.energy > 0 && d.energy < 1 && 
                d.valence > 0 && d.valence < 1 && 
                d.loudness > 0 && d.loudness < 60 &&
                d.tempo &&
                d.licensed
            );
        }
    );
}

export function preprocess(data) {
    const internMap = d3.group(data, d => ((d.danceability * 10) + "")[0])
    return Array.from(internMap).sort(
        (a, b) => {
            return d3.ascending(a[0], b[0]);
        }
    )
}