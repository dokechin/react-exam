/** @jsx React.DOM */
var PLAYING = 1;
var YOU_WIN = 2;
var COM_WIN = 3;
var DRAWN = 4;

var initial_board = {
    a1:null,a2:null,a3:null,
    b1:null,b2:null,b3:null,
    c1:null,c2:null,c3:null
};

var computer = [ "b2","a1","a3","c1","c3","a2","b1","b3","c2"];

var bingo = [
  ["a1","a2","a3"],["b1","b2","b3"],["c1","c2","c3"],
  ["a1","b1","c1"],["a2","b2","c2"],["a3","b3","c3"],
  ["a1","b2","c3"],["a3","b2","c1"]
];

function copy_board(board){
  var copy = {};
  copy["a1"] = board["a1"];
  copy["a2"] = board["a2"];
  copy["a3"] = board["a3"];
  copy["b1"] = board["b1"];
  copy["b2"] = board["b2"];
  copy["b3"] = board["b3"];
  copy["c1"] = board["c1"];
  copy["c2"] = board["c2"];
  copy["c3"] = board["c3"];
  return copy;
}

function used_spaces(board){
    return Object.keys(board).filter(function(key){
        return board[key] !== null
    });
}

function judge(board){
    for (var i=0;i<8;i++){
        var you = 0;
        var com = 0;
        for(var j=0;j<3;j++){
            if (board[bingo[i][j]] == "○") {
                you = you + 1;
            }
            if (board[bingo[i][j]] == "×") {
                com = com + 1;
            }
        }
        if (you==3) {
            return YOU_WIN;
        }
        if (com==3) {
            return COM_WIN;
        }
    }
    if (used_spaces(board).length == 9){
        return DRAWN;
    }
    return PLAYING;
}

var GameBoard = React.createClass({
    getInitialState: function(){
        return {board : initial_board, status : PLAYING};
    },
    componentDidMount:function(){
        window.addEventListener("keydown", this.keyHandler, false);
    },
    newGame:function(){
        this.setState(this.getInitialState());
    },
    handlePut:function(key){
        if (this.state.status == PLAYING){
          var board = copy_board(this.state.board);
          board[key] = "○";
          var status = judge(board)
          if ( status != PLAYING){
            this.setState({board: board, status : status});
            return;
          }
          for(var i=0;i<9;i++){
            if (board[computer[i]] == null){
              board[computer[i]] = "×";
              break;
            }
          }
          var status = judge(board)
          this.setState({board: board, status: status});
        }
    },
    render:function(){
        return <div className="app">
            <span className="score">
                Status: {(this.state.status == YOU_WIN)? "You Win" : 
                         (this.state.status == COM_WIN)? "Com Win" : 
                         (this.state.status == DRAWN)?   "DRAWN"   : ""
                        }
            </span>
            <Tiles board={this.state.board} handlePut={this.handlePut}/>
            <button onClick={this.newGame}>New Game</button>
        </div>
    }
});

var Tiles = React.createClass({
    handle:function(key){
        this.props.handlePut(key);
    },
    render: function(){
        var that = this;
        var board = this.props.board;
        //sort board keys first to stop re-ordering of DOM elements
        return <div className="board">{
            Object.keys(board).map(function(myKey){
                var val = board[myKey];
                return <Tile key={myKey} onClick={that.handle} className={myKey + " value" + val} name={val}></Tile>;
        })}</div>
    }
});

var Tile = React.createClass({
    click:function(){
      this.props.onClick(this.props.key);
    },
    render: function(){
        return <span key={this.props.key} onClick={this.click} className={this.props.className}>{this.props.name}</span>
    }
});

React.renderComponent(<GameBoard />,
 document.getElementById('content'));
