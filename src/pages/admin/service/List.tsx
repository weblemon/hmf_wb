import React, { Component } from 'react'
import { Breadcrumb, Button, Table, Modal, Form, Input, notification, Switch } from 'antd';
import { Link } from 'react-router-dom';
import { ColumnProps } from 'antd/lib/table';
import {FormComponentProps} from 'antd/lib/form/Form';
import { isMobilePhone, isURL } from 'validator';
import http from '../../../utils/http';
import { AxiosResponse } from 'axios';

class ServiceList extends Component<Props, State> {
    public readonly state: State = {
        size: 10,
        total: 0,
        current: 1,
        loading: false,
        modalTitle: null,
        changeStateLoading: null
    };
    public componentWillMount() {
        this.getServiceList();
    }
    public render() {
        const columns: ColumnProps<Record>[] = [
            {
                title: 'ID',
                width: 150,
                dataIndex: 'id',
                fixed: 'left',
            },
            {
                title: '标题',
                align: 'center',
                width: 300,
                dataIndex: 'title',
            },
            {
                title: '描述',
                align: 'center',
                width: 500,
                dataIndex: 'content',
            },
            {
                title: '链接地址',
                align: 'center',
                width: 500,
                dataIndex: 'surl',
            },
            {
                title: '电话',
                align: 'center',
                width: 300,
                dataIndex: 'phone',
            },
            {
                title: '操作',
                align: 'center',
                width: 150,
                render: (item: any, data: Record, index: number) => {
                    return (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Switch
                                defaultChecked={item.state === 0}
                                style={{marginRight: 20}}
                                loading={this.state.changeStateLoading === index}
                                onChange={(e) => {
                                    this.setState({
                                        changeStateLoading: index
                                    });
                                    const data = JSON.parse(JSON.stringify(item));
                                    data.state = e ? 0 : 1;
                                    http.post('/adsever/save', data).then((res: AxiosResponse<ResponseData<Datum>>) => {
                                        if (res.data.success) {
                                            notification.success({
                                                message: '提示',
                                                description: e ? '已启用' : '已停用'
                                            });
                                            this.getServiceList()
                                        } else {
                                            notification.error({
                                                message: '提示',
                                                description: res.data.message
                                            })
                                        }
                                        this.setState({
                                            changeStateLoading: null
                                        })
                                    })
                                }}
                            />
                            <Button
                                type="primary"
                                size="small"
                                onClick={() => {
                                    this.setState({
                                        modalTitle: '修改服务',
                                        editData: item
                                    });
                                    this.props.form.setFieldsValue({
                                        title: item.title,
                                        content: item.content,
                                        'surl': item.surl,
                                        phone: item.phone
                                    })
                                }}
                            >编辑</Button>
                        </div>
                    )
                }
            }
        ];
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="admin-child-page">
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item>
                        <Link to={'/admin/'}>首页</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>服务管理</Breadcrumb.Item>
                </Breadcrumb>
                <div className="content">
                    {/* <div className="pager">
                        <Button type="primary" onClick={() => {
                            this.setState({
                                modalTitle: '新增服务'
                            })
                        }}>新增服务</Button>
                        <Pagination
                            pageSizeOptions={['5', '10']}
                            pageSize={this.state.size}
                            total={this.state.total}
                            current={this.state.current}
                            size="small"
                            showTotal={(t) => `总共${t}条`}
                            showSizeChanger
                            showQuickJumper
                            onShowSizeChange={(current, size) => {
                                this.setState({current, size}, () => {
                                    // this.getHouseList()
                                })
                            }}
                            onChange={(current) => {
                                this.setState({current}, () => {
                                    // this.getHouseList()
                                })
                            }}
                        />
                    </div> */}

                    <Table
                        bordered
                        className="data"
                        size="small"
                        columns={columns}
                        rowKey="id"
                        dataSource={this.state.records}
                        pagination={false}
                        loading={this.state.loading}
                    >

                    </Table>

                    {/* <div className="pager">
                        <div></div>
                        <Pagination
                            pageSizeOptions={['5', '10']}
                            pageSize={this.state.size}
                            total={this.state.total}
                            current={this.state.current}
                            size="small"
                            showTotal={(t) => `总共${t}条`}
                            showSizeChanger
                            showQuickJumper
                            onShowSizeChange={(current, size) => {
                                this.setState({current, size}, () => {
                                    // this.getHouseList()
                                })
                            }}
                            onChange={(current) => {
                                this.setState({current}, () => {
                                    // this.getHouseList()
                                })
                            }}
                        />
                    </div> */}
                </div>
                <Modal
                    title={this.state.modalTitle}
                    visible={Boolean(this.state.modalTitle)}
                    maskClosable={false}
                    onOk={() => {
                        this.saveService();
                    }}
                    onCancel={() => {
                        this.props.form.resetFields();
                        this.setState({
                            modalTitle: null
                        })
                    }}
                >
                    <Form>
                        <Form.Item
                            label="标题"
                        >
                            {
                                getFieldDecorator('title', {
                                    rules: [
                                        {
                                            max: 8,
                                            min: 2,
                                            message: '长度必须2-8位'
                                        },
                                        {
                                            required: true,
                                            message: '标题必须'
                                        }
                                    ]
                                })(
                                    <Input autoComplete="off" placeholder="请输入标题" />
                                )
                            }

                        </Form.Item>

                        <Form.Item
                            label="内容"
                        >
                            {
                                getFieldDecorator('content', {
                                    rules: [
                                        {
                                            max: 25,
                                            min: 1,
                                            message: '服务内容,内容长度必须1-25位'
                                        },
                                        {
                                            required: true,
                                            message: '服务内容,内容必须'
                                        }
                                    ]
                                })(
                                    <Input placeholder="请输入服务内容" />
                                )
                            }

                        </Form.Item>

                        <Form.Item
                            label="电话"
                        >
                            {
                                getFieldDecorator('phone', {
                                    rules: [
                                        {
                                            validator: (rule, value: any, callback: any) => {
                                                if (!value) return callback();
                                                if (isMobilePhone(value, 'zh-CN')) {
                                                    callback()
                                                } else {
                                                    callback(false);
                                                }
                                            },
                                            message: '电话号码格式不正确'
                                        },
                                        {
                                            required: true,
                                            message: '电话号码必须'
                                        }
                                    ]
                                })(
                                    <Input placeholder="请输入电话号码" />
                                )
                            }

                        </Form.Item>

                        <Form.Item
                            label="链接地址"
                        >
                            {
                                getFieldDecorator('surl', {
                                    rules: [
                                        {
                                            validator: (rule, value: any, callback: any) => {
                                                if (!value) return callback();
                                                if (isURL(value)) {
                                                    callback()
                                                } else {
                                                    callback(false);
                                                }
                                            },
                                            message: '链接地址格式不正确'
                                        }
                                    ]
                                })(
                                    <Input placeholder="请输入链接地址，可选" />
                                )
                            }
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
    private getServiceList() {
        const { size, current } = this.state;
        this.setState({
            loading: true
        });
        http.get('/adsever/queryAdPage', {
           params: {
               size,
               order: 'desc',
               current
           }
        }).then((res: AxiosResponse<ResponseData<Datum>>) => {
            const { success, data, message } =  res.data;
            if (success) {
                const { records, current, total, pages } = data;
                this.setState({
                    records,
                    current,
                    total,
                    pages,
                    loading: false
                })
            } else {
                notification.error({
                    message: '错误',
                    description: message
                })
            }
            
        }).catch(() => {
            this.setState({
                loading: false
            })
        })
    }
    private saveService() {
        this.props.form.validateFields((e, v) => {
            if (!e) {
                if (this.state.modalTitle === '修改服务' && this.state.editData) {
                    v = {
                        id: this.state.editData.id,
                        ...v
                    }
                }
                http.post('/adsever/save', {
                    ...v
                }).then((res: AxiosResponse<ResponseData<Data>>) => {
                    const { success, message } = res.data;
                    if (success) {
                        this.getServiceList();
                        this.props.form.resetFields();
                        this.setState({
                            modalTitle: null
                        });
                        notification.success({
                            message: '提示',
                            description:'修改成功'
                        })
                    } else {
                        notification.error({
                            message: '提示',
                            description: message
                        })
                    }
                })
            }
        })
    }
}
export default Form.create({
    name: 'service'
})(ServiceList as any)

type Props = OwnProps & FormComponentProps;
type State = Readonly<{
    size: number;
    total: number;
    current: number;
    records?: Record[];
    pages?: number;
    loading: boolean;
    modalTitle: null | '新增服务' | '修改服务';
    editData?: Data;
    changeStateLoading: number | null;
}>
interface OwnProps {}
interface ResponseData<T> {
  success: boolean;
  code: string;
  message?: any;
  draw: number;
  data: T;
}
interface Data {
  id: number;
  deleted: boolean;
  rawAddTime: string;
  rawUpdateTime?: any;
  title: string;
  content: string;
  phone: string;
  type?: any;
  state: number;
  surl?: any;
}
interface Datum {
  total: number;
  size: number;
  pages: number;
  current: number;
  records: Record[];
}
interface Record {
  id: number;
  deleted: boolean;
  rawAddTime: string;
  rawUpdateTime?: any;
  title: string;
  content: string;
  phone: string;
  type?: number;
  state: number;
  surl?: string;
}