import React, { Component } from "react";
import Navigation from "../Navigation";

import { Column } from "primereact/column";
import { DataTable } from 'primereact/datatable';
import { Dropdown } from 'primereact/dropdown';
import Apiservice from "../../api/Apiservice";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import { MultiSelect } from 'primereact/multiselect';
import { Redirect, Link } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import CommonFuctions from "../CommonFunctions/CommonFunctions";

export default class ViewIsoAudits extends Component {


    constructor(props) {
        super(props)

        this.columns = [
            { field: "totalncs", header: "Total NCS" },
            { field: "pendingncs", header: "Pending NCS" },
            { field: "details_of_note_worthy", header: "Details of Note Worthy" }
        ]

        this.state = {
            auditId: sessionStorage.getItem('auditId'),
            auditHdrDetails: [],
            auditIdList: [],
            selectedColumns: [],
            unitCode: JSON.parse(localStorage.getItem('unitCode')),
            auditIdError: '',
            isLoading: false,
            show: false,
        }

        this.onIndexTemplate = this.onIndexTemplate.bind(this)
        this.onColumnToggle = this.onColumnToggle.bind(this)
        this.editBtn = this.editBtn.bind(this)
        this.auditDateFormat = this.auditDateFormat.bind(this)
    }

    formatDate(value) {
        if (value != null)
            return CommonFuctions.getDateInDDMMYYYYFormat(value);

        return "";
    }

    onIndexTemplate(data, props) {
        return props.rowIndex + 1
    }

    onColumnToggle(event) {
        let selectedColumns = event.value
        let orderedSelectedColumns = this.columns.filter(col => selectedColumns.some(sCol => sCol.field === col.field))
        this.setState({ selectedColumns: orderedSelectedColumns })
    }

    resetPage() {
        window.location.reload()
    }

    showError() {
        this.toast.show({ severity: 'error', summary: 'No Data Available.', life: 6000 })
    }

    handlerChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    async componentDidMount() {
        Apiservice.getAuditIds(this.state.unitCode).then(
            (response) => {
                this.setState({
                    auditIdList: response.data
                })
            }
        )

        if (this.state.auditId) {
            Apiservice.getISOAuditDetailsList(this.state.auditId)
                .then(
                    (res) => {
                        this.setState({
                            isLoading: false
                        })
                        if (res.data != "") {
                            this.setState({
                                woDetails: res.data,
                                show: true
                            })
                        } else {
                            this.showError()
                            this.setState({
                                show: false
                            })
                        }
                    }
                )

            Apiservice.getAuditIdDetails(this.state.auditId).then
                (
                    (res) => {
                        this.setState({
                            auditHdrDetails: res.data
                        })
                    }
                )

        }
    }

    valid() {
        if (this.state.selectedAuditId === null) {
            this.setState({
                auditIdError: 'Please select an AuditId'
            })
        } else {
            return true
        }
    }


    handlerSubmit = async (e) => {
        e.preventDefault();
        this.setState({
            auditIdError: '',
            ecnoError: '',
            sdError: '',
            edError: '',
            dtsError: ''
        })
        if (this.valid()) {
            Apiservice.getAuditIdDetails(this.state.auditId).then
                (
                    (res) => {
                        this.setState({
                            auditHdrDetails: res.data
                        })
                    }
                )

            Apiservice.getISOAuditDetailsList(this.state.auditId)
                .then(
                    (res) => {
                        this.setState({
                            isLoading: false
                        })
                        if (res.data != "") {
                            this.setState({
                                woDetails: res.data,
                                show: true
                            })
                        } else {
                            this.showError()
                            this.setState({
                                show: false
                            })
                        }
                    }
                )
        }
    }

    editBtn(rowData) {
        const shoot = () => {
            sessionStorage.setItem("auditId", rowData.audit_id)
            sessionStorage.setItem("plantCode", rowData.plant_code)
        }

        let loginRole = localStorage.getItem('type');
        let loginEcNo = JSON.parse(localStorage.getItem('ecNo'));

        if (loginRole === 'ISO AUDITOR' && (loginEcNo === rowData.auditor1_ecno || loginEcNo === rowData.auditor2_ecno)
            && this.state.auditHdrDetails.status === 'Open')
            return (
                <React.Fragment>
                    <Link onClick={shoot} to='/isoAuditDetails' className="p-button p-mr-2">View</Link>
                    <Link onClick={shoot} to='/editISOAuditDetails' className="p-button">Edit</Link>
                </React.Fragment>
            )
        else
            return (
                <React.Fragment>
                    <Link onClick={shoot} to='/isoAuditDetails' className="p-button p-mr-2">View</Link>
                </React.Fragment>
            )
    }


    wDate(rowData) {
        return (
            <React.Fragment>
                <span>{rowData.plant_short_desc}, ({rowData.plant_code})</span>
            </React.Fragment>
        )
    }

    wDate2(rowData) {
        return (
            <React.Fragment>
                <span>{rowData.auditor1}, ({rowData.auditor1_ecno})</span>
            </React.Fragment>
        )
    }

    wDate3(rowData) {

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

    wDate4(rowData) {
        return (
            <React.Fragment>
                <span>{rowData.auditee1}, ({rowData.auditee1_ecno})</span>
            </React.Fragment>
        )
    }

    wDate5(rowData) {

        if (rowData.auditee2_ecno)
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

    auditDateFormat(rowDate) {
        return this.formatDate(rowDate['audit_date']);
    }

    render() {

        const loggedIn = localStorage.getItem('ecNo')

        if (loggedIn === null) {
            return <Redirect to='/' />
        }
        else {

            const header = (

                <React.Fragment>
                    <div style={{ textAlign: 'center' }}>
                        <label>ISO Audit Details</label>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                        <MultiSelect value={this.state.selectedColumns}
                            options={this.columns} optionLabel="header" onChange={this.onColumnToggle}
                            style={{ width: '20em' }} placeholder="select columns" />
                    </div>
                </React.Fragment>
            )

            const dynamicColumns = this.state.selectedColumns.map(col => {
                return <Column key={col.field} field={col.field} header={col.header}
                    sortable filter filterPlaceholder="Search" filterMatchMode="contains" />
            })

            return (
                <React.Fragment>
                    <Navigation />
                    <Toast ref={(el) => this.toast = el} />
                    <div className="p-d-flex p-flex-column p-mt-3">
                        <Card className="p-mb-2 p-mx-2 p-shadow-3 p-mb-3 content-card">
                            <form onSubmit={this.handlerSubmit}>
                                <small style={{ color: 'red' }}>{this.state.dtsError}</small>
                                <div className="p-fluid p-formgrid p-grid">
                                    <div className="p-field p-col-2">
                                        <label>Audit Id<sup style={{ color: 'red' }}>&lowast;</sup></label>
                                        <Dropdown value={this.state.auditId} name="auditId"
                                            options={this.state.auditIdList}
                                            optionLabel="displayLabel" optionValue="objectValue"
                                            onChange={(e) => this.setState({ auditId: e.value })}
                                            placeholder="Select Audit Id" filter filterBy="displayLabel" />
                                        <small style={{ color: 'red' }}>{this.state.auditIdError}</small>
                                    </div>
                                    <div className="p-field">
                                        <label>&nbsp;</label>
                                        <Button label="Search" type="submit" className="p-button-outlined p-mt-1" />
                                    </div>
                                    <div className="p-field">
                                        <label>&nbsp;</label>
                                        <Button label="Reset" type="reset" className="p-button-outlined p-button-secondary p-ml-1 p-mt-1" onClick={this.resetPage} />
                                    </div>
                                </div>
                            </form>

                            {this.state.show ?
                                <panel header="Audit Details" className="p-mx-2 p-my-2">

                                    <table className="table">
                                        <tbody>
                                            <tr>
                                                <td><strong>Audit Type</strong></td>
                                                <td>{this.state.auditHdrDetails.auditType}</td>
                                                <td><strong>Audit Start Date</strong></td>
                                                <td>{this.formatDate(this.state.auditHdrDetails.startDate)}</td>
                                                <td><strong>Audit End Date</strong></td>
                                                <td>{this.formatDate(this.state.auditHdrDetails.endDate)}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Audit Agency</strong></td>
                                                <td>{this.state.auditHdrDetails.auditAgency}</td>
                                                <td><strong>Status</strong></td>
                                                <td>{this.state.auditHdrDetails.status}</td>
                                                <td><strong>Comments</strong></td>
                                                <td>{this.state.auditHdrDetails.auditComments}</td>

                                            </tr>

                                        </tbody>
                                    </table>

                                </panel> : ""}
                        </Card>

                        <div className="p-mb-2 p-mx-2">
                            <div className="datatable-filter-demo">

                                {this.state.isLoading ? <ProgressSpinner style={{ width: "50px", height: "50px" }} strokeWidth="5" fill="#EEEEEE" animationDuration="0.5s" /> : ""}
                                {this.state.show ?
                                    <DataTable value={this.state.woDetails} removableSort header={header}
                                        showGridlines emptyMessage="No Data Found" className="p-datatable-sm p-shadow-2 p-my-2"  >
                                        <Column field="Index" header="Sno" body={this.onIndexTemplate} style={{ width: '3%' }} />
                                        <Column field="audit_id" header="Audit Id"
                                            sortable filter filterPlaceholder="Search" filterMatchMode="contains" />
                                        <Column field="audit_date" body={this.auditDateFormat} header="Audit Date"
                                            sortable filter filterPlaceholder="Search" filterMatchMode="contains" />
                                        <Column field="plant_code" body={this.wDate} header="Plant"
                                            sortable filter filterPlaceholder="Search" filterMatchMode="contains" />
                                        <Column field="auditor1" body={this.wDate2} header="Auditor 1"
                                            sortable filter filterPlaceholder="Search" filterMatchMode="contains" />
                                        <Column field="auditor2" body={this.wDate3} header="Auditor 2"
                                            sortable filter filterPlaceholder="Search" filterMatchMode="contains" />
                                        <Column field="auditee1" body={this.wDate4} header="Auditee 1"
                                            sortable filter filterPlaceholder="Search" filterMatchMode="contains" />
                                        <Column field="auditee2" body={this.wDate5} header="Auditee 2"
                                            sortable filter filterPlaceholder="Search" filterMatchMode="contains" />

                                        {dynamicColumns}
                                        <Column body={this.editBtn} header="Actions" />

                                    </DataTable> : ""}
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            )
        }
    }
}