import React, { FormEvent, Component } from 'react'
import '../common.less';
import { Breadcrumb, Form, Input, Button, Icon, Tooltip, Modal, notification, message } from 'antd';
import { Link } from 'react-router-dom';
import http from '../../../utils/http';
import { WrappedFormUtils } from 'antd/lib/form/Form';

type Prop = {
    form: WrappedFormUtils;
    location: Location;
    history: History;
}

type State = Readonly<{
    result: Rules;
}>

class PriceRule extends Component<Prop, State> {

    readonly state: State = {
        result: {
            probation: 10,
            probationNum: 10,
            rule: []
        }
    }

    componentWillMount() {
        http.get('rule/queryRule').then((res) => {
            const { data, success } = res.data
            if (data && data.rule) {
                data.rule = JSON.parse(data.rule.replace(/\\/g, ""))
                if (success) {
                    this.setState({
                        result: data
                    })
                }
            }
        })
    }

    public addRule() {
        this.state.result.rule.push({
            min: '',
            max: '',
            tag: ''
        })
        this.setState({
            result: {
                ...this.state.result
            }
        })
    }

    renderRule(rules: Rule[]) {
        const { getFieldDecorator } = this.props.form
        if (Array.isArray(rules)) {
            return rules.map((item, index) => {
                return (
                    <Form.Item
                        label={`规则${index + 1}`}
                        key={index}
                    >
                    <Input.Group compact>
                        <Input style={{width: 40}} disabled placeholder="从" />
                        <Input
                            onInput={(e: any) => { 
                                rules[index].min = e.target.value
                                this.setState({
                                    result: {
                                        ...this.state.result,
                                        rule: rules
                                    }
                                })
                            }}
                            maxLength={10}
                            type="number"
                            style={{width: 100}}
                            defaultValue={item.min as string}
                        />
                        <Input style={{width: 40}} disabled placeholder="至" />
                        <Input
                            maxLength={10}
                            type="number"
                            style={{width: 100}}
                            defaultValue={item.max as string}
                            placeholder="留空不限"
                            onInput={(e: any) => { 
                                rules[index].max = e.target.value
                                this.setState({
                                    result: {
                                        ...this.state.result,
                                        rule: rules
                                    }
                                })
                            }}
                        />
                        <Input style={{width: 40}} disabled placeholder="条" />
                        <Input
                            maxLength={10}
                            type="number"
                            style={{width: 100}}
                            defaultValue={item.tag as string}
                            onInput={(e: any) => { 
                                rules[index].tag = e.target.value
                                this.setState({
                                    result: {
                                        ...this.state.result,
                                        rule: rules
                                    }
                                })
                            }}
                        />
                        <Input style={{width: 40}} disabled placeholder="元" />
                        <Tooltip
                            placement="topRight"
                            title="删除当前规则"
                        >
                            <Button
                                onClick={() => {
                                    Modal.confirm({
                                        title: '询问',
                                        content: `您正在删除收费规则${index},确认删除吗？`,
                                        onOk: () => {
                                            this.state.result.rule.splice(index, 1)
                                            this.setState({
                                                result: {
                                                    ...this.state.result
                                                }
                                            })
                                        }
                                    })
                                }}>
                                <Icon type="minus" />
                            </Button>
                        </Tooltip>
                        {
                            rules.length - 1 === index ? (
                                <Tooltip
                                    placement="rightTop"
                                    title="添加规则"
                                >
                                    <Button onClick={this.addRule.bind(this)}><Icon type="plus" /></Button>
                                </Tooltip>
                            ) : ''
                        }
                    </Input.Group>
                </Form.Item>
                )
            })
        }
        return '';
    }

    validateData(result: Rules) {
        
    }

    submitForm(e: FormEvent) {
        e.preventDefault();
        this.props.form.validateFields((e, v) => {
            if (!e) {
                this.state.result.rule.map(item => {
                    if (!item.max) delete item.max;
                    if (!item.min) delete item.min;
                    if (!item.tag) delete item.tag;
                })
                const data = {
                    rule: JSON.stringify(this.state.result.rule).replace(/\"/g, '\\"'),
                    ...v
                }
                http.post('/rule/save', data).then(({data}) => {
                    const { success } = data
                    if (success) {
                        notification.success({
                            message: '成功',
                            description: '规则保存成功'
                        })
                        message.success('规则保存成功');
                    } else {
                        notification.error({
                            message: '失败',
                            description: '规则保存失败，请重试'
                        })
                        message.success('规则保存失败，请重试');
                    }
                })    
            }
        })

    }

    render() {
        const { result } = this.state
        const { getFieldDecorator } = this.props.form
        return (
            <div className="admin-child-page">
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item>
                        <Link to={'/admin/'}>首页</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>系统管理</Breadcrumb.Item>
                    <Breadcrumb.Item>收费规则设置</Breadcrumb.Item>
                </Breadcrumb>
                <div className="content">
                    <Form 
                        className="form"
                        onSubmit={this.submitForm.bind(this)}
                    >
                        {this.renderRule(result.rule)}
                        <Form.Item
                            label="试用期"
                        >
                            {
                                getFieldDecorator('probation', {
                                    rules: [
                                        {
                                            required: true, message: '请输入试用期天数!',
                                        }
                                    ],
                                    initialValue: result.probation
                                })(
                                    <Input
                                        style={{
                                            width: 100
                                        }}
                                        maxLength={3}
                                        addonAfter="天"
                                    />
                                )
                            }
                        </Form.Item>
                        <Form.Item
                            label="试用期能发布的条数"
                        >
                            {
                                getFieldDecorator('probationNum', {
                                    rules: [
                                        {
                                            required: true, message: '请输入试用期能发布的条数!',
                                        }
                                    ],
                                    initialValue: result.probationNum
                                })(
                                    <Input
                                        style={{
                                            width: 100
                                        }}
                                        maxLength={3}
                                        addonAfter="条"
                                    />
                                )
                            }
                        </Form.Item>

                        <Form.Item>
                           <Button type="primary" htmlType="submit">保存</Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        )
    }

}

export default Form.create({
    name: 'priceRule'
})(PriceRule)

export interface Rules {
    // 规则
    rule: Rule[];
    // 试用期天数
    probation: number;
    // 试用期能发布的条数
    probationNum: number;
}

export interface Rule {
    min: number | string;
    max: number | string;
    tag: number | string;
}