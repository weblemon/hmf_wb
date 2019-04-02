import React, { Component } from 'react'
import { Location, History } from 'history';

type Prop = {
    history: History;
    location: Location;
}

type State = Readonly<{}>

class NotFound extends Component<Prop, State> {

    readonly state: State = {}

    render() {
        return (
            <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#444',
                fontSize: 14
            }}>
                <h3 style={{
                    fontSize: 60,
                    color: '#eee',
                    textAlign: 'center',
                    paddingTop:30,
		            fontWeight:'normal'
                }}>404，您请求的文件不存在!</h3>
            </div>
        )
    }

    componentDidMount() {
        setTimeout(() => {
            this.props.history.goBack()
        }, 2000);
    }

}

export default NotFound