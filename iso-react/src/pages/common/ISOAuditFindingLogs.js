import React from 'react'
import Apiservice from '../../api/Apiservice'
import { DataTable } from 'primereact/datatable';
import { Column } from "primereact/column";
import moment from 'moment';
import CommonFuctions from "../CommonFunctions/CommonFunctions";

export default class ISOAuditFindingLogs extends React.Component {

    constructor(props) {
        super(props)
        this.state = {

            auditId: sessionStorage.getItem('auditId'),
            plantCode: sessionStorage.getItem('plantCode'),
            findingNumber: sessionStorage.getItem('findingNumber'),

            auditFindingLogs: []

        }

        this.onIndexTemplate = this.onIndexTemplate.bind(this)
        this.formatDate = this.formatDate.bind(this)
        this.logDateTemplate = this.logDateTemplate.bind(this);

    }

    onIndexTemplate(data, props) {
        return props.rowIndex + 1
    }

    formatDate(value) {
        if (value)
            return moment(value).format("DD-MM-YYYY hh:mm");

        return "";
    }

    logDateTemplate(rowData) {
        return this.formatDate(rowData['created_date']);
    }

    componentDidMount = async () => {

        Apiservice.getISOAuditFindingLogsList(this.state.auditId, this.state.plantCode, this.state.findingNumber).then(
            (ress) => {

                this.setState({
                    auditFindingLogs: ress.data
                })


            }
        )

    }


    render() {
        return (
            <React.Fragment>
                <div className="datatable-filter-demo">
                    <DataTable value={this.state.auditFindingLogs} header="ISO Audit Finding Logs"
                        removableSort
                        emptyMessage="No Data Found" className="p-datatable-sm p-shadow-2 p-mb-2"
                        showGridlines rows={20} rowsPerPageOptions={[5, 10, 20, 50]} paginator >
                        <Column field="Index" header="Sno" body={this.onIndexTemplate} style={{ width: '3%' }} />
                        <Column field="username" header="UserName"
                            sortable filter filterPlaceholder="Search" filterMatchMode="contains" />
                        <Column field="created_date" body={this.logDateTemplate} header="Date"
                            sortable filter filterPlaceholder="Search" filterMatchMode="contains" />
                        <Column field="description" header="Description"
                            sortable filter filterPlaceholder="Search" filterMatchMode="contains" />
                        <Column field="remarks" header="Remarks"
                            sortable filter filterPlaceholder="Search" filterMatchMode="contains" />
                    </DataTable>
                </div>

            </React.Fragment>
        )
    }
}