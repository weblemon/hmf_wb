import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import "./UserList.less";
import {Breadcrumb, Button, Cascader, Form, Modal, notification, Pagination, Table} from "antd";
import {Link, RouteComponentProps} from "react-router-dom";
import {ColumnProps} from "antd/lib/table";
import {
    createRegistration, deleteRegistration,
    queryPageCode,
    QueryPageCodeInfo,
    QueryPageCodeParams
} from "../../../utils/apis/getPageCode";
import {qmap} from "../../../utils/http";
import {AxiosResponse} from "axios";
import {FormComponentProps} from "antd/lib/form";
import {formatTime} from "../../../utils/format";

class UserRuleList extends PureComponent<Props, State> {
    readonly state: State = {
        query: {
            current: 1,
            size: 10,
            order: "desc",
            type: 1,
        },
        districtOptions: [],
        total: 1,
        list: [],
    };
    public componentWillMount(): void {
        this.getList();
        this.getDistrictList('', (list) => {
            this.setState({
                districtOptions: list
            })
        });
    }
    public render() {
        const { modalTitle, modalConfirm } = this.state;
        const { getFieldDecorator } = this.props.form;
        const page = process.env.NODE_ENV === 'development' ? "pages/index/index" : "pages/home/index";
        getFieldDecorator("page", {initialValue: page});
        getFieldDecorator("userId", {initialValue: this.props.match.params.id});
        getFieldDecorator("scene", {initialValue: ``});
        getFieldDecorator("districtId", {initialValue: ""});
        return (
            <div className="admin-child-page">
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item>
                        <Link to={'/admin/'}>首页</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Link to={`/admin/user/${this.props.match.params.id}.html`}>推广员</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>地区授权</Breadcrumb.Item>
                </Breadcrumb>
                <div className="content">
                    <div className="top-bar">
                        <Button type="primary" onClick={() => this.setState({modalTitle: "添加授权"})}>添加授权</Button>
                    </div>
                    {this.renderTable()}
                </div>
                <Modal confirmLoading={modalConfirm} onOk={this.handleModalOk.bind(this)} onCancel={this.handleModalCancel.bind(this)} visible={modalTitle === "添加授权"} title={modalTitle}>
                    <Form>
                        <Form.Item>
                            {getFieldDecorator("districtName", {initialValue: [], rules: [{required: true, message: "必须选择地区"}]})(
                                <Cascader
                                    placeholder="选择地区"
                                    style={{width: 250}}
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
                                    onChange={(value, selectedOptions) => {
                                        if (selectedOptions) {
                                            if (!selectedOptions[selectedOptions.length - 1]) return;
                                            const districtId = selectedOptions[selectedOptions.length - 1].id;
                                            this.props.form.setFieldsValue({
                                                districtId,
                                                scene: `registration=${districtId}`
                                            });
                                        }
                                    }}
                                    changeOnSelect
                                />
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
    private handleModalCancel() {
        this.props.form.resetFields();
        this.setState({modalTitle: undefined});
    }
    private handleModalOk() {
        this.props.form.validateFields((e, v: any) => {
            if (!e) {
                this.setState({modalConfirm: true});
                v.districtName = v.districtName.join(",");
                createRegistration(v).then(res => {
                    if (res.data.success) {
                        notification.success({
                            message: "提示",
                            description: "添加成功"
                        });
                        this.getList();
                        this.props.form.resetFields();
                        return this.setState({
                            modalConfirm: false,
                            modalTitle: undefined,
                        })
                    }
                    this.setState({
                        modalConfirm: false,
                    })
                })
            }
        })
    }
    private renderTable() {
        const {  query, total, loading, list } = this.state;
        const columns: ColumnProps<QueryPageCodeInfo>[] = [
            {
                title: "#",
                align: "left",
                dataIndex: "id"
            },
            {
                title: "地区",
                align: "left",
                dataIndex: "districtName",
                render: (text) => text ? text.split(",").join(""): "",
            },
            {
                title: "访问码",
                align: "center",
                dataIndex: "registrationCode",
            },
            {
                title: "授权时间",
                align: "center",
                dataIndex: "rawAddTime",
                render: (text) => text ? formatTime(text): "",
            },
            {
                title: "操作",
                align:"center",
                width: 100,
                render: (record: QueryPageCodeInfo) => (
                    <span>
                        <Button type="danger" size="small" onClick={() => this.deleteRegistration(record.id)}>删除授权</Button>
                    </span>
                )
            }
        ];
        return (
            <div>
                <div className="pager">
                    <div></div>
                    <Pagination
                        onChange={(current) => {
                            this.setState({query: {...query, current}}, () => {
                                this.getList()
                            })
                        }}
                        size="small"
                        total={total}
                        showTotal={t => `总共${t}条`}
                        onShowSizeChange={(current, size) => {
                            this.setState({query: {
                                    ...query,
                                    current,
                                    size,
                                }}, () => {
                                this.getList()
                            })
                        }}
                        current={query.current}
                        showSizeChanger
                        pageSize={query.size}
                        showQuickJumper
                        pageSizeOptions={['5', '10']}
                    />
                </div>
                <Table
                    bordered
                    loading={loading}
                    pagination={false}
                    size="small"
                    columns={columns}
                    rowKey="id"
                    dataSource={list}
                />
                <div className="pager">
                    <div></div>
                    <Pagination
                        onChange={(current) => {
                            this.setState({query: {...query, current}}, () => {
                                this.getList()
                            })
                        }}
                        size="small"
                        total={total}
                        showTotal={t => `总共${t}条`}
                        onShowSizeChange={(current, size) => {
                            this.setState({query: {
                                    ...query,
                                    current,
                                    size,
                                }}, () => {
                                this.getList()
                            })
                        }}
                        current={query.current}
                        showSizeChanger
                        pageSize={query.size}
                        showQuickJumper
                        pageSizeOptions={['5', '10']}
                    />
                </div>
            </div>
        )
    }
    private async getList() {
        const { query } = this.state;
        const res = await queryPageCode({...query, userId: this.props.match.params.id});

        if (res.data.success) {
            const { records, current, size, total } = res.data.data;
            this.setState({
                list: records,
                total,
                query: {
                    ...this.state.query,
                    current,
                    size,
                }
            })
        }
    }
    /**
     * 获取行政地区
     */
    private getDistrictList(id: string = '', callback?: (results: Result[]) => void) {
        const params: any = {
            key: '7TCBZ-GIF6U-7OZVB-4QDKC-MHPZO-RZFJ7',
            output: 'json'
        };
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
    private async deleteRegistration(id: number) {
        const res =  await deleteRegistration(id);
        Modal.confirm({
           title: "警告",
           content: "您正在删除地区授权，是否继续？" ,
            onOk: async () => {
                const res =  await deleteRegistration(id);
                if (res.data.success) {
                    notification.success({
                        message: "提示",
                        description: "已取消授权"
                    });
                    this.getList();
                }
                return res;
            }
        });

    }
}

const mapStateToProps = (state: any) => {
    return {};
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(
    Form.create({name: "UserRuleListForm"})(UserRuleList)
);

interface OwnProps {
}

type Props =
    RouteComponentProps<{ id: string }>
    & FormComponentProps<{districtId: string; scene: string; page: string}>
    & OwnProps
    & ReturnType<typeof mapStateToProps>
    & typeof mapDispatchToProps;

type State = Readonly<{
    query: QueryPageCodeParams;
    districtOptions: Result[];
    loading?: boolean;
    total: number;
    list: QueryPageCodeInfo[];
    modalTitle?: "添加授权";
    modalConfirm?: boolean;
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