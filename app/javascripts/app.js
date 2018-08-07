// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

/*
 * When you compile and deploy your Asset contract,
 * truffle stores the abi and deployed address in a json
 * file in the build directory. We will use this information
 * to setup a Asset abstraction. We will use this abstraction
 * later to create an instance of the Asset contract.
 */

import asset_artifacts from '../../build/contracts/AssetContract.json'

var AssetContract = contract(asset_artifacts);
window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));


window.allocate = function(data) {

  $('#machineHistroyDetails tbody').empty(); 
  $("#machineHistory").hide(); 
  //location.reload(true);
  
  var machineId =  document.getElementById("machineList").value;
  var userId =  document.getElementById("userList").value;
  
  AssetContract.setProvider(web3.currentProvider);
  AssetContract.deployed().then(function(contractInstance) {

      contractInstance.allocate(machineId, parseInt(userId),{gas: 140000, from: web3.eth.accounts[0]}).then(function() {
         
          return contractInstance.getMachineAllocs.call(machineId).then(function(allocatedMachineUserId) {
              
              var data = allocatedMachineUserId.toString().split(',');

              $("#msg").text("").removeClass();
              if(data[1] != 0) {
        
                $("#" + machineId + " td:nth-child(2)").empty();
                $("#" + machineId + " td:nth-child(2)").append(userId);
                $("#" + machineId + " td:nth-child(3)").attr('id', machineId).append('<a href="#" data-id="'+ machineId +'" onclick="release(this)">Release</a>');
                $("#msg").text("Allocation Done").addClass("alert alert-success"); 
                $("#machineList option[value='"+ machineId +"']").remove();

                var myEvent = contractInstance.Transferred({fromBlock: 0, toBlock: 'latest'});

              } else {
                $("#msg").text("Machine is already allocated to other user").addClass("alert alert-danger");
              }
            
          }); 
      }); 
  });
}

window.release = function(elem) {
  
  var machineId = $(elem).attr("data-id");
  
  AssetContract.setProvider(web3.currentProvider);
  AssetContract.deployed().then(function(contractInstance) {
      
      contractInstance.release(machineId ,{gas: 140000, from: web3.eth.accounts[0]}).then(function() {
        location.reload(true);
      });  
  });
}

window.fetchHistory = function(machineId) {
  
  $('#machineHistroyDetails tbody').empty(); 
  
  var count = 0;
  
  AssetContract.deployed().then(function(contractInstance) {
    
    var machineHistoryEvent = contractInstance.Transferred({}, {fromBlock: 0, toBlock: 'latest'}).get((error, result) => {

    for(var i = 0; i < result.length ; i++) {

      if(result[i].args.machineId == machineId) {
        count = count + 1;
        var blockNumber = JSON.stringify(result[i].blockNumber);
        var blockCreationTime = web3.eth.getBlock(blockNumber).timestamp;
        var converTimeStamp = new Date(blockCreationTime*1000);
        $("#machineHistory").show();
        $('#machineHistroyDetails tbody').append('<tr><td>' + result[i].args.allocatedUserId +' </td> <td>' + converTimeStamp.toLocaleString() +'</td> </tr>');

      }
      
    }
    
    if(count == 0) {
      $("#machineHistory").show();
      $('#machineHistroyDetails tbody').append('<tr><td colspan="2">' + "No history found this Machine ID" +' </td> </tr>'); 
    } 

      });
  });

}

window.getMachinesState = function() {
  
  var getDate = $("#datepicker").datepicker('getDate'); 
  var selectedDate = getDate.getDate() + '/' + getDate.getMonth() + '/' + getDate.getFullYear(); 
  var count = 0;

  AssetContract.deployed().then(function(contractInstance) {
    
    var machineHistoryEvent = contractInstance.Transferred({}, {fromBlock: 0, toBlock: 'latest'}).get((error, result) => {
    var temp,finalResult;

    var machineList = $('#allocateDetails tr');

    for(var j = 0; j < machineList.length ; j++) {
    count = 0;
    finalResult = "";
    temp = "";
    for(var i = 0; i < result.length ; i++) {

      if(result[i].args.machineId == machineList[j].id) {
        
        var blockNumber = JSON.stringify(result[i].blockNumber);
        var blockCreationTime = web3.eth.getBlock(blockNumber).timestamp;
        var converTimeStamp = new Date(blockCreationTime*1000);
        var blockDate = converTimeStamp.getDate() + '/' + converTimeStamp.getMonth() + '/' + converTimeStamp.getFullYear(); 

        if(selectedDate == blockDate) {
        
          count = count + 1;
          
          if(count == 1) {
            temp = blockCreationTime;
            finalResult = result[i];
          } else {
              if(blockCreationTime > temp) {
                temp = blockCreationTime;
                finalResult = result[i];
              } 
          }
        }
      
      }
      
    }
    
    if(finalResult != "") {
      
      console.log(web3.toAscii(machineList[j].id) + " ---> " + JSON.stringify(finalResult.args.allocatedUserId));
      
    }
    
  }

      });
  });

}

window.addMachine = function() {
  
  var machineId =  document.getElementById("inputMachineId").value;
  
  AssetContract.setProvider(web3.currentProvider);
  AssetContract.deployed().then(function(contractInstance) {
      
      contractInstance.addMachine(machineId ,{gas: 140000, from: web3.eth.accounts[0]}).then(function() {
        location.reload(true);
      });  
  });
}

window.addUser = function() {
  
  var userId =  document.getElementById("inputUserId").value;
  
  AssetContract.setProvider(web3.currentProvider);
  AssetContract.deployed().then(function(contractInstance) {
      
      contractInstance.addUser(parseInt(userId) ,{gas: 140000, from: web3.eth.accounts[0]}).then(function() {
        location.reload(true);
      });  
  });
}

$( document ).ready(function() {

  $("#machineHistory").hide(); 
	
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source like Metamask")
	  window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:7545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
  }
  
  AssetContract.setProvider(web3.currentProvider);
  
  AssetContract.deployed().then(function(contractInstance) {
    
    contractInstance.getMachineList.call().then(function(machineId) {	
	 
		var arr = machineId.toString().split(',');
    var tableId = document.getElementById("allocateDetails");
		
			for (var i=0;i<arr.length;i++){
				//$('<option/>').val(arr[i]).html(arr[i]).appendTo('#machineList');

        $('#blockchainDetails tbody').append('<tr id="'+arr[i]+'"><td> <a href="#" onclick="fetchHistory('+ arr[i] + ')">'+ web3.toAscii(arr[i]) +'</a> </td> <td></td> <td></td></tr>');
         
          contractInstance.getMachineAllocs.call(arr[i]).then(function(allocatedMachineUserId) {
            var data = allocatedMachineUserId.toString().split(',');

             $("#" + data[0] + " td:nth-child(2)").append(data[1]);
             
             if(data[1] != 0) {
                $("#" + data[0] + " td:nth-child(3)").attr('id', data[0]).append('<a href="#" data-id="'+ data[0] +'" onclick="release(this)">Release</a>');
             } else {
                 $('<option/>').val(data[0]).html(web3.toAscii(data[0])).appendTo('#machineList');
             }
          });
        
			}

      });
  });
  
  AssetContract.deployed().then(function(contractInstance) {
      contractInstance.getUserList.call().then(function(userId) {	
	  
		var arr = userId.toString().split(',');
		
			for (var i=0;i<arr.length;i++){
				$('<option/>').val(arr[i]).html(arr[i]).appendTo('#userList');
			}
      });
  });


});