document.getElementById('csvFile').addEventListener('change', handleFileSelect);
document.getElementById('analyzeButton').addEventListener('click', analyzeData);

let csvData = [];
let columnNames = [];

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        parseCSV(text);
    };
    reader.readAsText(file);
}

function parseCSV(text) {
    const lines = text.split('\n');
    columnNames = lines[0].split(',');
    csvData = lines.slice(1).map(line => line.split(',').map(value => parseFloat(value) || value));
    
    const select = document.getElementById('columnSelect');
    select.innerHTML = '<option value="">Select a column</option>';
    columnNames.forEach((name, index) => {
        select.innerHTML += `<option value="${index}">${name}</option>`;
    });
}

function analyzeData() {
    const select = document.getElementById('columnSelect');
    const columnIndex = parseInt(select.value);
    if (isNaN(columnIndex)) {
        alert('Please select a column.');
        return;
    }

    const values = csvData.map(row => row[columnIndex]).filter(value => !isNaN(value));

    if (values.length === 0) {
        alert('No numeric data found in the selected column.');
        return;
    }

    const mean = calculateMean(values);
    const median = calculateMedian(values);
    const mode = calculateMode(values);
    const stdDev = calculateStandardDeviation(values);

    displayResults(mean, median, mode, stdDev);
}

function calculateMean(values) {
    const sum = values.reduce((acc, val) => acc + val, 0);
    return sum / values.length;
}

function calculateMedian(values) {
    values.sort((a, b) => a - b);
    const middle = Math.floor(values.length / 2);
    if (values.length % 2 === 0) {
        return (values[middle - 1] + values[middle]) / 2;
    } else {
        return values[middle];
    }
}

function calculateMode(values) {
    const frequency = {};
    values.forEach(value => frequency[value] = (frequency[value] || 0) + 1);
    
    const maxFrequency = Math.max(...Object.values(frequency));
    return Object.keys(frequency).filter(key => frequency[key] === maxFrequency);
}

function calculateStandardDeviation(values) {
    const mean = calculateMean(values);
    const variance = values.reduce((acc, val) => acc + (val - mean) ** 2, 0) / values.length;
    return Math.sqrt(variance);
}

function displayResults(mean, median, mode, stdDev) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <h2>Statistics for Selected Column</h2>
        <p><strong>Mean:</strong> ${mean}</p>
        <p><strong>Median:</strong> ${median}</p>
        <p><strong>Mode:</strong> ${mode.join(', ')}</p>
        <p><strong>Standard Deviation:</strong> ${stdDev}</p>
    `;
}
