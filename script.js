const game = () => {

    /*
        Player class
        has a selection of cross or circle
        contains and increases score
    */
    const Player = (selection) =>{

        let score = 0;
        const getSelection = () => selection;
        const getScore = () => score;
        const increaseScore = () => score++;

        const playerChoice = (choice) => {
            alert(choice);
        };


        return {getSelection, getScore, increaseScore,playerChoice};
    };
/* 
    GameBoard
    contains the DisplayController and BoardController modules
*/
    const Gameboard = (human, computer, dimension) =>{
        const MAX_TURNS = dimension * dimension;
        let turns = 0;
        let board_array = [];
        
        /*
            DisplayController
            Controls the interaction of the board with the display
        */
        const DisplayController = (()=>{
            const MAIN_BORDER_CLASS = "board_main_border";
            const BOTTOM_BORDER_CLASS = "board_bottom_border";
            const RIGHT_BORDER_CLASS = "board_right_border";
            const SLOT_CLASS = "board_slot";

            let container = document.querySelector(".container");
            let newSlot;

            const clickHandler = (event) =>{

                BoardController.processTurn(event.target.id);
                
            }

            const createSlot = (posA, posB) => {
                newSlot = document.createElement("div");
                newSlot.id = "slot_"+posA+"_"+posB;
                newSlot.innerHTML = "&nbsp;";
                newSlot.classList.add(SLOT_CLASS);
                newSlot.addEventListener("click", clickHandler);
                container.appendChild(newSlot);
                return newSlot;
            }

            const addSlotClasses = (slot, className) => {
                slot.classList.add(className);
            }
        
            const createNewLine = () => {
                container.appendChild(document.createElement("br"));
            }
            const addCSSStyle = (slot, posA, posB, total) => {
                if(posA<total-1 && posB< total -1)
                    addSlotClasses(slot, MAIN_BORDER_CLASS);
                else if(posB == total-1 && posA < total -1)
                    addSlotClasses(slot, BOTTOM_BORDER_CLASS);
                else if (posB == posA && total-1 == posA){             
                }
                else
                    addSlotClasses(slot, RIGHT_BORDER_CLASS);
            }

            const addChoice = (mark, slot_id) =>{
                let slot = document.querySelector("#slot_"+slot_id.posY+"_"+slot_id.posX);
                slot.innerHTML = mark;
                slot.removeEventListener("click", clickHandler);

            };


            
            return {createSlot, addSlotClasses, createNewLine, addCSSStyle, addChoice};
        })();

        /* 
            Controls the logic of the board
        */
        const BoardController = (()=> {
            const getComputerChoice = ()=>{
                let posY = Math.floor(Math.random() * (dimension));
                let posX = Math.floor(Math.random() * (dimension));

                if (turns>=MAX_TURNS)
                    return false;
                if (checkAvailability(posX,posY))
                    return {posX, posY};
                else 
                    return getComputerChoice();
            }

            const processTurn = (choice) => {
                let pos = choice.split("_");
                let playerTurn = processPlayerSelection(human, {posY: pos[1], posX: pos[2]});
                let computerTurn = processPlayerSelection(computer, getComputerChoice());
                if(!playerTurn || !computerTurn){
                      endGame();
                }
                
            };

            const endGame = () => {
                alert("game Ended");

            }

            const processPlayerSelection = (player, selection) => {
                if (turns < MAX_TURNS){
                    DisplayController.addChoice(player.getSelection(), selection);
                    board_array[selection.posY][selection.posX] = 1;
                    turns++;
                    return true;
                }
                else
                    return false;

            }

            const checkAvailability = (posX, posY) => {
                return (board_array[posY][posX] == 0)
            }

            const buildBoard = () => {
                for(let i = 0; i < dimension; i++){
                    board_array[i] = [];
                    for(let j = 0; j < dimension; j++){
                        board_array[i].push(0);
                        const slot = DisplayController.createSlot(i, j);
                        DisplayController.addCSSStyle(slot, i, j, dimension);
                    }
                    DisplayController.createNewLine();
                }
            };
            return {buildBoard, processTurn};        
        })();

        return {DisplayController, BoardController};
    };

    const start = ()=>{
        let player = Player("X");
        let computer = Player("O");
        let dimension = 3;

        let gameboard = Gameboard(player, computer, dimension);
        gameboard.BoardController.buildBoard(dimension)
    }
    return {start};
};

const newgame = game();
newgame.start();




/*
            if (Math.abs(j-i) == dimension - 1 || i+j == 0 || (j-i == 0 && (j == dimension-1 || i == dimension-1)))
                    new_div.innerHTML = "corner";
            else if (j == Math.floor( dimension/2) && i == Math.floor(dimension/2))
                new_div.innerHTML = "center";
            else
                new_div.innerHTML = "not";
*/