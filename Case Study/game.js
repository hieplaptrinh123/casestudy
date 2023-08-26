let canvas = document.getElementById('myCanvas');
let ctx = canvas.getContext('2d');
let gameover = document.getElementById('overimg');
let startGame = document.getElementById('startGame');
let muteMusic = document.getElementById('muteMusic');
let onMusic = document.getElementById('onMusic');
ctx.drawImage(startGame,450,700,200,80);
ctx.drawImage(muteMusic,665,600,50,50);
ctx.drawImage(onMusic,665,540,50,50);

let ingameMusic = document.getElementById("ingameMusic");
document.getElementById("ingameMusic").loop = true;
let overMusic = document.getElementById("overMusic");

function playIngameMusic() {
    ingameMusic.play();
}
function pauseIngameMusic() {
    ingameMusic.pause();
}
function playGameOverMusic() {
    overMusic.play();
}
function pauseGameOverMusic() {
    overMusic.pause();
}

const BRICK_SIZE = 20; // kích thước ô gạch màn hình chính
const BRICK_MINI = 15 // kích thước ô gạch màn hình phụ
const SPACE = 3; // khoảng cách giữa các ô
// Tạo class Gameboard
class GameBoard {
    constructor(row, col) {
        this.left = 350; // khoảng cách trái của bảng chơi 
        this.top = 92 // khoảng cách trên của bảng chơi
        this.col = col; // số hàng màn chơi
        this.row = row; // số cột màn chiow
        this.width = SPACE + this.col*(SPACE+BRICK_SIZE); // chiều dài bảng chơi
        this.height = SPACE + (this.row - 5)*(SPACE+BRICK_SIZE); // chiều cao bảng chơi
        this.dataBoard = []; // dữ liệu hiển thị bảng chơi
        this.fallBrick = []; // dữ liệu gạch rơi
        this.landBrick = []; // dữ liệu gạch hạ cánh
        this.breakBrick = 1; // ô gạch kiểm tra trạng thái nổ
        this.rowsBreak = 0; // hàng gạch bị ổ
        this.nextBrick = null; // hiển thị viên gạch sắp tới
        this.score = 0;
        this.highScore = 0;
        this.leftNoticeBoard = 35 + this.left + SPACE + this.col*(SPACE+BRICK_SIZE); // khoảng cách trái của màn hình phụ
        this.topNoticeBoard = (45 + this.left + SPACE + this.row*(SPACE+BRICK_SIZE))/3; // khoảng cách trên của màn hình phụ
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
        this.breakBrick = 1;
        return random;
    }
    // Lấy dữ liệu vị trí ô gạch xuất hiện
    getDataFallBrick() {
        for (const idxY in this.dataBoard) {
            for (const idxX in this.dataBoard[idxY]) {
                if (this.dataBoard[idxY][idxX].status != -1) {
                this.fallBrick.push(this.dataBoard[idxY][idxX]);
                }
            }  
        }
        return this.fallBrick;
    }
    // Lấy dữ liệu vị trí ô gạch rơi xuống thành công
    getDataLandBrick() {
        for (const idx in this.fallBrick) {
            this.landBrick.push(this.fallBrick[idx]);
        }
        this.fallBrick = [];
        return this.landBrick;
    }
    //Vẽ ô gạch random lượt sắp tới
    drawNextBrick(random) {
        if (random == 0) {
            // Lấy thông tin brick để hiển thị ra bảng chơi game
            this.dataBoard[0][6].status = 0;
            this.dataBoard[1][5].status = 0;
            this.dataBoard[1][6].status = 0;
            this.dataBoard[1][7].status = 0;
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
            this.dataBoard[0][5].status = 1;
            this.dataBoard[0][6].status = 1;
            this.dataBoard[1][5].status = 1;
            this.dataBoard[1][6].status = 1;
            this.getDataFallBrick();
            this.nextBrick = 'square';
            ctx.fillStyle = "yellow";
            ctx.fillRect(this.leftNoticeBoard + SPACE + 0*(SPACE+BRICK_MINI),this.topNoticeBoard+SPACE+ 0*(SPACE+BRICK_MINI),BRICK_MINI,BRICK_MINI);
            ctx.fillRect(this.leftNoticeBoard + SPACE + 1*(SPACE+BRICK_MINI),this.topNoticeBoard+SPACE+ 0*(SPACE+BRICK_MINI),BRICK_MINI,BRICK_MINI);
            ctx.fillRect(this.leftNoticeBoard + SPACE + 0*(SPACE+BRICK_MINI),this.topNoticeBoard+SPACE+ 1*(SPACE+BRICK_MINI),BRICK_MINI,BRICK_MINI);
            ctx.fillRect(this.leftNoticeBoard + SPACE + 1*(SPACE+BRICK_MINI),this.topNoticeBoard+SPACE+ 1*(SPACE+BRICK_MINI),BRICK_MINI,BRICK_MINI);
        }
        if (random == 2) {
            this.dataBoard[0][5].status = 2;
            this.dataBoard[0][6].status = 2;
            this.dataBoard[1][5].status = 2;
            this.dataBoard[2][5].status = 2;
            this.getDataFallBrick();
            this.nextBrick = 'rightL';
            ctx.fillStyle = "violet";
            ctx.fillRect(this.leftNoticeBoard + SPACE + 0*(SPACE+BRICK_MINI),this.topNoticeBoard+SPACE+ 0*(SPACE+BRICK_MINI),BRICK_MINI,BRICK_MINI);
            ctx.fillRect(this.leftNoticeBoard + SPACE + 1*(SPACE+BRICK_MINI),this.topNoticeBoard+SPACE+ 0*(SPACE+BRICK_MINI),BRICK_MINI,BRICK_MINI);
            ctx.fillRect(this.leftNoticeBoard + SPACE + 0*(SPACE+BRICK_MINI),this.topNoticeBoard+SPACE+ 1*(SPACE+BRICK_MINI),BRICK_MINI,BRICK_MINI);
            ctx.fillRect(this.leftNoticeBoard + SPACE + 0*(SPACE+BRICK_MINI),this.topNoticeBoard+SPACE+ 2*(SPACE+BRICK_MINI),BRICK_MINI,BRICK_MINI);
        }
        if (random == 3) {
            this.dataBoard[0][6].status = 3;
            this.dataBoard[1][6].status = 3;
            this.dataBoard[2][6].status = 3;
            this.dataBoard[3][6].status = 3;
            this.getDataFallBrick();
            this.nextBrick = 'line';
            ctx.fillStyle = "blue";
            ctx.fillRect(this.leftNoticeBoard + SPACE + 1*(SPACE+BRICK_MINI),this.topNoticeBoard+SPACE+ 0*(SPACE+BRICK_MINI),BRICK_MINI,BRICK_MINI);
            ctx.fillRect(this.leftNoticeBoard + SPACE + 1*(SPACE+BRICK_MINI),this.topNoticeBoard+SPACE+ 1*(SPACE+BRICK_MINI),BRICK_MINI,BRICK_MINI);
            ctx.fillRect(this.leftNoticeBoard + SPACE + 1*(SPACE+BRICK_MINI),this.topNoticeBoard+SPACE+ 2*(SPACE+BRICK_MINI),BRICK_MINI,BRICK_MINI);
            ctx.fillRect(this.leftNoticeBoard + SPACE + 1*(SPACE+BRICK_MINI),this.topNoticeBoard+SPACE+ 3*(SPACE+BRICK_MINI),BRICK_MINI,BRICK_MINI);
        }
        if (random == 4) {
            this.dataBoard[0][5].status = 4;
            this.dataBoard[0][6].status = 4;
            this.dataBoard[1][6].status = 4;
            this.dataBoard[2][6].status = 4;
            this.getDataFallBrick();
            this.nextBrick = 'leftL';
            ctx.fillStyle = "green";
            ctx.fillRect(this.leftNoticeBoard + SPACE + 0*(SPACE+BRICK_MINI),this.topNoticeBoard+SPACE+ 0*(SPACE+BRICK_MINI),BRICK_MINI,BRICK_MINI);
            ctx.fillRect(this.leftNoticeBoard + SPACE + 1*(SPACE+BRICK_MINI),this.topNoticeBoard+SPACE+ 0*(SPACE+BRICK_MINI),BRICK_MINI,BRICK_MINI);
            ctx.fillRect(this.leftNoticeBoard + SPACE + 1*(SPACE+BRICK_MINI),this.topNoticeBoard+SPACE+ 1*(SPACE+BRICK_MINI),BRICK_MINI,BRICK_MINI);
            ctx.fillRect(this.leftNoticeBoard + SPACE + 1*(SPACE+BRICK_MINI),this.topNoticeBoard+SPACE+ 2*(SPACE+BRICK_MINI),BRICK_MINI,BRICK_MINI);
        }
        if (random == 5) {
            this.dataBoard[0][5].status = 5;
            this.dataBoard[0][6].status = 5;
            this.dataBoard[1][6].status = 5;
            this.dataBoard[1][7].status = 5;
            this.getDataFallBrick();
            this.nextBrick = 'rightZ';
            ctx.fillStyle = "orange";
            ctx.fillRect(this.leftNoticeBoard + SPACE + 0*(SPACE+BRICK_MINI),this.topNoticeBoard+SPACE+ 0*(SPACE+BRICK_MINI),BRICK_MINI,BRICK_MINI);
            ctx.fillRect(this.leftNoticeBoard + SPACE + 1*(SPACE+BRICK_MINI),this.topNoticeBoard+SPACE+ 0*(SPACE+BRICK_MINI),BRICK_MINI,BRICK_MINI);
            ctx.fillRect(this.leftNoticeBoard + SPACE + 1*(SPACE+BRICK_MINI),this.topNoticeBoard+SPACE+ 1*(SPACE+BRICK_MINI),BRICK_MINI,BRICK_MINI);
            ctx.fillRect(this.leftNoticeBoard + SPACE + 2*(SPACE+BRICK_MINI),this.topNoticeBoard+SPACE+ 1*(SPACE+BRICK_MINI),BRICK_MINI,BRICK_MINI);
        }
        if (random == 6) {
            this.dataBoard[0][6].status = 6;
            this.dataBoard[0][7].status = 6;
            this.dataBoard[1][6].status = 6;
            this.dataBoard[1][5].status = 6;
            this.getDataFallBrick();
            this.nextBrick = 'leftZ';
            ctx.fillStyle = "brown";
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
                ctx.fillRect(SPACE+this.leftNoticeBoard + j*(SPACE+BRICK_MINI),SPACE + this.topNoticeBoard + i*(SPACE+BRICK_MINI),BRICK_MINI,BRICK_MINI);
            }         
        }
        this.drawNextBrick(random);
    }
    //Vẽ ô gạch đang rơi
    drawFallBrick() {
        for (const idx in this.fallBrick) {
            if (this.fallBrick[idx].y > -1) {
                if (this.fallBrick[idx].x>-1 && this.fallBrick[idx].x <this.col) {
                    ctx.fillRect(this.left+SPACE+this.fallBrick[idx].x*(SPACE+BRICK_SIZE),this.top+SPACE+ this.fallBrick[idx].y*(SPACE+BRICK_SIZE),BRICK_SIZE,BRICK_SIZE);
                }
            }
        } 
    }
    // Hiển thị ô gạch đang rơi
    displayFallBrick(random) {
        switch (random) {
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
                ctx.fillStyle = "brown";
                break;
            default:
                ctx.fillStyle = "#D3D3D3";
                break;
        }
        this.drawFallBrick(); 
    }
    // Hiển thị ô gạch đã hạ cánh
    displayLandBrick() {
        for (const idx in this.landBrick) {
            switch (this.landBrick[idx].status) {
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
                    ctx.fillStyle = "brown";
                    break;
            }
            if (this.landBrick[idx].y > -1) {
                ctx.fillRect(this.left+SPACE+this.landBrick[idx].x*(SPACE+BRICK_SIZE),this.top+SPACE+ this.landBrick[idx].y*(SPACE+BRICK_SIZE),BRICK_SIZE,BRICK_SIZE);
            }
            
        } 
    }
    // Brick rơi tự do ( Nhấn mũi tên xuống sẽ rơi nhanh hơn)
    autoDownBrick() {
        for (const idx in this.fallBrick) {
                this.fallBrick[idx].y += 1;
        }
        this.drawBoard();
        this.displayFallBrick(random);
        this.displayLandBrick();
    }
    // Dịch brick sang trái ( dùng nút mũi tên sang trái)
    moveLeftBrick() { 
        for (const idx in this.fallBrick) {
                this.fallBrick[idx].x -= 1;
        }
    this.drawBoard();
    this.displayFallBrick(random);
    this.displayLandBrick();
    }
    // Dịch brick sang phải ( dùng nút mũi tên sang phải)
    moveRightBrick() {
        for (const idx in this.fallBrick) {
                this.fallBrick[idx].x += 1;
        }
    this.drawBoard();
    this.displayFallBrick(random);
    this.displayLandBrick();
    }
    //xoay Brick
    rolateBrick() {
        for (const idx in this.fallBrick) {
            if (this.fallBrick[idx].x < 0) {
                this.moveRightBrick();
            }
            if (this.fallBrick[idx].x > this.col-1) {
                this.moveLeftBrick();
            }
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
    moveDownLandBrick(idx) {
        this.landBrick[idx].y +=1
    }

    clearBrick() {
        if (this.landBrick.length >this.col) {
            console.log(`Bắt đầu check chuỗi ăn điểm`);
            for (let j = 0; j < this.landBrick.length - this.col -1; j++) {
                this.breakBrick = 1;
                for (let i = 1; i < this.col; i++) {
                    if (!this.landBrick[j].y || this.landBrick[j].y != this.landBrick[j+i].y) {
                        this.breakBrick = 1;
                        break;
                    } else {
                        if (this.landBrick[j].status != -1 && this.landBrick[j+i].status != -1 && this.landBrick[j].y == this.landBrick[j+i].y) {
                            this.breakBrick++;
                            console.log(j , i ,this.landBrick[j].status, this.landBrick[j+i].status, this.landBrick[j].y, this.landBrick[j+i].y  );
                            console.log(`Chuỗi ăn: ${this.breakBrick}`);
                        }
                    }
                    if (this.breakBrick == this.col) {
                        console.log(`Chuỗi ăn: ${this.breakBrick} tại ${j} ${i}`);
                        this.rowsBreak++;
                        this.breakBrick = 1;
                        for (let k = 0; k < this.landBrick.length; k++) {
                            if (this.landBrick[k].y <this.landBrick[j].y) {
                                this.landBrick[k].y +=1
                            }
                        }
                        this.landBrick.splice(j,this.col);
                        this.drawBoard();
                        this.displayFallBrick(random);
                        this.displayLandBrick();
                        if (j == 0) {
                            j = -1;
                        } else {
                            j--;
                        }
                        continue;
                    }
                }
            }
            this.score += this.earnScore(this.rowsBreak);;
            this.rowsBreak = 0;
            return this.score;
        }
    }
    earnScore(rowsBreak) {
        return (rowsBreak * (rowsBreak + 1)) / 2;
    }
    getHighScore() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
        }
        return this.highScore;
    }
}
// Khởi tạo đối tượng & màn chơi
let newGame = new GameBoard(30,12);
let random;
let timeDelay = 500 // thời gian brick rơi
let vaCham = false; // kiểm tra va chạm

newGame.makeDataBoard();
newGame.drawBoard();
newGame.makeRandomBrick();
function makeANewGame() {
    timeDelay = 400;
    console.log(`Số random: ${random}`);
    newGame.noticeNextBrick();
}
// Kiểm tra Brick xoay bị vượt ra ngoài khung
function kiemTraNgoaiBien() {
    if (newGame.fallBrick[0].x < 0 || newGame.fallBrick[1].x < 0 || newGame.fallBrick[2].x < 0 || newGame.fallBrick[3].x < 0 ) {
        newGame.moveRightBrick();
        console.log ('Vượt giơi hạn, back sang phải')
    }
    if (newGame.fallBrick[0].x > newGame.col-1 || newGame.fallBrick[1].x > newGame.col-1 || newGame.fallBrick[2].x > newGame.col-1 || newGame.fallBrick[3].x > newGame.col-1 ) {
        newGame.moveLeftBrick();
        console.log ('Vượt giơi hạn, back sang trái')
    }
}
// Kiểm tra Brick đã chạm với các khối đã hạ cách chưa
function kiemTraVaCham () {
    vaCham = false;
    for (const idx in newGame.fallBrick) {
        for (const idx2 in newGame.landBrick) {
            if (newGame.fallBrick[idx].y == newGame.landBrick[idx2].y ) {
                if (newGame.fallBrick[idx].x == newGame.landBrick[idx2].x -1 || newGame.fallBrick[idx].x == newGame.landBrick[idx2].x +1) {
                        vaCham = true;
                        break;
                }
            }
        }
     }
    return vaCham;
}
// Sắp xếp lại các object của Brick đã hạ cách theo thứ tự tọa độ y
function compareY(a, b) {
    return b.y - a.y;
}
function compareX(a, b) {
    return a.x - b.x;
}
// Kết thúc lượt chơi
function stopGame() {
    for (const idx in newGame.landBrick) {
        if (newGame.landBrick[idx].y == 0) {
            newGame.fallBrick = [];
            newGame.displayFallBrick();
            timeDelay = 9999999999;
            ctx.drawImage(gameover,200,200);
            pauseIngameMusic();
            playGameOverMusic();
        }
    }
}
//Hiển thị điểm
function displayScore(score) {
    ctx.font = "30px Calibri";
    ctx.clearRect(650,245,80,25);
    ctx.fillStyle = "orange";
    ctx.fillText(`${score}`, 655,270);
}

function displayHighScore(highScore) {
    ctx.font = "30px Calibri";
    ctx.clearRect(650,150,80,25);
    ctx.fillStyle = "orange";
    ctx.fillText(`${highScore}`, 655,175);
}

function gameLoop() {
    kiemTraNgoaiBien();
    newGame.autoDownBrick();
    for (const idx in newGame.landBrick) {
        if (newGame.landBrick[idx].y == -1 && newGame.landBrick[idx].status != -1) {
            stopGame();
            break;
        }
    }
    if (newGame.fallBrick[0].y == newGame.row-6 || newGame.fallBrick[1].y == newGame.row-6 || newGame.fallBrick[2].y == newGame.row-6 || newGame.fallBrick[3].y == newGame.row-6) {
        timeDelay = 400;
        newGame.getDataLandBrick().sort(compareX);
        newGame.getDataLandBrick().sort(compareY);
        console.log(newGame.landBrick);
        newGame.clearBrick();
        newGame.makeRandomBrick();
        newGame.noticeNextBrick();
    } else {
        for (const idx in newGame.fallBrick) {
            for (const idx2 in newGame.landBrick) {
                if (newGame.fallBrick[idx].x == newGame.landBrick[idx2].x && newGame.fallBrick[idx].y == newGame.landBrick[idx2].y-1) {
                    timeDelay = 400;
                    stopGame();
                    newGame.getDataLandBrick().sort(compareX);
                    newGame.getDataLandBrick().sort(compareY);
                    newGame.clearBrick();
                    newGame.makeRandomBrick();
                    newGame.noticeNextBrick();
                }
            }
        }
    }
    console.log(`Điểm hiện tại: ${newGame.score}`);
    displayScore(newGame.score);
    newGame.getHighScore();
    displayHighScore(newGame.highScore);
    setTimeout(gameLoop,timeDelay);
}

onkeydown = function(evt) {
    switch (evt.keyCode) {
        case 37:
            kiemTraVaCham();
            if (newGame.fallBrick[0].x != 0 && newGame.fallBrick[1].x != 0 && newGame.fallBrick[2].x != 0 && newGame.fallBrick[3].x != 0 && vaCham == false ) {
                newGame.moveLeftBrick();
            }
            break;
        case 38:
            if (newGame.fallBrick[0].y < newGame.row-5 || newGame.fallBrick[1].y < newGame.row-5 || newGame.fallBrick[2].y < newGame.row-5 || newGame.fallBrick[3].y < newGame.row-5) {
                newGame.rolateBrick();
            }
            break;
        case 39:
            kiemTraVaCham();
            if (newGame.fallBrick[0].x != newGame.col -1 && newGame.fallBrick[1].x != newGame.col -1 && newGame.fallBrick[2].x != newGame.col -1 && newGame.fallBrick[3].x != newGame.col -1 && vaCham ==false ) {
                newGame.moveRightBrick();
            }
            break;
        case 40:
            timeDelay = 20;
            break;
        default:
            break;
        }
}
// Bắt đầu chơi game
let startAGame = true;
canvas.onclick = function myFunction(event) {
    let x = event.offsetX ;
    let y = event.offsetY;
    toaDoClick = {
        x: x,
        y: y
    }
    console.log(`Click: ${toaDoClick.x}, ${toaDoClick.y}`);
    if (toaDoClick.x >445 && toaDoClick.x <525 && toaDoClick.y > 605 && toaDoClick.y < 645) {
        timeDelay = 500;
        ctx.clearRect(230,240,600,600);
        newGame.landBrick = [];
        newGame.drawBoard();
        newGame.displayFallBrick(random);
        newGame.displayLandBrick();
        newGame.noticeNextBrick();
        gameLoop();
        pauseGameOverMusic();
        playIngameMusic();
        ctx.drawImage(startGame,450,700,200,80);
        ctx.drawImage(muteMusic,665,600,50,50);
        ctx.drawImage(onMusic,665,540,50,50);
        newGame.score = 0;
    }
    if (toaDoClick.x >450 && toaDoClick.x <640 && toaDoClick.y > 700 && toaDoClick.y < 770 && startAGame == true) {
        makeANewGame();
        gameLoop();
        playIngameMusic();
        startAGame = false;
        console.log(`Bắt đầu chơi`);
        newGame.score = 0;
    }
    if (toaDoClick.x >665 && toaDoClick.x <710 && toaDoClick.y > 540 && toaDoClick.y < 585) {
        playIngameMusic();
    }
    if (toaDoClick.x >665 && toaDoClick.x <710 && toaDoClick.y > 600 && toaDoClick.y < 645) {
        pauseIngameMusic();
    }
    if (toaDoClick.x >560 && toaDoClick.x <650 && toaDoClick.y > 600 && toaDoClick.y < 645) {
        alert('Chơi tiếp đi, không thích chơi cũng phải chơi');
    }
    return startAGame;
}