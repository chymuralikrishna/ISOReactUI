import React from 'react'
import { Redirect } from 'react-router-dom';
import { Column } from "primereact/column";
import { DataTable } from 'primereact/datatable';
import Navigation from "../Navigation";
import Apiservice from "../../api/Apiservice";
import { Link } from 'react-router-dom';
import CommonFunctions from '../CommonFunctions/CommonFunctions';

export default class IsoAuditList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            loginEcNo: localStorage.getItem("ecNo"),
            isoauditDetails: []
        }

        this.onIndexTemplate = this.onIndexTemplate.bind(this)
        this.formatDate = this.formatDate.bind(this)
        this.auditDateTemplate = this.auditDateTemplate.bind(this)

    }

    formatDate(value) {
        if (value != null)
            return CommonFunctions.getDateInDDMMYYYYFormat(value);

        return "";
    }

    async componentDidMount() {
        Apiservice.getISOAuditDetailsListForManagingPlants(this.state.loginEcNo).then(
            (res) => {
                this.setState({
                    isoauditDetails: res.data
                })
            }
        )
    }

    onIndexTemplate(data, props) {
        return props.rowIndex + 1
    }

    auditDateTemplate(rowData) {
        return this.formatDate(rowData['audit_date']);
    }

    plantTemplate(rowData) {
        return (
            <React.Fragment>
                <span>{rowData.plant_short_desc}-{rowData.plant_code}</span>
            </React.Fragment>
        )
    }

    auditee1Template(rowData) {

        return (
            <React.Fragment>
                <span>{rowData.auditee1}, ({rowData.auditee1_ecno})</span>
            </React.Fragment>
        )
    }

    auditee2Template(rowData) {
        if (rowData.auditee1_ecno)
            return (
                <React.Fragment>
                    <span>{rowData.auditee2}, ({rowData.auditee2_ecno})</span>
                </React.Fragment>
            )
        else
            return (
                <React.Fragment>

                </React.Fragment>
            )
    }

    auditor1Template(rowData) {
        return (
            <React.Fragment>
                <span>{rowData.auditor1}, ({rowData.auditor1_ecno})</span>
            </React.Fragment>
        )
    }

    auditor2Template(rowData) {

        if (rowData.auditor2_ecno)
            return (
                <React.Fragment>
                    <span>{rowData.auditor2}, ({rowData.auditor2_ecno})</span>
                </React.Fragment>
            )
        else
            return (
                <React.Fragment>

                </React.Fragment>
            )
    }

    viewButton(rowData) {
        const shoot = () => {
            sessionStorage.setItem("auditId", rowData.audit_id)
            sessionStorage.setItem("plantCode", rowData.plant_code)
        }

        
        return (
            <React.Fragment>
                <Link onClick={shoot} to='/isoAuditDetails' className="p-button p-mr-2">View</Link>
            </React.Fragment>
        )
    }

    render() {

        const loggedIn = localStorage.getItem('ecNo')

        if (loggedIn === null) {
            return <Redirect to='/' />
        }
        else {


            return (
                <React.Fragment>
                    <Navigation />
                    <div className="p-d-flex p-flex-column ">
                        <div className="p-d-flex p-jc-between p-mb-0 p-mx-2">
                            <div> <h1 style={{ fontSize: "20px", margin: "10px 0" }}>ISO Audit List</h1></div>
                        </div>

                        <div className="p-mb-2 p-mx-2">
                            <div className="datatable-filter-demo">
                                <DataTable value={this.state.isoauditDetails} header="ISO Audit List"
                                    removableSort
                                    emptyMessage="No Data Found" className="p-datatable-sm p-shadow-2 p-mb-4"
                                    showGridlines rows={20} rowsPerPageOptions={[5, 10, 20, 50]} paginator >
                                    <Column field="Index" header="Sno" body={this.onIndexTemplate} style={{ width: '3%' }} />
                                    <Column field="audit_date" body={this.auditDateTemplate} header="Audit Date"
                                        sortable filter filterPlaceholder="Search" filterMatchMode="contains" />
                                    <Column field="audit_id" header="Audit Id"
                                        sortable filter filterPlaceholder="Search" filterMatchMode="contains" />
                                    <Column field="plant_code" body={this.plantTemplate} header="Plant"
                                        sortable filter filterPlaceholder="plant code" filterMatchMode="contains" />
                                    <Column field="auditee1" body={this.auditee1Template} header="Auditee1"
                                        sortable filter filterPlaceholder="Search" filterMatchMode="contains" />
                                    <Column field="auditee2" body={this.auditee2Template} header="Auditee2"
                                        sortable filter filterPlaceholder="Search" filterMatchMode="contains" />
                                    <Column field="auditor1" body={this.auditor1Template} header="Auditor1"
                                        sortable filter filterPlaceholder="Search" filterMatchMode="contains" />
                                    <Column field="auditor2" body={this.auditor2Template} header="Auditor2"
                                        sortable filter filterPlaceholder="Search" filterMatchMode="contains" />
                                    <Column field="totalncs" header="Total NCS"
                                        sortable filter filterPlaceholder="Search" filterMatchMode="contains" />
                                    <Column field="pendingncs" header="Pending NCS"
                                        sortable filter filterPlaceholder="Search" filterMatchMode="contains" />
                                    <Column body={this.viewButton} header="Actions" />
                                </DataTable>
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            )
        }
    }
}