import React, {Component} from 'react';
import './App.css';
import web3 from './web3';
import lottery from './lottery';


class App extends Component {
  state = { 
    manager: '',
    players: [],
    balance: '',
    value: '',
    message: ''
  };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players, balance });
  };

  onSubmit = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();

    this.setState({message: 'Waiting on transaction success...'});

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });

    this.setState({message: 'You have been entered!'});
  };

  render() {
    return (
      <div className="App">
        <div className="container">
          <h1>Lottery Contract!</h1>
          <p>This contract is managed by {this.state.manager}</p>
          <p>There are currently {this.state.players.length} people entered, competing to win <span className='etherbalance'>{web3.utils.fromWei(this.state.balance, 'ether')} ether!</span></p>
          <hr/>

          <form onSubmit={this.onSubmit}>
            <h4>Want to try your luck?</h4>
            <div>
              <label>Amount of ether to enter</label>
              <input 
                value={this.state.value}
                onChange={event => this.setState({value: event.target.value})}
              />
            </div>
            <button>Enter</button>

            <hr/>

            <h2>{this.state.message}</h2>
          </form>     
        </div>
      </div>
    );
  };
};

export default App;
