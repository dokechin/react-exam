/** @jsx React.DOM */
var MyForm =  React.createClass({
  getInitialState: function() {
    return {helloTo: "Hello World"};
  },
  handleChange: function (event){
    this.setState({
      helloTo: event.target.value
    });
  },
  submitHandler: function (event) {
    event.preventDefault();
    alert( this.state.helloTo);
  },
  render: function() {
    return <form onSubmit={this.submitHandler}>
      <input
        type="text"
        value={this.state.helloTo}
        onChange={this.handleChange} />
      <br />
      <button type="submit">送信</button>
    </form>;
  }
});

React.renderComponent(<MyForm name="React-Exam" />, document.getElementById('content'));