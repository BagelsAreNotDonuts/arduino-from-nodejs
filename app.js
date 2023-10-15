var http = require('http');
var fs = require('fs');
var index = fs.readFileSync('index.html');

// Wrap your code in an async function
let result = [];
async function callBills() {

  try {
    // Use dynamic import to import the ES module
    const module = await import('./getBills.mjs');

    // Access the exported function from the ES module
    const { getBillData } = module;

    // Call the function to fetch bill data and wait for the result
    result = await getBillData();
  } catch (error) {
    console.error('Error importing or fetching data:', error);
  }
}



  // The rest of your code that depends on 'result'

  // Set up the SerialPort for communication
  var SerialPort = require('serialport');
  const parsers = SerialPort.parsers;

  const parser = new parsers.Readline({
    delimiter: '\r\n'
  });

  var port = new SerialPort('COM6', {
    baudRate: 9600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false
  });

  port.pipe(parser);

  // Create an HTTP server to serve 'index.html'
  var app = http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(index);
  });

  var io = require('socket.io').listen(app);


  // io.on('connection', function(socket) {
  //     socket.on('lights',function(data){
  //         console.log( data );
  //         port.write( data.status );
  //         console.log(data);
  //     });
  // });
  
  //toggleAndSend();

let ledState = 0;

const updateLEDState = (value) => {
  port.write(value.toString());
  ledState = value;
};

function toggleAndSend() {
  let value = "1";
  // Use setInterval to repeatedly send "1" and "0" every 2 seconds
  let iterationCount = 0;
  const interval = setInterval(async function () {
    await callBills();
    console.log("BILLS CALLED"); // A comment you already had


    let overdueBillCount = 0;
    result.map((entry)=> {
      let currentTime = new Date();
      let dueTime = new Date(entry.billDateTime);
      if (dueTime < currentTime) {
        overdueBillCount++;
      } else {
      }
    })
    console.log(overdueBillCount);

    if (overdueBillCount > 0) {
      console.log("WOOP");
      ledState != 1 ? updateLEDState(1) : console.log("State already 1");
    } else {
      console.log("NOT WOOP");
      ledState != 0 ? updateLEDState(0) : console.log("State already 0");
    }

    // Toggle the value between "1" and "0"
    value = value === "1" ? "0" : "1";
    iterationCount++
    // Stop the interval after a certain number of iterations (e.g., 5 times)
    const numIterations = 15;
    if (iterationCount >= numIterations) {
      clearInterval(interval);
    } 
    console.log(numIterations-iterationCount + " iterations left.")
  }, 2000);

}

toggleAndSend();
app.listen(3000);
  //toggleAndSend();
// Call the asynchronous function to start the server