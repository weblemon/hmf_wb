import React, {PureComponent, ReactElement} from 'react';
import { connect } from 'react-redux';
import {IStore} from "../../../store";
import {Breadcrumb, Button, Cascader, Col, Form, Input, Modal, notification, Select, Table} from "antd";
import {Link, RouteComponentProps} from "react-router-dom";
import {ColumnProps} from "antd/lib/table";
import {
    districtDelete,
    DistrictInfo,
    districtSave,
    getDistrictPage,
    QueryDistrictPageParams
} from "../../../utils/apis/district";
import {qmap} from "../../../utils/http";
import {AxiosResponse} from "axios";
import {FormComponentProps} from "antd/lib/form";

class LocaleRule extends PureComponent<Props, State> {
    public readonly state: State = {
        districtOptions: [],
        list: [],
        query: {
            currentPage: 1,
            pageSize: 10
        },
        pages: 1,
        total: 1,
        cascaderValue: [],
    };
    public componentWillMount(): void {
        this.getDistrictList('', (list) => {
            this.setState({
                districtOptions: list
            })
        });
        this.getList();
    }
    public render() {
        const { modalTitle, cascaderValue } = this.state;
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="admin-child-page">
                <Breadcrumb className="breadcrumb">
                <Breadcrumb.Item>
                     <Link to={'/admin/'}>首页</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>系统管理</Breadcrumb.Item>
                <Breadcrumb.Item>地区规则设置</Breadcrumb.Item>
                </Breadcrumb>
                <div className="content">
                  <div className="top-bar" >
                      <Button type="primary" onClick={() =>{ this.setState({modalTitle:'新增地区'}) }}>新增地区</Button>
                  </div>
                  {this.renderTable()}
                </div>
                <Modal
                    maskClosable={false}
                    title={modalTitle}
                    visible={modalTitle === '新增地区' || modalTitle === '修改地区'}
                    onOk={this.modalOk.bind(this)}
                    onCancel={this.modalCancel.bind(this)}
                >
                    <Form
                        labelCol={{span: 4}}
                        wrapperCol={{span: 20}}
                    >
                        <Form.Item
                            label="选择地区"
                        >
                            <Cascader
                                placeholder="选择地区"
                                style={{width: 250}}
                                value={cascaderValue}
                                loadData={(selectedOptions: any) => {
                                    const targetOption = selectedOptions[selectedOptions.length - 1];
                                    targetOption.loading = true;
                                    this.getDistrictList(targetOption.id, (list) => {
                                        if (list.length === 0) {
                                            targetOption.isLeaf = true
                                        } else {
                                            targetOption.children = list;
                                        }
                                        targetOption.loading = false;

                                        this.setState({
                                            districtOptions: [...this.state.districtOptions]
                                        });
                                    })
                                }}
                                options={this.state.districtOptions}
                                fieldNames={{label: 'fullname', value: 'fullname', children: 'children' }}
                                onChange={this.handleDistrictChange.bind(this)}
                                changeOnSelect
                                disabled={this.state.modalTitle === "修改地区"}
                            />
                        </Form.Item>

                        <Form.Item
                            label="地区名称"
                        >
                            {
                                getFieldDecorator('fullname', {
                                    rules: [{required: true, message: '请选择地区'}, { type: 'string', message: '必须为字符' }]
                                })(
                                    <Input placeholder="请输入地区名称"/>
                                )
                            }
                        </Form.Item>

                        <Form.Item
                            label="地区编号"
                        >
                            {
                                getFieldDecorator('id', {
                                    rules: [{required: true, message: '请输入地区编号'}, { type: 'number', message: '必须为数字' }]
                                })(
                                    <Input placeholder="地区id" />
                                )
                            }
                        </Form.Item>

                        <Form.Item
                            label="经度"
                        >
                            {
                                getFieldDecorator('lat', {
                                    rules: [{required: true, message: '请输入地区经度'}, { type: 'number', message: '必须为数字' }]
                                })(
                                    <Input placeholder="经度" />
                                )
                            }
                        </Form.Item>

                        <Form.Item
                            label="纬度"
                        >
                            {
                                getFieldDecorator('lng', {
                                    rules: [{required: true, message: '请输入地区纬度'}, { type: 'number', message: '必须为数字' }]
                                })(
                                    <Input placeholder="纬度" />
                                )
                            }
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
    /**
     * 渲染表格
     */
    private renderTable(): ReactElement {
        const columns: ColumnProps<DistrictInfo>[] = [
            {
                title:  '#',
                width: 120,
                dataIndex: 'id',
                align: 'left',
                fixed: "left",
            },
            {
                title: '地区名称',
                dataIndex: 'fullname',
                align: 'center'
            },
            {
                title: '添加时间',
                dataIndex: 'rawAddTime',
                align: 'center',
                render: (text) => {
                    if (text) {
                        return new Date(text).toLocaleString()
                    } else {
                        return null
                    }
                }
            },
            {
                title: '修改时间',
                dataIndex: 'rawUpdateTime',
                align: 'center',
                render: (text) => {
                    if (text) {
                        return new Date(text).toLocaleString()
                    } else {
                        return null
                    }
                }
            },
            {
                title: '操作',
                align: 'center',
                width: 200,
                render: (info: DistrictInfo) => (
                    <span>
                        <Button onClick={() => {
                            const { id, fullname, lat, lng } = info;
                            this.setState({
                                modalTitle: '修改地区'
                            });
                            this.props.form.setFieldsValue({
                                id, fullname, lat: Number(lat), lng: Number(lng)
                            })
                        }} type="primary" size="small">修改</Button>
                        <Button onClick={() => {
                            Modal.confirm({
                                title: '警告',
                                content: '您正在删除地区规则' + info.fullname + '，确认删除吗？',
                                onOk: () => {
                                    return this.deleteDistrict(info.id);

                                }
                            })
                        }} style={{marginLeft: 10}} type="danger" size="small">删除</Button>
                    </span>
                )
            }
        ];
        return (
            <Table
                rowKey="id"
                columns={columns}
                size="small"
                bordered
                dataSource={this.state.list}
                pagination={false}
            />
        )
    }
    /**
     * 获取行政地区
     */
    private getDistrictList(id: string = '', callback?: (results: Result[]) => void) {
        const params: any = {
            key: '7TCBZ-GIF6U-7OZVB-4QDKC-MHPZO-RZFJ7',
            output: 'json'
        }
        if (id) {
            params.id = id
        }
        qmap.get('/ws/district/v1/getchildren', {
            params
        }).then((res: AxiosResponse<DistrictList>) => {
            if (res.data.status === 0) {
                if (typeof callback === 'function') {
                    const data = res.data.result[0];
                    callback(data.map(item => {
                        item.isLeaf = item.name ? false : true;
                        return item;
                    }))
                }
            }
        })
    }
    /**
     * 处理地区变化
     */
    private handleDistrictChange(e: string[], selectedOptions: any) {
        this.setState({
            cascaderValue: e,
        });
        if (e.length === 0) return;
        const info = selectedOptions[selectedOptions.length - 1];
        this.props.form.setFieldsValue({
            id: Number(info.id),
            fullname: e.join('/'),
            lat: info.location.lat,
            lng: info.location.lng,
        });
    }
    /**
     * 模态框确认
     */
    private modalOk() {
        this.props.form.validateFields((e, v) => {
            if (!e) {
                districtSave(v).then(res => {
                    const { success, message } = res.data;
                    if (success) {
                        this.query();
                        this.setState({
                            modalTitle: undefined,
                            cascaderValue: [],
                        });
                        this.props.form.resetFields();
                        notification.success({
                            message: '提示',
                            description: '地区添加成功！'
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
    /**
     * 模态框取消
     */
    private modalCancel() {
        this.setState({
            modalTitle: undefined,
            cascaderValue: [],
        });
        this.props.form.resetFields();
    }
    /**
     * 获取数据列表
     */
    private async getList() {
        const result = await getDistrictPage(this.state.query);
        const { success, message, data } = result.data;
        if (success) {
            const { total, records, current, size } = data;
            this.setState({
                query: {
                    currentPage: current,
                    pageSize: size
                },
                total: total,
                list: records,
            })
        } else {
            notification.error({
                message: '提示',
                description: message,
            })
        }
    }
    /**
     * 删除地区
     * @param id
     */
    private deleteDistrict(id: number) {
       const respnse = districtDelete({id}).then(res => {
            const { success, message } = res.data;
            if (success) {
                notification.success({
                    message:'提示',
                    description: '删除成功！'
                });
                this.query();
            } else {
                notification.error({
                    message:'提示',
                    description: message
                })
            }
        });
        return respnse;
    }
    /**
     * 查询方法
     * @param params
     */
    private query(params?: QueryDistrictPageParams) {
        this.setState({
            query: {
                ...this.state.query,
                ...params
            }
        }, () => {
            this.getList();
        });
    }
}

const mapStateToProps = (state: IStore) => {
  return {

  };
};

const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(
    Form.create({ name: 'LocaleForm' })(LocaleRule)
);
interface OwnProps {}
type Props = OwnProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & RouteComponentProps & FormComponentProps;
type State = Readonly<{
    modalTitle?: '新增地区' | '修改地区';
    districtOptions: Result[];
    list: DistrictInfo[];
    query: QueryDistrictPageParams;
    pages: number;
    total: number;
    cascaderValue: any[];
}>;
interface DistrictList {
    status: number;
    message: string;
    data_version: string;
    result: Result[][];
}
interface Result {
    id: string;
    name: string;
    fullname: string;
    pinyin: string[];
    location: LocationPoistion;
    children: Result[];
    isLeaf: boolean;
}
interface LocationPoistion {
    lat: number;
    lng: number;
}
