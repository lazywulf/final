import {
    prepareChartData,
    processMap
} from "./func/converter.js";
import {
    setupCanvas
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
        
        const energyData = processMap(prepared, "energy");
        const loudnessData = processMap(prepared, "loudness");
        const valenceData = processMap(prepared, "valence");
        const tempoData = processMap(prepared, "tempo");
        
        setupCanvas(
            energyData, 
            "chart-container1", 
            "Relation Between Danceability and Energy",
            "Energy: (0 ~ 1)",
            "teal");
        setupCanvas(
            loudnessData, 
            "chart-container2", 
            "Relation Between Danceability and Loudness",
            "Loudness: (0 ~ 60) dB",
            "olive");
        setupCanvas(
            valenceData, 
            "chart-container3", 
            "Relation Between Danceability and valence",
            "Valence: (0 ~ 1)");
        setupCanvas(
            tempoData, 
            "chart-container4", 
            "Relation Between Danceability and Tempo",
            "Tempo: bpm",
            "blue");
    }
);