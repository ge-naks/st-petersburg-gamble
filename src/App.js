import { BarElement, CategoryScale, Chart, LinearScale, BarController } from 'chart.js';
import './App.css';
import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2'; // Import the necessary components from react-chartjs-2

Chart.register(CategoryScale, LinearScale, BarElement, BarController);

function SimLogic() {
  const [pot, setPot] = useState(1);
  const [numRuns, setNumRuns] = useState(0);
  const [allRuns, setAllRuns] = useState([]);
  const [avg, setAvg] = useState(0);
  const [sd, setSD] = useState(0);
  const [graphData, setGraphData] = useState({});
  const [config, setConfig] = useState({});

  let search = function (arr, x, start, end) {
      
    // Base Condition
    if (start > end) return false;
  
    // Find the middle index
    let mid=Math.floor((start + end)/2);
  
    // Compare mid with given key x
    if (arr[mid]===x) return true;
         
    // If element at mid is greater than x,
    // search in the left half of mid
    if(arr[mid] > x)
        return search(arr, x, start, mid-1);
    else
 
        // If element at mid is smaller than x,
        // search in the right half of mid
        return search(arr, x, mid+1, end);
}

  function oneRun() {
    let isHeads = true;
    let payout = 1;

    while (isHeads) {
      const x = Math.random();
      if (x > 0.5) {
        payout *= 2;
      } else if (x < 0.5) {
        setPot(payout);
        return payout;
      }
    }
  }

  function setRuns(event) {
    const runs = parseInt(event.target.value);
    setNumRuns(runs);
  }

  function runSim() {
    const data = [];
    for (let i = 0; i < numRuns; i++) {
      const payout = oneRun();
      data.push(payout);
    }
    setPot(Math.max(...data));
    setAllRuns(data);
    let sum = 0
    
    for( let i = 0; i < numRuns; i++){
      sum = sum + data[i]
    }

    let avg = sum / numRuns
    setAvg(avg)
    let SDsum = 0
    data.sort((a, b) => a - b)

    let labels = []
    let count = []
    let countIndex = -1
    
    
    for(let i = 0 ; i < data.length; i++){
        if(search(labels, data[i], 0, labels.length-1)){
            count[countIndex] =  count[countIndex] + 1
        }else{
            labels.push(data[i])
            countIndex = countIndex + 1
            count[countIndex] = 1
        }
    }
    for(let i = 0; i < numRuns; i ++){
      let temp = data[i] - avg
      SDsum = SDsum + Math.pow(temp, 2)
    }

    let SD = Math.sqrt(SDsum/numRuns-1)
    setSD(SD)

    const config = {
      type: 'bar',
      data: data,
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      },
    };

    const graphData = {
      labels: labels,
      datasets: [{
        label: 'My First Dataset',
        data: count,
        backgroundColor:[
          'rgba(255, 255, 255, 0.6)'
        ]
      }]
}
setGraphData(graphData)
setConfig(config)
  }

  return (
    <>
      <p>Max Pot: {pot}</p>
      <p>Average Winnings for all runs: {avg} </p>
      <p>Standard Deviation for all runs: {sd} </p>
      <p>Enter the number of desired runs</p>
      <input className="runNumber" onChange={setRuns}></input>
      <button onClick={runSim}>Click to run sim</button>
      {Object.keys(graphData).length > 0 && <Bar data={graphData} config = {config} />}
    </>
  );  
}

function App() {
  return (
    <div className="App">
      <header className="App-header"> 
        <h1>The Doubling Game</h1>
        <p>
          Flip a coin! If it's heads, we double your money! If it's tails,
          sorry, your game has ended! You win whatever is in the pot.
        </p>
        <SimLogic />
      </header>
    </div>
  );
}

export default App;
