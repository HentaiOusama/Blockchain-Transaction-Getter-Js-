var socket = io.connect('http://localhost:4000');
var statusBox = document.getElementById('Status');
var displayBox = document.getElementById('displayBox');
var button = document.getElementById('processButton');
var addyInput = document.getElementById('Addy');
var blockInput = document.getElementById('Block');
let web3 = null;

window.addEventListener('load', async () => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            // Request account access if needed
            await window.ethereum.enable();
            statusBox.innerHTML = 'Type 1 Success';
        } catch (error) {
            statusBox.innerHTML = 'Type 1 Failure';
            console.error(error);
        }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
        // Use Mist/MetaMask's provider.
        web3 = window.web3;
        statusBox.innerHTML = "Type 2 Success";
        console.log('Injected web3 detected.');
    }
    // Fallback to localhost; use dev console port by default...
    else {
        statusBox.innerHTML = 'All Faliure';
    }
});

var fixAddress = function(addy) {
    var str = addy;
    str = str.substring(2);
    while (str.charAt(0) == '0') {
        str = str.substring(1);
    }
    return "0x" + str;
}

var handleResult = async function(result, contract) {
    var hash = result["transactionHash"];
    var amount = web3.eth.abi.decodeParameter('uint256', result["data"]);
    var from = fixAddress(result["topics"][1]);
    var block = result["blockNumber"];
    var to = fixAddress(result["topics"][2]);
    var contract = contract;
    displayBox += hash + "," + from + "," + amount + "," + to + "," + block + "&#13;&#10;";
    // fs.appendFile('Output.txt', hash + "," + from + "," + amount + "," + to + "," + block + "\n" , (err) => {
    //     if(err != null) {
    //         console.log("Error : " + err);
    //     }
    // });
}

var contractLogDisplayer = async function(contractAddress, startBlockNumber) {
    console.log("Transaction Getter Called");
    var subscriptionToContract = web3.eth.subscribe('logs', {
        fromBlock: startBlockNumber,
        address: contractAddress,
        topics: ['0x897c6a07c341708f5a14324ccd833bbf13afacab63b30bbd827f7f1d29cfdff4']
    }, function(error, result) {
        if (!error) {
            handleResult(result, contractAddress);
        } else {
            console.log("Error : " + JSON.stringify(error));
            // Take care of this block as after some time, the connection is dropped by tomo server and it needs to be re-established
        }
    });
}

button.addEventListener('click', () => {
  contractLogDisplayer(addyInput.value, blockInput.value);
});
