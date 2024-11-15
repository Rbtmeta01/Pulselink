// Function to fetch ECG data from a fixed IP address
async function fetchECGData() {
    try {
        // Fixed IP address of the Raspberry Pi
        const response = await fetch("http://192.168.67.5:5000/ecg_data");
        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        document.getElementById("ecg_value").innerText = data.ecg_value;
        document.getElementById("status").innerText = data.status;

        // Update the chart with the new ECG data point
        addData(myChart, data.ecg_value);
    } catch (error) {
        console.error("Error fetching ECG data:", error);
        document.getElementById("ecg_value").innerText = "Error: ECG Value";
        document.getElementById("status").innerText = "Error: Status";
    }
}

// Fetch ECG data every second
setInterval(fetchECGData, 1000);

// Initialize the Chart.js line chart for the ECG data
const ctx = document.getElementById('ecgChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [], // Time labels
        datasets: [{
            label: 'ECG Waveform',
            data: [],
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            fill: false,
        }]
    },
    options: {
        scales: {
            x: {
                type: 'linear',
                title: {
                    display: true,
                    text: 'Time (s)'
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'ECG Value'
                }
            }
        }
    }
});

// Function to add data to the chart
function addData(chart, value) {
    const currentTime = new Date().toLocaleTimeString(); // Current time label
    chart.data.labels.push(currentTime); // Add time label
    chart.data.datasets[0].data.push(value); // Add ECG data point

    if (chart.data.labels.length > 20) { // Limit to the latest 20 points
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
    }
    chart.update();
}

