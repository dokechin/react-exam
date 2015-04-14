/** @jsx React.DOM */

var Ending = React.createClass({
  componentDidMount: function() {
    window.addEventListener("keydown", this.handlekeyDown, false);
  },
  handlekeyDown: function(e){
    e.preventDefault();
    if (e.keyCode == 32){
      this.props.onGameStateChange(0);
    }
  },
  render: function() {
    return (
      <g>
        <text x="50" y="160">GAME OVER</text>
        <text x="50" y="180">SCORE:</text>
        <text x="50" y="200">{this.props.score}</text>
        <text x="50" y="220">PUSH SPACE KEY</text>
      </g>);
  }
});

var Opening = React.createClass({
  componentDidMount: function() {
    window.addEventListener("keydown", this.handlekeyDown, false);
  },
  handlekeyDown: function(e){
    e.preventDefault();
    if (e.keyCode == 32){
      this.props.onGameStateChange(1);
    }
  },
  render: function() {
    return (
      <g>
        <text x="50" y="200">HIGH SPEED ROAD</text>
        <text x="50" y="250">PUSH SPACE KEY</text>
      </g>);
  }
});

var Score = React.createClass({
    render: function() {
        return (
        <g>
          <text x="10" y={this.props.height + 10}>{this.props.score}</text>
        </g>);
    }
});

var Rectangle = React.createClass({
    render: function() {
        return (
        <rect {...this.props}></rect>);
    }
});

var RoadFragment = React.createClass({
    render: function() {
        var x = this.props.x + this.props.span;
        var width = this.props.width-this.props.x-this.props.span;
        return (
          <g>
            <Rectangle x="0" y={this.props.y} width={this.props.x} height="10" fill="#112233"></Rectangle>
            <Rectangle x={x} y={this.props.y} width={width}        height="10" fill="#112233"></Rectangle>
          </g>
        );

    }
});

var Car = React.createClass({
    render: function() {
        return (
          <g>
            <Rectangle x={this.props.x} y={this.props.y} width="10" height="10" fill="#88ff33"></Rectangle>
          </g>
        );

    }
});

var SVGComponent = React.createClass({
  getInitialState: function() {
    return {score: 0, game_state: 0};
  },
  handleScoreUp: function(){
    var score = this.state.score + 1;
    this.setState({score : score});
  },
  handleGameStateChange: function(gs){
    if (gs == 1){
      this.setState({score : 0});
    }
    this.setState({game_state : gs});
  },
  render: function() {
    if (this.state.game_state == 0 ){
      return (
        <svg {...this.props} >
          <Opening onGameStateChange={this.handleGameStateChange} />
        </svg>
      );
    }
    else if (this.state.game_state == 2 ){
      return (
        <svg {...this.props} >
          <Ending score={this.state.score} onGameStateChange={this.handleGameStateChange} />
         </svg>
      );
    }
    else {
      return (
         <svg {...this.props} >
           <Main score={this.state.score} width={this.props.width} height={this.props.height-10} onGameStateChange={this.handleGameStateChange} onScoreUp={this.handleScoreUp}/>
           <Score score={this.state.score} width={this.props.width} height={this.props.height-10} />
         </svg>
      );
    }
  }
});

var Main = React.createClass({
  getInitialState: function() {
    return {road_fragments: []};
  },
  componentDidMount: function() {
    var initial_span = 150;
    var initial_x = this.props.width/2 - initial_span /2;
    var road_fragments = [];
    for (var i=0;i<this.props.height/10;i++){
      road_fragments.push({x:initial_x, y : i*10, span: initial_span, fill: "#12ff33"});
    }
    this.setState({road_fragments: road_fragments, span: initial_span, position: initial_x, car_x: (initial_x + initial_span /2) , key_left: 0, key_right: 0});
    this.interval = setInterval(this.tick, 20);
    window.addEventListener("keydown", this.handlekeyDown, false);
    window.addEventListener("keyup", this.handlekeyUp, false);
  },
  handlekeyDown: function(e){
    e.preventDefault();
    if (e.keyCode == 37){
      this.setState( {key_left: 1});
    }
    if (e.keyCode == 39){
      this.setState( {key_right: 1});
    }
  },
  handlekeyUp: function(e){
    e.preventDefault();
    if (e.keyCode == 37){
      this.setState( {key_left: 0});
    }
    if (e.keyCode == 39){
      this.setState( {key_right: 0});
    }
  },
  tick: function() {

    var that = this;

    var x = this.state.car_x;
    
    if (this.state.key_left == 1){
      x = x - 5;
    }
    if (this.state.key_right == 1){
      x = x + 5;
    }
    this.setState( { car_x: x});

    var road_fragments = [];
    for(var i=0;i<this.state.road_fragments.length;i++){
      var work = this.state.road_fragments[i];
      work.y = work.y + 10;
      if (work.y < (this.props.height) ){
        road_fragments.push(work);
      }
      else{
        if (x < work.x || x > (work.x + work.span)){
          this.props.onGameStateChange(2);
        }
      }
    }

    var next_position = this.state.position + Math.floor( Math.random() * 20 ) - 10;
    if(next_position < 0){
      next_position = 0;
    }
    if(next_position > (this.props.width - this.state.span)){
      next_posion = this.props.width - this.state.span;
    }

    road_fragments.push({x: next_position , y: 0, span: this.state.span, fill: "#12ff33"});
    this.setState({road_fragments: road_fragments, position: next_position});

    this.props.onScoreUp();

   if (this.props.score % 20 == 0) {
      var span = this.state.span;
      this.setState({span : (span -5 > 15)? span-4 : 15});
   }

  },
  componentWillUnmount: function() {
    clearInterval(this.interval);
  },
  render: function() {
    var that = this;
    var road_fragments = this.state.road_fragments.map(function(work) {
      return (
        <RoadFragment 
          x={work['x']} 
          y={work['y']}
          width={that.props.width}
          span={work['span']}
          fill={work['fill']}>
        </RoadFragment>
      );
    });
    return (
      <g>
        {road_fragments}
        <Car x={this.state.car_x} y={this.props.height-10}></Car>
      </g>
    );
  }
});


React.renderComponent(<SVGComponent width="320" height="280"></SVGComponent>,
 document.getElementById('content'));