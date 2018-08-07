pragma solidity ^0.4.21;
// We have to specify what version of compiler this code will compile with

contract AssetContract {

  bytes32[] public machineList; 
  uint256[] public userList;
  
  mapping(bytes32 => uint256) public machineAllocs;
  bool isAllocated;
  
  event Transferred(
    bytes32 machineId,
    uint256 allocatedUserId
  );

  function AssetContract(bytes32[] machines,uint256[] users) public {
    machineList = machines;
	  userList = users;
  }
  
  function addMachine(bytes32 machineId) public {
    machineList.push(machineId);
  }

  function addUser(uint256 userId) public {
    userList.push(userId);
  }

  function getMachineList() view public returns (bytes32[])  {
	 return machineList;	
  }
  
  function getUserList() view public returns (uint256[])  {
	 return userList;	
  }

  function getMachineAllocs(bytes32 machineId) view public returns (bytes32,uint256) {
   return (machineId,machineAllocs[machineId]); 
  }

  function getIsAllocated() view public returns (bool) {
   return isAllocated; 
  }

  function allocate(bytes32 machineId,uint256 userId) public {
    
    if( machineAllocs[machineId] == 0 ) {
      machineAllocs[machineId] = userId;
      
    }    
    emit Transferred(machineId,machineAllocs[machineId]);
  }

  function release(bytes32 machineId) public {
    machineAllocs[machineId] = 0;
  }

}