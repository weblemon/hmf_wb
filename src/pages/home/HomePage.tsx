import React, { Component } from 'react'

type IHomePageProp = {}

type IHomePageState = Readonly<{}>

class HomePage extends Component<IHomePageProp, IHomePageState> {

    readonly state: IHomePageState = {}

    render() {
        return (
            <div>
                Home
            </div>
        )
    }

}

export default HomePage