import { Component } from "react";
import { Chips } from "./Chips";
import { Schedule } from "./Schedule";
import { Section } from "./Section";
import users from "../data/users.json"

export class App extends Component{
  
  state = {
    selectedUser: null
  };

  render(){
    return (
      <div>
        <Section>
           <Chips selectedUser={this.state.selectedUser} clickHandler={this.onUserClick} users={users} />
        </Section>
        <Section>
          {this.state.selectedUser 
            ? (<Schedule selectedUser={this.state.selectedUser} users={users} />) 
            : (<div><b>Select a user to begin</b></div>)
          }    
        </Section>
      </div>
    );
  }

  onUserClick = (event) => {
    this.setState({selectedUser: event.target.dataset.key});
  }
};
