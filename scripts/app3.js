/** @jsx React.DOM */

var Rectangle = React.createClass({
    render: function() {
        return <rect {...this.props} ></rect>;
    }
});

var SVGComponent = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.setState({data: [
      {height: 30, width: 30, x: 20 , y: 30, fill: "#12ff33"},
      {height: 30, width: 30, x: 10 , y: 20, fill: "#893388"},
      {height: 30, width: 30, x: 30 , y: 40, fill: "#a0e3a3"}
    ]});
    this.interval = setInterval(this.tick, 100);
  },
  tick: function() {
    var that = this;
    var data = this.state.data.map(function(work){
      work.y = work.y + Math.floor( Math.random() * 10 ) - 5;
      work.x = work.x + Math.floor( Math.random() * 10 ) - 5;
      if (work.x < 0) {
        work.x = 0;
      }
      if (work.y < 0) {
        work.y = 0;
      }
      if (work.y > that.props.width) {
        work.y = that.props.width;
      }
      if (work.x > that.props.height) {
        work.x = that.props.height;
      }
      return work;
    });
    this.setState({data:data});
  },
  componentWillUnmount: function() {
    clearInterval(this.interval);
  },
  render: function() {
    var work = this.state.data.map(function(work) {
      return (
        <Rectangle 
          height={work['height']} 
          width={work['width']}
          x={work['x']}
          y={work['y']}
          fill={work['fill']}>
        </Rectangle>
      );
    });
    return (
      <svg {...this.props}>
          {work}
      </svg>
    );
  }
});

React.renderComponent(<SVGComponent width="200" height="200"></SVGComponent>,
 document.getElementById('content'));