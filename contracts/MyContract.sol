// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract BA {
   address public owner;
   string empty = "";
    //biggest uint16 expID 65535 can be used as experiment identifier
    //example expHash = "ba7816bf8f01cfeaa1414a0de5dae2223b00361a39617a9cb410ff61f2001a5d";


    constructor() public {
    //Set the transaction sender as the owner of the contract
    owner = msg.sender;
    }
    //Mapped key-value pairs saved as stated variables and state variables saved in Blockchain
    mapping (uint16 => string) myMap;

    //Underline is a special character only used inside a function modifier
    modifier onlyOwner() {
    require(msg.sender == owner, "Not owner");
    _;
    }

    //Events to capture outputs
    event TestEvent(string name);
    event SetEvent(uint expID, string expHash);
    event GetEvent(uint expID, string expHash);
    event RemoveEvent(uint expID, string message);
    event CompareEvent(string message);


    //Set the sender of the contract as Owner
    function isOwner() view public returns (bool) {
       if (msg.sender == owner) {
          return true;
       }
       else {
          return false;
       }
    }


    //Data setter function. It can only be operated by Owner and two inputs are required.
    //After the two warnings, expHash is converted to bytes to store in the value in the mapping.
    //Input values are emitted to be collected and used for the front-end.
    function setInput(uint16 expID, string memory expHash) public onlyOwner {

        //Warning if the expID is bigger than 65535
        require(expID <= 65535, "Error: Experiment ID can't be bigger than 65535");
        //Warning if the expID already occupied.
        require(keccak256(bytes(myMap[expID]))== keccak256(bytes(empty)), "Error: Overwriting is not allowed.");
        bytes memory b = bytes(expHash);
        //Warning if the hash length wrong.
        require(b.length == 64, "Error: Hash is not 256-bit (32-byte)" );
        myMap[expID] = expHash;
        emit SetEvent(expID,expHash);
    }

    //Data getter function. No restrictions for usage, and only one input is required.
    //Given expID's corresponding key from mapping is extracted and converted into bytes
    //to use in keccak256 predefined function. Produced hash value is compared with the empty string's hash value.
    //If it is true, that means given expID doesn't exist. Either it's wrong or it is not stored.
    //If not, target value from mapping is extracted and emitted.

    function getInput(uint16 expID) public returns (string memory) {
        if (keccak256(bytes(myMap[expID])) == keccak256(bytes(empty))) {
            emit GetEvent(expID, "Given experiment id does not exist.");
            return ("Given experiment id does not exist.");
        } else {
            emit GetEvent(expID, myMap[expID]);
            return myMap[expID];
        }
    }


    //Data deletion function. Only operable for Owner and it requires single input.
    //If the given expID's hash is not stored, an error text will be returned.
    //If not, with the predefined delete function, key and value will be deleted from the mapping
    //and informative string will be emitted with the expID.
    function removeHash(uint16 expID) public onlyOwner returns (string memory){
        if (keccak256(bytes(myMap[expID])) != keccak256(bytes(empty))) {
            delete myMap[expID];
            emit RemoveEvent(expID, "Hash deleted.");
            return("Hash deleted.");
        } else {
            emit RemoveEvent(expID, "Experiment ID is wrong");
            return("Experiment ID is wrong");
        }
    }

    //Compare function. It is available for all participants and requires double input.
    //With this operation, a hash value of the saved hash value is produced.
    //Given hash value converted into bytes and stored in variable "ba".
    //If the hash of  given hash value is equal to stored hash value, verification is provided.
    function compareHash(uint16 expID, string memory newHash) public returns (string memory) {
        bytes memory ba = bytes(newHash);

        if (ba.length == 64) {
            if (keccak256(bytes(myMap[expID])) == keccak256(bytes(newHash))) {
                emit CompareEvent("Given hash is verified.");
                return ("Given hash is verified.");
            } else {
                emit CompareEvent("Given hash is not matching with the stored hash. Request uncorrupted hash to verify.");
                return ("Given hash is not matching with the stored hash. Request uncorrupted hash to verify.");
            }
        } else {
            emit CompareEvent("Error: Hash is not 256-bit (32-byte)");
            return("Error: Hash is not 256-bit (32-byte)"); //Warning if the hash length wrong.
        }
    }


    function test(string memory text) external {
        emit TestEvent(text);
    }


}