const BRICK_SIZE = 35;
const BRICK_MINI = 25
const SPACE = 5;
let canvas = document.getElementById('myCanvas');
let ctx = canvas.getContext('2d');

class GameBoard {
    constructor(row, col) {
        // khoảng cách khung chơi game so với khung canvas
        this.left = 200;
        this.top = 50
        // Hàng và cột màn chơi
        this.col = col;
        this.row = row;
        // kích thước giữa các ô
        this.width = SPACE + this.col*(SPACE+BRICK_SIZE);
        this.height = SPACE + (this.row - 5)*(SPACE+BRICK_SIZE);
        this.dataBoard = []; // Dữ liệu tổng ghi lại màn chơi
        this.fallBrick = []; // Dữ liệu Brick rơi xuống
        this.landBrick = []; // Dữ liệu Brick đã hạ cách
        this.brick = null; // Brick hiện tại đang rơi
        this.nextBrick = null; // Brick lượt sắp tới
        this.score = 0;
        this.leftNoticeBoard = 50 + this.left + SPACE + this.col*(SPACE+BRICK_SIZE); // Khoảng cách khung thông báo brick lượt sắp tới
        this.topNoticeBoard = (45 + this.left + SPACE + this.row*(SPACE+BRICK_SIZE))/3;
    }
    // Tạo dữ liệu màn chơi
    makeDataBoard() {
        for (let i = 0; i < this.row; i++) {
            this.dataBoard[i] = [];
            for (let j = 0; j < this.col; j++) {
               this.dataBoard[i][j] = {
                y: i-5,
                x: j,
                status: -1
               };
            }
        }
        return this.dataBoard;
    }
    // Tạo dữ liệu các bảng phụ
    makeFallBoard() {
        for (let i = 0; i < this.row; i++) {
            this.fallBrick[i] = [];
            for (let j = 0; j < this.col; j++) {
               this.fallBrick[i][j] = {
                y: i-5,
                x: j,
                status: -1
               };
            }
        }
        return this.fallBrick;
    }

    makeLandBoard() {
        for (let i = 0; i < this.row; i++) {
            this.landBrick[i] = [];
            for (let j = 0; j < this.col; j++) {
               this.landBrick[i][j] = {
                y: i-5,
                x: j,
                status: -1
               };
            }
        }
        return this.landBrick;
    }
    //Vẽ màn chơi
    drawBoard() {
        ctx.strokeRect(this.left,this.top,this.width,this.height);
        ctx.stroke();
        for (let i = 5; i < this.row; i++) {
            for (let j = 0; j < this.col; j++) {
                ctx.fillStyle = "#D3D3D3";
                ctx.fillRect(this.left + SPACE + j*(SPACE+BRICK_SIZE),this.top+SPACE+(i-5)*(SPACE+BRICK_SIZE),BRICK_SIZE,BRICK_SIZE);
            }         
        }
    }
    // Vẽ ô gạch random
    makeRandomBrick() {
        random = Math.round(Math.random()*6); // => chỉnh rơi brick
        this.displayFallBrick(random);
        return random;
    }
    // Lấy dữ liệu vị trí ô gạch xuất hiện
    getDataFallBrick() {
        for (const idxY in this.dataBoard) {
            for (const idxX in this.dataBoard[idxY]) {
                if (this.dataBoard[idxY][idxX].status != -1) {
                this.fallBrick[idxY][idxX] = this.dataBoard[idxY][idxX];
                }
            }  
        }
        return this.fallBrick;
    }
    // Lấy dữ liệu vị trí ô gạch rơi xuống thành công
    getDataLandBrick() {
        for (const idxY in this.fallBrick) {
            for (const idxX in this.fallBrick[idxY]) {
                this.landBrick[idxY][idxX] = this.fallBrick[idxY][idxX];
            }   
        }
        this.displayLandBrick();
        this.getDataFallBrick();
        return this.landBrick;
    }
    //Vẽ ô gạch random lượt sắp tới
    drawNextBrick(random) {
        if (random == 0) {
            // Lấy thông tin brick để hiển thị ra bảng chơi game
            this.dataBoard[0][4].status = 0;
            this.dataBoard[1][3].status = 0;
            this.dataBoard[1][4].status = 0;
            this.dataBoard[1][5].status = 0;
            this.getDataFallBrick();
            this.nextBrick = 'arrow';
            ctx.fillStyle = "red";
            // Vẽ brick turn sắp tới
            ctx.fillRect(this.leftNoticeBoard + SPACE + 1*(SPACE+BRICK_MINI),this.topNoticeBoard+SPACE+ 0*(SPACE+BRICK_MINI),BRICK_MINI,BRICK_MINI);
            ctx.fillRect(this.leftNoticeBoard + SPACE + 0*(SPACE+BRICK_MINI),this.topNoticeBoard+SPACE+ 1*(SPACE+BRICK_MINI),BRICK_MINI,BRICK_MINI);
            ctx.fillRect(this.leftNoticeBoard + SPACE + 1*(SPACE+BRICK_MINI),this.topNoticeBoard+SPACE+ 1*(SPACE+BRICK_MINI),BRICK_MINI,BRICK_MINI);
            ctx.fillRect(this.leftNoticeBoard + SPACE + 2*(SPACE+BRICK_MINI),this.topNoticeBoard+SPACE+ 1*(SPACE+BRICK_MINI),BRICK_MINI,BRICK_MINI);
        }
        if (random == 1) {
            this.dataBoard[0][3].status = 1;
            this.dataBoard[0][4].status = 1;
            this.dataBoard[1][3].status = 1;
            this.dataBoard[1][4].status = 1;
            this.getDataFallBrick();
            this.nextBrick = 'square';
            ctx.fillStyle = "yellow";
            ctx.fillRect(this.leftNoticeBoard + SPACE + 0*(SPACE+BRICK_MINI),this.topNoticeBoard+SPACE+ 0*(SPACE+BRICK_MINI),BRICK_MINI,BRICK_MINI);
            ctx.fillRect(this.leftNoticeBoard + SPACE + 1*(SPACE+BRICK_MINI),this.topNoticeBoard+SPACE+ 0*(SPACE+BRICK_MINI),BRICK_MINI,BRICK_MINI);
            ctx.fillRect(this.leftNoticeBoard + SPACE + 0*(SPACE+BRICK_MINI),this.topNoticeBoard+SPACE+ 1*(SPACE+BRICK_MINI),BRICK_MINI,BRICK_MINI);
            ctx.fillRect(this.leftNoticeBoard + SPACE + 1*(SPACE+BRICK_MINI),this.topNoticeBoard+SPACE+ 1*(SPACE+BRICK_MINI),BRICK_MINI,BRICK_MINI);
        }
        if (random == 2) {
            this.dataBoard[0][3].status = 2;
            this.dataBoard[0][4].status = 2;
            this.dataBoard[1][3].status = 2;
            this.dataBoard[2][3].status = 2;
            this.getDataFallBrick();
            this.nextBrick = 'rightL';
            ctx.fillStyle = "violet";
            ctx.fillRect(this.leftNoticeBoard + SPACE + 0*(SPACE+BRICK_MINI),this.topNoticeBoard+SPACE+ 0*(SPACE+BRICK_MINI),BRICK_MINI,BRICK_MINI);
            ctx.fillRect(this.leftNoticeBoard + SPACE + 1*(SPACE+BRICK_MINI),this.topNoticeBoard+SPACE+ 0*(SPACE+BRICK_MINI),BRICK_MINI,BRICK_MINI);
            ctx.fillRect(this.leftNoticeBoard + SPACE + 0*(SPACE+BRICK_MINI),this.topNoticeBoard+SPACE+ 1*(SPACE+BRICK_MINI),BRICK_MINI,BRICK_MINI);
            ctx.fillRect(this.leftNoticeBoard + SPACE + 0*(SPACE+BRICK_MINI),this.topNoticeBoard+SPACE+ 2*(SPACE+BRICK_MINI),BRICK_MINI,BRICK_MINI);
        }
        if (random == 3) {
            this.dataBoard[0][4].status = 3;
            this.dataBoard[1][4].status = 3;
            this.dataBoard[2][4].status = 3;
            this.dataBoard[3][4].status = 3;
            this.getDataFallBrick();
            this.nextBrick = 'line';
            ctx.fillStyle = "blue";
            ctx.fillRect(this.leftNoticeBoard + SPACE + 1*(SPACE+BRICK_MINI),this.topNoticeBoard+SPACE+ 0*(SPACE+BRICK_MINI),BRICK_MINI,BRICK_MINI);
            ctx.fillRect(this.leftNoticeBoard + SPACE + 1*(SPACE+BRICK_MINI),this.topNoticeBoard+SPACE+ 1*(SPACE+BRICK_MINI),BRICK_MINI,BRICK_MINI);
            ctx.fillRect(this.leftNoticeBoard + SPACE + 1*(SPACE+BRICK_MINI),this.topNoticeBoard+SPACE+ 2*(SPACE+BRICK_MINI),BRICK_MINI,BRICK_MINI);
            ctx.fillRect(this.leftNoticeBoard + SPACE + 1*(SPACE+BRICK_MINI),this.topNoticeBoard+SPACE+ 3*(SPACE+BRICK_MINI),BRICK_MINI,BRICK_MINI);
        }
        if (random == 4) {
            this.dataBoard[0][3].status = 4;
            this.dataBoard[0][4].status = 4;
            this.dataBoard[1][4].status = 4;
            this.dataBoard[2][4].status = 4;
            this.getDataFallBrick();
            this.nextBrick = 'leftL';
            ctx.fillStyle = "green";
            ctx.fillRect(this.leftNoticeBoard + SPACE + 0*(SPACE+BRICK_MINI),this.topNoticeBoard+SPACE+ 0*(SPACE+BRICK_MINI),BRICK_MINI,BRICK_MINI);
            ctx.fillRect(this.leftNoticeBoard + SPACE + 1*(SPACE+BRICK_MINI),this.topNoticeBoard+SPACE+ 0*(SPACE+BRICK_MINI),BRICK_MINI,BRICK_MINI);
            ctx.fillRect(this.leftNoticeBoard + SPACE + 1*(SPACE+BRICK_MINI),this.topNoticeBoard+SPACE+ 1*(SPACE+BRICK_MINI),BRICK_MINI,BRICK_MINI);
            ctx.fillRect(this.leftNoticeBoard + SPACE + 1*(SPACE+BRICK_MINI),this.topNoticeBoard+SPACE+ 2*(SPACE+BRICK_MINI),BRICK_MINI,BRICK_MINI);
        }
        if (random == 5) {
            this.dataBoard[0][3].status = 5;
            this.dataBoard[0][4].status = 5;
            this.dataBoard[1][4].status = 5;
            this.dataBoard[1][5].status = 5;
            this.getDataFallBrick();
            this.nextBrick = 'rightZ';
            ctx.fillStyle = "orange";
            ctx.fillRect(this.leftNoticeBoard + SPACE + 0*(SPACE+BRICK_MINI),this.topNoticeBoard+SPACE+ 0*(SPACE+BRICK_MINI),BRICK_MINI,BRICK_MINI);
            ctx.fillRect(this.leftNoticeBoard + SPACE + 1*(SPACE+BRICK_MINI),this.topNoticeBoard+SPACE+ 0*(SPACE+BRICK_MINI),BRICK_MINI,BRICK_MINI);
            ctx.fillRect(this.leftNoticeBoard + SPACE + 1*(SPACE+BRICK_MINI),this.topNoticeBoard+SPACE+ 1*(SPACE+BRICK_MINI),BRICK_MINI,BRICK_MINI);
            ctx.fillRect(this.leftNoticeBoard + SPACE + 2*(SPACE+BRICK_MINI),this.topNoticeBoard+SPACE+ 1*(SPACE+BRICK_MINI),BRICK_MINI,BRICK_MINI);
        }
        if (random == 6) {
            this.dataBoard[0][4].status = 6;
            this.dataBoard[0][5].status = 6;
            this.dataBoard[1][4].status = 6;
            this.dataBoard[1][3].status = 6;
            this.getDataFallBrick();
            this.nextBrick = 'leftZ';
            ctx.fillStyle = "pink";
            ctx.fillRect(this.leftNoticeBoard + SPACE + 1*(SPACE+BRICK_MINI),this.topNoticeBoard+SPACE+ 0*(SPACE+BRICK_MINI),BRICK_MINI,BRICK_MINI);
            ctx.fillRect(this.leftNoticeBoard + SPACE + 2*(SPACE+BRICK_MINI),this.topNoticeBoard+SPACE+ 0*(SPACE+BRICK_MINI),BRICK_MINI,BRICK_MINI);
            ctx.fillRect(this.leftNoticeBoard + SPACE + 1*(SPACE+BRICK_MINI),this.topNoticeBoard+SPACE+ 1*(SPACE+BRICK_MINI),BRICK_MINI,BRICK_MINI);
            ctx.fillRect(this.leftNoticeBoard + SPACE + 0*(SPACE+BRICK_MINI),this.topNoticeBoard+SPACE+ 1*(SPACE+BRICK_MINI),BRICK_MINI,BRICK_MINI);
        }
        this.makeDataBoard();
        console.log(`Next Brick: ${this.nextBrick}`);
    }
    //Hiển thị khung thông báo ô gạch lượt tới
    noticeNextBrick() {
        ctx.strokeRect (this.leftNoticeBoard,this.topNoticeBoard, SPACE+3*(SPACE+BRICK_MINI), SPACE+4*(SPACE+BRICK_MINI))
        ctx.stroke();
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 3; j++) {
            ctx.beginPath();
                ctx.fillStyle = "#D3D3D3";
                ctx.fillRect(5+this.leftNoticeBoard + j*(SPACE+BRICK_MINI),5 + this.topNoticeBoard + i*(SPACE+BRICK_MINI),BRICK_MINI,BRICK_MINI);
            }         
        }
        this.drawNextBrick(random);
    }
    //Hiển thị ô gạch đang rơi
    displayFallBrick() {
        for (const idxY in this.fallBrick) {
            for (const idxX in this.fallBrick[idxY]) {
                switch (this.fallBrick[idxY][idxX].status) {
                    case 0:
                        ctx.fillStyle = "red";
                        break;
                    case 1:
                        ctx.fillStyle = "yellow";
                        break;
                    case 2:
                        ctx.fillStyle = "violet";
                        break;
                    case 3:
                        ctx.fillStyle = "blue";
                        break;
                    case 4:
                        ctx.fillStyle = "green";
                        break;
                    case 5:
                        ctx.fillStyle = "orange";
                        break;
                    case 6:
                        ctx.fillStyle = "pink";
                        break;
                    default:
                        ctx.fillStyle = "#D3D3D3";
                        break;
                }
                if (this.fallBrick[idxY][idxX].y > -1 && this.fallBrick[idxY][idxX].status != -1) {
                    ctx.fillRect(this.left+SPACE+this.fallBrick[idxY][idxX].x*(SPACE+BRICK_SIZE),this.top+SPACE+ this.fallBrick[idxY][idxX].y*(SPACE+BRICK_SIZE),BRICK_SIZE,BRICK_SIZE);
                }
            }
        }
    } 

    // Hiển thị ô gạch đã hạ cánh
    displayLandBrick() {
        for (const idxY in this.landBrick) {
            for (const idxX in this.landBrick[idxY]) {
                switch (this.landBrick[idxY][idxX].status) {
                    case 0:
                        ctx.fillStyle = "red";
                        break;
                    case 1:
                        ctx.fillStyle = "yellow";
                        break;
                    case 2:
                        ctx.fillStyle = "violet";
                        break;
                    case 3:
                        ctx.fillStyle = "blue";
                        break;
                    case 4:
                        ctx.fillStyle = "green";
                        break;
                    case 5:
                        ctx.fillStyle = "orange";
                        break;
                    case 6:
                        ctx.fillStyle = "pink";
                        break;
                }
                if (this.landBrick[idxY][idxX].status != -1) {
                    ctx.fillRect(this.left+SPACE+this.landBrick[idxY][idxX].x*(SPACE+BRICK_SIZE),this.top+SPACE+ this.landBrick[idxY][idxX].y*(SPACE+BRICK_SIZE),BRICK_SIZE,BRICK_SIZE);
                }
            }  
        } 
    }
    // Brick rơi tự do ( Nhấn mũi tên xuống sẽ rơi nhanh hơn gấp đôi)
    autoDownBrick() {
        for (const idxY in this.fallBrick) {
            for (const idxX in this.fallBrick[idxY]) {
                if (this.fallBrick[idxY][idxX].y < 20 && this.fallBrick[idxY][idxX].status != -1 ) {
                    
                }
                    
            }
        }
        this.drawBoard();
        this.displayFallBrick();
        this.displayLandBrick();
    }
    // Dịch brick sang trái ( dùng nút mũi tên sang trái)
    moveLeftBrick() { 
        for (const idxY in this.fallBrick) {
            for (const idxX in this.fallBrick[idxY]) {
                this.fallBrick[idxY][idxX].x -= 1;
            }
        }
    this.drawBoard();
    this.displayFallBrick();
    this.displayLandBrick();
    }
    // Dịch brick sang phải ( dùng nút mũi tên sang phải)
    moveRightBrick() {
        for (const idxY in this.fallBrick) {
            for (const idxX in this.fallBrick[idxY]) {
                this.fallBrick[idxY][idxX].x += 1;
            }
        }
    this.drawBoard();
    this.displayFallBrick();
    this.displayLandBrick();
    }
    //xoay Brick
    rolateBrick() {
        for (const idx in this.fallBrick) {
            if (this.fallBrick[idx].x == this.fallBrick[2].x && this.fallBrick[idx].y == this.fallBrick[2].y ) {
                continue;
            } else if (this.fallBrick[idx].x == this.fallBrick[2].x && this.fallBrick[idx].y == this.fallBrick[2].y -1) {
                this.fallBrick[idx].x = this.fallBrick[2].x + 1;
                this.fallBrick[idx].y = this.fallBrick[2].y; 
            } else if (this.fallBrick[idx].x == this.fallBrick[2].x && this.fallBrick[idx].y == this.fallBrick[2].y -2) {
                this.fallBrick[idx].x = this.fallBrick[2].x + 2;
                this.fallBrick[idx].y = this.fallBrick[2].y; 
            } else if (this.fallBrick[idx].x == this.fallBrick[2].x + 1 && this.fallBrick[idx].y == this.fallBrick[2].y -1) {
                this.fallBrick[idx].y = this.fallBrick[2].y + 1;  
            } else if (this.fallBrick[idx].x == this.fallBrick[2].x + 1 && this.fallBrick[idx].y == this.fallBrick[2].y) {
                this.fallBrick[idx].x = this.fallBrick[2].x;
                this.fallBrick[idx].y = this.fallBrick[2].y + 1; 
            } else if(this.fallBrick[idx].x == this.fallBrick[2].x + 2 && this.fallBrick[idx].y == this.fallBrick[2].y) {
                this.fallBrick[idx].x = this.fallBrick[2].x;
                this.fallBrick[idx].y = this.fallBrick[2].y + 2; 
            } else if (this.fallBrick[idx].x == this.fallBrick[2].x +1  && this.fallBrick[idx].y == this.fallBrick[2].y +1) {
                this.fallBrick[idx].x = this.fallBrick[2].x -1;  
            } else if (this.fallBrick[idx].x == this.fallBrick[2].x && this.fallBrick[idx].y == this.fallBrick[2].y +1) {
                this.fallBrick[idx].x = this.fallBrick[2].x - 1;
                this.fallBrick[idx].y = this.fallBrick[2].y;
            } else if (this.fallBrick[idx].x == this.fallBrick[2].x && this.fallBrick[idx].y == this.fallBrick[2].y +2) {
                this.fallBrick[idx].x = this.fallBrick[2].x - 2;
                this.fallBrick[idx].y = this.fallBrick[2].y;
            } else if (this.fallBrick[idx].x == this.fallBrick[2].x -1&& this.fallBrick[idx].y == this.fallBrick[2].y +1) {
                this.fallBrick[idx].y = this.fallBrick[2].y -1;
            } else if (this.fallBrick[idx].x == this.fallBrick[2].x -1 && this.fallBrick[idx].y == this.fallBrick[2].y) {
                this.fallBrick[idx].x = this.fallBrick[2].x;
                this.fallBrick[idx].y = this.fallBrick[2].y -1;
            } else if (this.fallBrick[idx].x == this.fallBrick[2].x -2 && this.fallBrick[idx].y == this.fallBrick[2].y) {
                this.fallBrick[idx].x = this.fallBrick[2].x;
                this.fallBrick[idx].y = this.fallBrick[2].y -2;
            } else if (this.fallBrick[idx].x == this.fallBrick[2].x -1 && this.fallBrick[idx].y == this.fallBrick[2].y -1) {
                this.fallBrick[idx].x = this.fallBrick[2].x +1;
            } else if (this.fallBrick[idx].x == this.fallBrick[2].x +2 && this.fallBrick[idx].y == this.fallBrick[2].y -1) {
                this.fallBrick[idx].x = this.fallBrick[2].x +1;
                this.fallBrick[idx].y = this.fallBrick[2].y +2;
            } else if (this.fallBrick[idx].x == this.fallBrick[2].x +1 && this.fallBrick[idx].y == this.fallBrick[2].y +2) {
                this.fallBrick[idx].x = this.fallBrick[2].x -2;
                this.fallBrick[idx].y = this.fallBrick[2].y +1;
            } else if (this.fallBrick[idx].x == this.fallBrick[2].x -2 && this.fallBrick[idx].y == this.fallBrick[2].y +1) {
                this.fallBrick[idx].x = this.fallBrick[2].x -1;
                this.fallBrick[idx].y = this.fallBrick[2].y -2;
            } else if (this.fallBrick[idx].x == this.fallBrick[2].x -1 && this.fallBrick[idx].y == this.fallBrick[2].y -2) {
                this.fallBrick[idx].x = this.fallBrick[2].x +2;
                this.fallBrick[idx].y = this.fallBrick[2].y -1;
            }
        }
        this.drawBoard();
        this.displayFallBrick(random);
         this.displayLandBrick();
    }
    clearBrick() {};
    earnScore() {};
}
//Khởi tạo màn chơi
let newGame = new GameBoard(25,10);
newGame.makeDataBoard();
newGame.makeFallBoard();
newGame.makeLandBoard();
newGame.drawBoard();
let random;
let a=1;
newGame.makeRandomBrick();
console.log(`Số random: ${random}`);
newGame.noticeNextBrick();

// Game Loop
function autoDown() {
    newGame.autoDownBrick();
    // for (const idxY in newGame.fallBrick) {
    //     for (const idxX in newGame.fallBrick[idxY]) {
    //         if (newGame.fallBrick[idxY][idxX].y == 19 && newGame.fallBrick[idxY][idxX].status != -1) {
    //             a++;
    //             console.log(`Dừng lần ${a}`);
    //             newGame.getDataLandBrick();
    //             newGame.makeRandomBrick();
    //             console.log(`Số random: ${random}`);
    //             newGame.noticeNextBrick();
    //         }
    //     }
    // }
    
   
    setTimeout(autoDown,500);
}
autoDown();
// Phím chức năng: sang trái, sang phải, xoay brick, rơi xuống nhanh
onkeydown = function(evt) {
    switch (evt.keyCode) {
        case 37:
            if (newGame.fallBrick[0].x != 0 && newGame.fallBrick[1].x != 0 && newGame.fallBrick[2].x != 0 && newGame.fallBrick[3].x != 0 ) {
                newGame.moveLeftBrick();
                console.log(newGame.fallBrick[1].x);
            }
            break;
        case 38:
            if (newGame.fallBrick[0].y < 20 || newGame.fallBrick[1].y < 20 || newGame.fallBrick[2].y < 20 || newGame.fallBrick[3].y < 20) {
                newGame.rolateBrick();
            }
            break;
        case 39:
            if (newGame.fallBrick[0].x != 9 && newGame.fallBrick[1].x != 9 && newGame.fallBrick[2].x != 9 && newGame.fallBrick[3].x != 9 ) {
                newGame.moveRightBrick();
                console.log(newGame.fallBrick[1].x);
            }
            break;
        case 40:
            stopAutoDown();
            let downBrickFast = setInterval(moveDown,30);
            function moveDown() {
            newGame.autoDownBrick();
            for (const idx in newGame.fallBrick) {
                if (newGame.fallBrick[idx].y == newGame.dataBoard[24][0].y) {
                    stopDown();
                    newGame.getDataLandBrick();
                }
            }
            }
            function stopDown() {
            clearInterval(downBrickFast);
            }
            break;
        default:
            break;
    }
}

// => xoá sạch lại dữ liệu fall brick
