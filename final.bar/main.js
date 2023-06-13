import {
    prepareChartData,
    processMap
} from "./func/converter.js";
import {
    setupCanvas_teach
} from "./func/plot.js";
import {
    type,
    filterData,
    preprocess
} from "./func/preprocess.js";


d3.csv("../data/Spotify_Youtube.csv", type).then(
    res => {
        const filtered = filterData(res);
        const processed = preprocess(filtered);
        const prepared = prepareChartData(processed);

        const data = processMap(prepared);
        console.log(data);
        setupCanvas_teach(data, filtered);
    }
);