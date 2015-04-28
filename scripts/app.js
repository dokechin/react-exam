/** @jsx React.DOM */
var A =  React.createClass({
  render: function() {
    console.log("A render");
    return <div> {this.props.name}
    </div>
    ;
  }
});
var B =  React.createClass({
  render: function() {
    console.log("B render");
    return <div> {this.props.name}
    </div>
    ;
  }
});
var MyForm =  React.createClass({
  getInitialState: function() {
    return {helloToA: "Hello World",helloToB: "Hello React"};
  },
  handleChangeA: function (event){
    this.setState({
      helloToA: event.target.value
    });
  },
  handleChangeB: function (event){
    this.setState({
      helloToB: event.target.value
    });
  },
  submitHandler: function (event) {
    event.preventDefault();
    alert( this.state.helloToA + this.state.helloToB);
  },
  render: function() {
    return <form onSubmit={this.submitHandler}>
      <input
        type="text"
        value={this.state.helloToA}
        onChange={this.handleChangeA} />
      <br />
      <input
        type="text"
        value={this.state.helloToB}
        onChange={this.handleChangeB} />
      <br />
      <button type="submit">送信</button>
      <A name={this.state.helloToA}></A><B name={this.state.helloToB}></B>
    </form>
    ;
  }
});

React.renderComponent(<MyForm name="React-Exam" />, document.getElementById('content'));