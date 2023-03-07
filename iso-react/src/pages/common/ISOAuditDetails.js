import React from 'react'

import Apiservice from '../../api/Apiservice'
import { Panel } from 'primereact/panel'
import { Redirect, Link } from 'react-router-dom'

import { DataTable } from 'primereact/datatable';
import { Column } from "primereact/column";
import Navigation from "../Navigation";
import { Button } from 'primereact/button';
import CommonFuctions from "../CommonFunctions/CommonFunctions";

export default class ISOAuditDetailsView extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            auditId: sessionStorage.getItem('auditId'),
            plantCode: sessionStorage.getItem('plantCode'),
            auditDetails: [],
            isoAuditFindings: [],
        }

        this.viewButton = this.viewButton.bind(this);
        this.formatDate = this.formatDate.bind(this);

    }

    formatDate(value) {
        if (value != null)
            return CommonFuctions.getDateInDDMMYYYYFormat(value);

        return "";
    }

    async componentDidMount() {
        Apiservice.getISOAuditDetails(this.state.auditId, this.state.plantCode).then(
            (response) => {
                this.setState({
                    auditDetails: response.data
                })
            }
        )

        Apiservice.getISOAuditFindingsList(this.state.plantCode, this.state.auditId).then(
            (resp) => {
                if (resp.data != "") {
                    this.setState({
                        isoAuditFindings: resp.data,
                    })
                }
            }
        )
    }

    viewButton(rowData) {
        const shoot = () => {
            sessionStorage.setItem("auditId", this.state.auditId)
            sessionStorage.setItem("plantCode", this.state.plantCode)
            sessionStorage.setItem("findingNumber", rowData.findingNumber)
        }

        return (
            <React.Fragment>
                <Link onClick={shoot} to='/ISOAuditFindingDetails' className="p-button p-mr-2">View</Link>
            </React.Fragment>
        )
    }

    goToBackPage() {
        window.history.back();
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

                    <Panel header="Audit Details" className="p-mx-2 p-my-2">
                        <table className="table">
                            <tbody>
                                <tr>
                                    <td><strong>Audit Id</strong></td>
                                    <td>{this.state.auditDetails.auditId}</td>
                                    <td><strong>Audit Date</strong></td>
                                    <td>{this.formatDate(this.state.auditDetails.auditDate)}</td>
                                    <td><strong>Plant</strong></td>
                                    <td colspan="3">{this.state.auditDetails.plantShortDesc}, ({this.state.auditDetails.plantCode})</td>
                                </tr>
                                <tr>
                                    <td><strong>Auditor1</strong></td>
                                    <td>{this.state.auditDetails.auditor1}, ({this.state.auditDetails.auditor1Ecno})</td>
                                    <td><strong>Auditor2</strong></td>
                                    <td>{this.state.auditDetails.auditor2}, ({this.state.auditDetails.auditor2Ecno})</td>
                                    <td><strong>Auditee1</strong></td>
                                    <td>{this.state.auditDetails.auditee1}, ({this.state.auditDetails.auditee1Ecno})</td>
                                    <td><strong>Auditee2</strong></td>
                                    <td>{this.state.auditDetails.auditee2}, ({this.state.auditDetails.auditee2Ecno})</td>
                                </tr>
                                <tr>
                                    <td><strong>Auditor Comments</strong></td>
                                    <td>{this.state.auditDetails.auditorComments}</td>
                                    <td><strong>Details Of NoteWorthy</strong></td>
                                    <td>{this.state.auditDetails.detailsOfNoteWorthy}</td>
                                </tr>
                            </tbody>
                        </table>
                    </Panel>

                    <DataTable value={this.state.isoAuditFindings} header="ISO Audit Findings List"
                        removableSort emptyMessage="No Audit Findings Present" className="p-datatable-sm p-shadow-2 p-mx-2 p-my-2"
                        showGridlines rows={20} rowsPerPageOptions={[5, 10, 20, 50]} paginator  >
                        <Column field="findingNumber" header="Finding Number"
                            sortable filter filterPlaceholder="Search" filterMatchMode="contains" />
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
                        <Column field="status" header="Status"
                            sortable filter filterPlaceholder="Search" filterMatchMode="contains" />
                        <Column body={this.viewButton} header="Actions" />

                    </DataTable>

                    <Button type="button" label="Back"
                        onClick={() => this.goToBackPage()}
                        className="p-button p-button-secondary p-ml-2" />

                </React.Fragment>
            )
        }
    }
}