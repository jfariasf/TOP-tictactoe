const game = () => {
    const HUMAN = 1;
    const COMPUTER = -1;
    const TIE = 0;
    const options = ["X","O"]
    let popup_flag = true;
    let gameboard;
    let player_flag = false;
    let computer_flag = false;  
    
    /*
        Player object
        
    */
    const Player = (name, selection, type) =>{

        let winner = false;

        const getName = () => name;
        const getSelection = () => selection;
        const getType = () => type;
        const setWinner = () => {
            winner = true;
        };
        const getWinner = () => winner;
        return {getName, getSelection, getType, setWinner, getWinner};
    };
/* 
    GameBoard
    contains the DisplayController and BoardController modules
*/
    const Gameboard = (human, computer, dimension) =>{
        const MAX_TURNS = dimension * dimension;
        let turns = 0;
        let board_array = [];
        let game_ended = false;

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
            

            const clickHandler = (event) =>{
                BoardController.processTurn(event.target.id);
            };

            const createSlot = (posA, posB) => {
                let newSlot = document.createElement("div");

                newSlot.id = "slot_"+posA+"_"+posB;
                newSlot.innerHTML = "&nbsp;";
                newSlot.classList.add(SLOT_CLASS);

                newSlot.addEventListener("click", clickHandler);
                container.appendChild(newSlot);
                return newSlot;
            };

            const addSlotClasses = (slot, className) => {
                slot.classList.add(className);
            };
        
            const createNewLine = () => {
                container.appendChild(document.createElement("br"));
            };

            const addCSSStyle = (slot, posA, posB, total) => {
                if(posA<total && posB< total)
                    addSlotClasses(slot, MAIN_BORDER_CLASS);
                else if(posB == total && posA < total)
                    addSlotClasses(slot, BOTTOM_BORDER_CLASS);
                else if (posB == posA && total == posA){             
                }
                else
                    addSlotClasses(slot, RIGHT_BORDER_CLASS);
            };

            const addChoice = (mark, slot_id) =>{
                let slot = document.querySelector("#slot_"+slot_id.posY+"_"+slot_id.posX);
                slot.classList.add((mark == options[0])? "board_played_x":"board_played_o" );
                let newP = document.createElement("p");
                newP.classList.add("board_slot_text");
                newP.innerHTML = mark;
                slot.appendChild(newP);
                slot.removeEventListener("click", clickHandler);
            };

            const togglePopup = () => {
                if(popup_flag){
                    document.querySelector(".form_container").classList.add("form_container_hidden");
                    document.querySelector("#bg_overlay").classList.remove("overlay");
                    popup_flag = false;
                }
                else{
                    document.querySelector(".form_container").classList.remove("form_container_hidden");
                    document.querySelector("#bg_overlay").classList.add("overlay");
                    document.querySelector(".container").innerHTML = "";
                    document.querySelector(".winner_text").innerHTML = "";
                    game
                    popup_flag = true;
                }
            };

            const setWinnerTitle = (winner) => {
                document.querySelector(".winner_text").innerHTML="The winner is: "+winner+"!";
            };
            
            return {createSlot, addSlotClasses, createNewLine, addCSSStyle, addChoice, togglePopup, setWinnerTitle};
        })();

        /* 
            BoardController
            Controls the logic of the board
        */
        const BoardController = (()=> {
            const getComputerChoice = ()=>{
                let posY = Math.floor(Math.random() * (dimension));
                let posX = Math.floor(Math.random() * (dimension));
                
                if (turns >= MAX_TURNS)
                    return false;
                if (checkAvailability(posX, posY))
                    return {posX, posY};
                else 
                    return getComputerChoice();
            };

            const processScore = (score, human, computer) => {
                if (score == dimension){
                    human.setWinner();
                    return true;
                }
                else if(-score == dimension){
                    computer.setWinner();
                    return true;
                }
                return false;
            };

            const checkForWinners = (human, computer) => {
                let diagonal = new Array(2).fill(0);
                let horizontal = 0;
                let vertical = 0;

                for (let i = 0; i < dimension; i++){
                    horizontal = 0;
                    vertical = 0;
                    for (let y = 0; y < dimension; y++){
                        horizontal += board_array[i][y];
                        vertical += board_array[y][i];
                    }
                    diagonal[0] += board_array[i][i];
                    diagonal[1] += board_array[i][(dimension-1)-i];
                    if (processScore(horizontal, human, computer) || processScore(vertical, human, computer))
                        return;
                }
                processScore(diagonal[0], human, computer);
                processScore(diagonal[1], human, computer);
            };

            const processTurn = (choice) => {
                let playerTurn;
                let computerTurn;

                if(game_ended == true){
                    return;
                }
                let pos = choice.split("_");
                 if(computer_flag){
                    playerTurn = processPlayerSelection(human, {posY: pos[1], posX: pos[2]});
                    computerTurn = processPlayerSelection(computer, getComputerChoice());
                }
                else{
                    if(!player_flag){
                        playerTurn = processPlayerSelection(human, {posY: pos[1], posX: pos[2]});
                        computerTurn = true;
                        player_flag = true;
                    }
                    else{
                        computerTurn = processPlayerSelection(computer, {posY: pos[1], posX: pos[2]});
                        playerTurn = true;
                        player_flag = false;
                    }
                }
                checkForWinners(human, computer);

                if(human.getWinner()){
                    endGame(human.getName());
                }
                else if(computer.getWinner()){
                    endGame(computer.getName());
                }
                else{
                    if(!playerTurn || !computerTurn )
                        endGame("None. It's a tie");
                } 
            };

            const endGame = (winner) => {
                DisplayController.setWinnerTitle(winner);
                game_ended = true;

            };

            const processPlayerSelection = (player, selection) => {
                if (turns < MAX_TURNS){
                    DisplayController.addChoice(player.getSelection(), selection);
                    board_array[selection.posY][selection.posX] += player.getType();
                    turns++;
                    return true;
                }
                else
                    return false;

            };

            const checkAvailability = (posX, posY) => {
                return (board_array[posY][posX] == 0)
            };

            const buildBoard = () => {
                for(let i = 0; i < dimension; i++){
                    board_array[i] = [];
                    for(let j = 0; j < dimension; j++){
                        board_array[i].push(0);
                        const slot = DisplayController.createSlot(i, j);
                        DisplayController.addCSSStyle(slot, i, j, dimension-1);
                    }
                    DisplayController.createNewLine();
                    
                }
            };
            const initComputerTurn = () => {
                processPlayerSelection(computer, getComputerChoice());
            }


            return {buildBoard, processTurn, getComputerChoice, initComputerTurn};       
        })();
        return {DisplayController, BoardController};
    };

    const start = (selection) => {
        let opponentType = document.querySelector('input[name="player_type"]:checked').value;
        let boardSize = document.querySelector("#form_size").value;
        let player1_name = document.querySelector("#player1_name").value;
        let player2_name = document.querySelector("#player2_name").value;
        let player = Player(player1_name,options[selection], HUMAN);
        let computer = Player(player2_name,options[1-selection], COMPUTER);

        gameboard = Gameboard(player, computer, boardSize);
        gameboard.BoardController.buildBoard();
        if(opponentType == "computer"){
            computer_flag = true;
        }
        if (player.getSelection()==options[1]){
            if(computer_flag == true)
                gameboard.BoardController.initComputerTurn();
            else
                player_flag = true;
        }
        
        gameboard.DisplayController.togglePopup();
    };

    const restart = () => {
        gameboard.DisplayController.togglePopup();
    };
    return {start, restart};
};


let selection = 0;
let newgame;
let toggleFlag = true;

const toggleSelection = () => {
    if (toggleFlag){
        document.querySelector("#player1xBox").classList.remove("selected");
        document.querySelector("#player1oBox").classList.add("selected");
        document.querySelector("#player2oBox").classList.remove("selected");
        document.querySelector("#player2xBox").classList.add("selected");
        toggleFlag = false;
    }
    else{
        document.querySelector("#player1xBox").classList.add("selected");
        document.querySelector("#player1oBox").classList.remove("selected");
        document.querySelector("#player2oBox").classList.add("selected");
        document.querySelector("#player2xBox").classList.remove("selected");
        toggleFlag = true;
    }
}

const setSelection = (choice, player) =>{
    selection = (player == 1) ? choice : 1 - choice;
    if (selection == 1 && toggleFlag)
        toggleSelection();
    else if(selection == 0 && !toggleFlag)
        toggleSelection();
};

const startGame = () =>{
    newgame = game();
    newgame.start(selection);
    return false;
};

const restartGame = () => {
    newgame.restart();
};