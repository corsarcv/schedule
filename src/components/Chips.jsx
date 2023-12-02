import { Component } from "react"; 
import css from './Chips.module.css'

import avatarM from '../images/img_avatar.png'
import avatarF from '../images/img_avatar2.png'


export class Chips extends Component{
 
    render () {
        return <div className={css.chips} >
            {this.props.users.map(user=>(
                <div className={[css.chip, this.props.selectedUser == user.id ? css.selected: ''].join(' ')} 
                key={user.id} data-key={user.id} onClick={this.props.clickHandler}>
                    <img src={user.sex == 'M'? avatarM: avatarF} alt="Person" width="96" height="96" />
                    {user.name}
                </div>
                ))
            }

        </div>
    }
}