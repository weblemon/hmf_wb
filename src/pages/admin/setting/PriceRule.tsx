import React, { FormEvent, PureComponent } from 'react'
import '../common.less';
import { Breadcrumb, Form, Input, Button, Icon, Tooltip, Modal, notification, message, InputNumber } from 'antd';
import {Link, RouteComponentProps} from 'react-router-dom';
import http from '../../../utils/http';
import {FormComponentProps } from 'antd/lib/form/Form';

class PriceRule extends PureComponent<Props, State> {
    public readonly state: State = {
        result: {
            probation: 10,
            probationNum: 10,
            rule: [
                {
                    min: 0,
                    max: 0,
                    tag: 0
                }
            ]
        }
    };
    public render() {
        const { result } = this.state;
        const { getFieldDecorator } = this.props.form;
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
                    <div className="tools">
                        <Button type="primary" onClick={this.addRule.bind(this)}><Icon type="plus" /> 添加收费规则</Button>
                    </div>
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
    public componentWillMount() {
        http.get('rule/queryRule').then((res) => {
            const { data, success } = res.data;
            if (data && data.rule) {
                if (!data.rule) {}
                data.rule = JSON.parse(data.rule.replace(/\\/g, ""));
                if (success) {
                    this.setState({
                        result: data
                    })
                }
            }
        })
    }
    private addRule() {
        this.state.result.rule.push({
            min: '',
            max: '',
            tag: ''
        });
        this.setState({
            result: {
                ...this.state.result
            }
        })
    }
    private renderRule(rules: Rule[]) {
        const { getFieldDecorator } = this.props.form;
        if (Array.isArray(rules)) {
            return rules.map((item, index) => {
                return (
                    <Form.Item
                        label={`规则${index + 1}`}
                        key={index}
                    >
                    <Input.Group compact>
                        <Input style={{width: 40}} disabled placeholder="从" />
                        <InputNumber
                            // step={0.01}
                            value={item.min as number}
                            onChange={(e) => {
                                rules[index].min = e as number
                                this.setState({
                                    result: {
                                        ...this.state.result,
                                        rule: rules
                                    }
                                })
                            }}
                        />
                        <Input style={{width: 40}} disabled placeholder="至" />
                        <InputNumber
                            // step={0.01}
                            value={item.max as number}
                            onChange={(e) => {
                                rules[index].max = e as number
                                this.setState({
                                    result: {
                                        ...this.state.result,
                                        rule: rules
                                    }
                                })
                            }}
                        />
                        <Input style={{width: 40}} disabled placeholder="条" />
                        <InputNumber
                            step={0.01}
                            value={item.tag as number}
                            onChange={(e) => {
                                rules[index].tag = e as number
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
    private validateData(result: Rules) {}
    private submitForm(e: FormEvent) {
        e.preventDefault();
        this.props.form.validateFields((e, v) => {
            if (!e) {
                this.state.result.rule.map(item => {
                    if (!item.max) delete item.max;
                    if (!item.min) delete item.min;
                    if (!item.tag) delete item.tag;
                });
                const data = {
                    rule: JSON.stringify(this.state.result.rule).replace(/\"/g, '\\"'),
                    ...v
                };
                http.post('/rule/save', data).then(({data}) => {
                    const { success } = data
                    if (success) {
                        notification.success({
                            message: '成功',
                            description: '规则保存成功'
                        });
                        message.success('规则保存成功');
                    } else {
                        notification.error({
                            message: '失败',
                            description: '规则保存失败，请重试'
                        });
                        message.success('规则保存失败，请重试');
                    }
                })    
            }
        })

    }
}
export default Form.create({ name: 'priceRule'})(PriceRule)

interface OwnProps {}
type Props = OwnProps & FormComponentProps & RouteComponentProps;
type State = Readonly<{
    result: Rules;
}>
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