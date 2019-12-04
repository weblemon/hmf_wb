import React, { Component } from 'react'
import {RouteComponentProps} from "react-router";

class NotFound extends Component<Prop, State> {
    public readonly state: State = {};
    public render() {
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
    public componentDidMount() {
        setTimeout(() => {
            this.props.history.goBack()
        }, 2000);
    }
}

export default NotFound

type Prop = OwnProps & RouteComponentProps;
interface OwnProps {}
type State = Readonly<{}>