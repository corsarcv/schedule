import { Component } from "react"; 

export class Section extends Component{

    render () {
        return <div className="section">
            {this.props.title ? (<h2>{this.props.title}</h2>) : ''}
            {this.props.children}
        </div>
    }
}