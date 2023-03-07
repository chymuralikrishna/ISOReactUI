import React from 'react'
import { Redirect, Link } from 'react-router-dom'
import { Column } from "primereact/column";
import { DataTable } from 'primereact/datatable';
import Navigation from "../Navigation";
import Apiservice from "../../api/Apiservice";
import { Dropdown } from 'primereact/dropdown';
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import CommonFuctions from "../CommonFunctions/CommonFunctions";

export default class IsoAuditFindingsSummaryList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            unitCode: JSON.parse(localStorage.getItem('unitCode')),
            loginEcNo: localStorage.getItem("ecNo"),
            auditIdList: [],
            isoAuditFindings: [],
            auditHdrDetails: [],

            auditId: sessionStorage.getItem("auditId")
        }

        this.viewButton = this.viewButton.bind(this);
        this.onIndexTemplate = this.onIndexTemplate.bind(this)
        this.formatDate = this.formatDate.bind(this)
        this.auditDateTemplate = this.auditDateTemplate.bind(this)
        this.proCompDateFormat = this.proCompDateFormat.bind(this)

        this.getAuditSummary = this.getAuditSummary.bind(this);

        // this.exportCSV = this.exportCSV.bind(this);

        this.columns = [
            {field:'',header:''},
            {field:'',header:''},
            {field:'',header:''},
            {field:'',header:''},
            {field:'',header:''},
            {field:'',header:''},
            {field:'',header:''}

        ]

        this.exportColumns = this.columns.map(col => ({title: col.header, datakey: col.field}))

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
            this.getAuditSummary();
        }

    }

    getAuditSummary() {

        Apiservice.getAuditIdDetails(this.state.auditId).then
            (
                (res) => {
                    this.setState({
                        auditHdrDetails: res.data
                    })
                }
            )

        Apiservice.getISOAuditFindingsSummaryList(this.state.auditId).then(
            (res) => {
                this.setState({
                    isoAuditFindings: res.data
                })
            }
        )

    }

    formatDate(value) {
        if (value)
            return CommonFuctions.getDateInDDMMYYYYFormat(value);

        return "";
    }

    onIndexTemplate(data, props) {
        return props.rowIndex + 1
    }

    auditDateTemplate(rowData) {
        return this.formatDate(rowData['auditDate']);
    }

    proCompDateFormat(rowData) {
        return this.formatDate(rowData['proposedCompletionDate']);
    }

    plantTemplate(rowData) {
        return (
            <React.Fragment>
                <span>{rowData.plantName}-{rowData.plantCode}</span>
            </React.Fragment>
        )
    }

    viewButton(rowData) {
        const shoot = () => {
            sessionStorage.setItem("auditId", rowData.auditId)
            sessionStorage.setItem("plantCode", rowData.plantCode)
            sessionStorage.setItem("findingNumber", rowData.findingNumber)
        }

        return (
            <React.Fragment>
                <Link onClick={shoot} to='/ISOAuditFindingDetails' >{rowData.auditId}</Link>
            </React.Fragment>
        )
    }

    // exportCSV() {
    //     this.dt.exportCSV();
    // }

    // exportPdf() {
    //     import('jspdf').then(jsPDF => {
    //         import('jspdf-autotable').then(() => {
    //             const doc = new jsPDF.default(0, 0);
    //             doc.autoTable(this.exportColumns, this.state.isoAuditFindings);
    //             doc.save('ISO Audit Findings Summary.pdf');
    //         }

    //         )
    //     }

    //     )
    // }


    render() {

        const loggedIn = localStorage.getItem('ecNo')

        if (loggedIn === null) {
            return <Redirect to='/' />
        }
        else {

            const header = (
                <div className="p-d-flex p-ai-center export-buttons">
                    {/* <Button type="button" icon="pi pi-file"
                         className="p-button-success p-mr-2"
                        data-pr-tooltip="XLS" /> */}

                        {/* <label>ISO Audit Findings Summary</label> */}

                </div>
            )

            return (
                <React.Fragment>
                    <Navigation />

                    <Card className="p-mb-2 p-mx-2 p-shadow-3 p-mb-3 content-card">
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
                                <Button label="Search" type="button"
                                    onClick={() => this.getAuditSummary()} className="p-button-outlined p-mt-1" />
                            </div>
                        </div>

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

                        </panel>
                    </Card>

                    <DataTable value={this.state.isoAuditFindings} header="ISO Audit Findings Summary"
                        removableSort emptyMessage="No Data Found" className="p-datatable-sm p-shadow-2 p-mx-2 p-my-2"
                        showGridlines rows={20} rowsPerPageOptions={[5, 10, 20, 50]} paginator  >
                        <Column field="Index" header="Sno" body={this.onIndexTemplate} style={{ width: '3%' }} />
                        <Column field="auditId" body={this.viewButton} header="Audit ID"
                            sortable filter filterPlaceholder="Search" filterMatchMode="contains" />
                        <Column field="auditDate" body={this.auditDateTemplate} header="Audit Date"
                            sortable filter filterPlaceholder="Search" filterMatchMode="contains" />
                        <Column field="plantCode" body={this.plantTemplate} header="Plant"
                            sortable filter filterPlaceholder="plant code" filterMatchMode="equals" />
                        <Column field="isoAuditFindingType" header="Iso Audit Finding Type"
                            sortable filter filterPlaceholder="Search" filterMatchMode="contains" />
                        <Column field="isoStandard" header="Iso Standard"
                            sortable filter filterPlaceholder="Search" filterMatchMode="contains" />
                        <Column field="clause" header="Clause"
                            sortable filter filterPlaceholder="Search" filterMatchMode="contains" />
                        <Column field="requirement" header="Requirement"
                            sortable filter filterPlaceholder="Search" filterMatchMode="contains" />
                        <Column field="failure" header="Failure"
                            sortable filter filterPlaceholder="Search" filterMatchMode="contains" />
                        <Column field="proposedCompletionDate" body={this.proCompDateFormat} header="Proposed Completion Date"
                            sortable filter filterPlaceholder="Search" filterMatchMode="contains" />
                        <Column field="status" header="status"
                            sortable filter filterPlaceholder="Search" filterMatchMode="contains" />

                    </DataTable>
                </React.Fragment>
            )
        }
    }
}