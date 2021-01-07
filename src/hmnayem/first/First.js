import React, {Component} from 'react';

class First extends Component {

    render() {
        return (
            <div>
                <h1>Name : {this.props.name}</h1>
                <h3>Email : {this.props.email}</h3>
                <h5>Address : {this.props.address}</h5>
            </div>
        )
    }
}

export default First;