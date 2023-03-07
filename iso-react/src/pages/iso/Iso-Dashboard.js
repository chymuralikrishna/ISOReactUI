import React, { Component } from "react";
import { Redirect, Link } from 'react-router-dom';
import { Column } from "primereact/column";
import { DataTable } from 'primereact/datatable';
import Navigation from "../Navigation";
import Apiservice from "../../api/Apiservice";
import CommonFuctions from "../CommonFunctions/CommonFunctions";

export default class IsoDashboard extends Component {

    constructor(props) {
        super(props)


        this.state = {
            unitCode: localStorage.getItem("unitCode"),
            isoDetails: []
        }

        this.onColumnToggle = this.onColumnToggle.bind(this)
        this.editBtn = this.editBtn.bind(this)
        this.startDateTemplate = this.startDateTemplate.bind(this);
        this.endDateTemplate = this.endDateTemplate.bind(this);
        this.onIndexTemplate = this.onIndexTemplate.bind(this);

    }

    async componentDidMount() {
        Apiservice.getDetails(this.state.unitCode).then(
            (res) => {
                this.setState({
                    isoDetails: res.data
                })
            }
        )
    }

    onIndexTemplate(data, props) {
        return props.rowIndex + 1
    }

    onColumnToggle(event) {
        let selectedColumns = event.value;
        let orderedSelectedColumns = this.columns.filter(col => selectedColumns.some(sCol => sCol.field === col.field));
        this.setState({ selectedColumns: orderedSelectedColumns });
    }

    editBtn(rowData) {
        const setAuditId = () => {
            sessionStorage.setItem("audit_id", rowData['auditId']);
            sessionStorage.setItem("auditId", rowData['auditId']);
        }
        return (
            <React.Fragment>
                <Link onClick={setAuditId} to='/IsoAuditDetailsList' className="p-button p-mr-2">View</Link>
                <Link onClick={setAuditId} to='/saveISOAuditHdr' className="p-button">Edit</Link>
            </React.Fragment>
        )
    }

   
    startDateTemplate(rowData) {
        return CommonFuctions.getDateInDDMMYYYYFormat(rowData['startDate']);
    }
    endDateTemplate(rowData) {
        return CommonFuctions.getDateInDDMMYYYYFormat(rowData['endDate']);
    }




    render() {

        const loggedIn = localStorage.getItem('ecNo')

        if (loggedIn === null) {
            return <Redirect to='/' />
        }
        else {



            const resetAuditId = () => {
                sessionStorage.setItem("audit_id", '')
            }


            return (
                <React.Fragment>
                    <Navigation />
                    <div className="p-d-flex p-flex-column ">
                        <div className="p-d-flex p-jc-between p-mb-0 p-mx-2">
                            <div> <h1 style={{ fontSize: "20px", margin: "10px 0" }}>ISO Audit List</h1></div>


                            <Link onClick={resetAuditId} to='/saveISOAuditHdr'
                                className="p-button p-button-sm p-my-2">
                                Create New ISO AUdit</Link>


                        </div>

                        <div className="p-mb-2 p-mx-2">
                            <div className="datatable-filter-demo">
                                <DataTable value={this.state.isoDetails} header="ISO Audit List"
                                    emptyMessage="No Data Found" className="p-datatable-sm p-shadow-2 p-mb-4"
                                    removableSort showGridlines
                                    rows={20} rowsPerPageOptions={[5, 10, 20, 50]} paginator >
                                    <Column field="Index" header="Sno" body={this.onIndexTemplate} style={{ width: '3%' }} />
                                    <Column field="auditId" header="Audit Id"
                                        sortable filter filterPlaceholder="Search" filterMatchMode="contains" />
                                    <Column field="auditType" header="Audit Type"
                                        sortable filter filterPlaceholder="Search" filterMatchMode="contains" />
                                    <Column field="auditAgency" header="Audit Agency"
                                        sortable filter filterPlaceholder="Search" filterMatchMode="contains" />
                                    <Column field="startDate" header="Audit Start Date" body={this.startDateTemplate}
                                        sortable filter filterPlaceholder="Search" filterMatchMode="contains" />
                                    <Column field="endDate" header="Audit End Date" body={this.endDateTemplate}
                                        sortable filter filterPlaceholder="Search" filterMatchMode="contains" />
                                    <Column field="status" header="Status"
                                        sortable filter filterPlaceholder="Search" filterMatchMode="contains" />

                                    <Column field="auditId" header="Actions" body={this.editBtn} />
                                </DataTable>
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            )
        }
    }
}