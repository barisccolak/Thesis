    var provider, contract, user;
    let signer;

    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed!');
        console.log(ethers.version);

        initContract();
    }

    //metamask connection
    async function initContract() {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []).then( () => {
            provider.listAccounts().then( (accounts) => {
                user = provider.getSigner(accounts[0]);

                const abi = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "message",
          "type": "string"
        }
      ],
      "name": "CompareEvent",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "expID",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "expHash",
          "type": "string"
        }
      ],
      "name": "GetEvent",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "expID",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "message",
          "type": "string"
        }
      ],
      "name": "RemoveEvent",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "expID",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "expHash",
          "type": "string"
        }
      ],
      "name": "SetEvent",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "name",
          "type": "string"
        }
      ],
      "name": "TestEvent",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint16",
          "name": "expID",
          "type": "uint16"
        },
        {
          "internalType": "string",
          "name": "newHash",
          "type": "string"
        }
      ],
      "name": "compareHash",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint16",
          "name": "expID",
          "type": "uint16"
        }
      ],
      "name": "getInput",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "isOwner",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint16",
          "name": "expID",
          "type": "uint16"
        }
      ],
      "name": "removeHash",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint16",
          "name": "expID",
          "type": "uint16"
        },
        {
          "internalType": "string",
          "name": "expHash",
          "type": "string"
        }
      ],
      "name": "setInput",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "text",
          "type": "string"
        }
      ],
      "name": "test",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];
                const address = '0x7225E3D3E8b13Ca93d6Ab9267646E83D5f5D1bA5'; //address of the contract
                contract = new ethers.Contract(address, abi, user);

                identity();
            });
        });
    }

    async function isOwner(){
        return await contract.isOwner();
    }
    async function identity() {

        if(! await isOwner()) {
            $("#identity").html(" Logged as User");
            $("#set").closest(".option").hide();
            $("#remove").closest(".option").hide();
        } else {
            $("#identity").html(" Logged as Admin");
        }
    }


    $(".selected").on("click", () => {
        $(".options-container").toggleClass("active");
    });

    $(".option").each( function() {
        $(this).on("click", () => {
            $(".selected").html($(this).find("label").text());
            $("#setButton").val($(this).find("label").text().toLowerCase());
            $(".options-container").removeClass("active");

            switch ($("#setButton").val()){
                case "compare":
                    $("#hash").show();
                    $("#hashTitle").show();
                    break;
                case "get":
                    $("#hash").hide();
                    $("#hashTitle").hide();
                    break;
                case "set":
                    $("#hash").show();
                    $("#hashTitle").show();
                    break;
                case "remove":
                    $("#hash").hide();
                    $("#hashTitle").hide();
                    break;
            }
        });
    });

    // change button function
    $("#setButton").on("click", function() {
        if ($("#setButton").val() !== ""){

            $(".loader").show();
            $("#instructor").hide();

            if ($("#setButton").val() === "compare")
                compareInput();
            else if ($("#setButton").val() === "set")
                setInput();
            else if ($("#setButton").val() === "get")
                getInput();
            else if ($("#setButton").val() === "remove")
                removeInput();
        } else {
            alert("Please choose a function.")
        }
    });

    async function setInput() {
        //create transaction with two inputs
        await contract.setInput($("#id").val(), $("#hash").val());

        //display the given inputs
        contract.once('SetEvent',  (method, event) => {
            $(".loader").hide();
            $("#instructor").show();
            $("#instructor").html("expID:"+parseInt(method._hex, 16) + "</br>expHash:" + event);
        });
    }

    async function getInput() {
        if ($("#id").val() <= 65535) {

            await contract.getInput($("#id").val());

            contract.once('GetEvent',  (method, event) => {
                $(".loader").hide();
                $("#instructor").show();

                $("#instructor").html("expID:"+parseInt(method._hex, 16) + "</br>expHash:" + event);
            });
        } else {
            alert("ExpID out of value.");
        }
    }

    async function compareInput() {
        await contract.compareHash($("#id").val(), $("#hash").val());

        contract.once('CompareEvent', (event) => {
            $(".loader").hide();
            $("#instructor").show();
            $("#instructor").html("Message:" + event);
        });
    }

    async function removeInput() {
        await contract.removeHash($("#id").val());

        contract.once('RemoveEvent',  (method, event) => {
            $(".loader").hide();
            $("#instructor").show();
            $("#instructor").html("expID:"+parseInt(method._hex, 16) + "</br>expHash:" + event);
        });
    }
