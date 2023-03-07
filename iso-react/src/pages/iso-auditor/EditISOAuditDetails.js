import React, { Component } from "react";
import { Redirect, Link } from 'react-router-dom';
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import moment from 'moment';
import { Dialog } from "primereact/dialog";
import { Calendar } from "primereact/calendar";
import { Column } from "primereact/column";
import { DataTable } from 'primereact/datatable';

import { Button } from "primereact/button";
import { Card } from "primereact/card";
import Apiservice from "../../api/Apiservice";
import Navigation from "../Navigation";
import { Toast } from 'primereact/toast';
import AddISOAuditFinding from "./AddISOAuditFinding";
import ViewISOAuditFinding from "./ViewISOAuditFinding";


export default class EditIsoauditDetails extends Component {
    constructor(props) {
        super(props)

        this.state = {

            auditId: sessionStorage.getItem('auditId'),
            plantCode: sessionStorage.getItem('plantCode'),
            plantName: '',
            loginEcNo: JSON.parse(localStorage.getItem('ecNo')),

            auditDate: new Date(),
            auditor1Name: '',
            auditor1EcNo: '',
            auditor2EcNo: '',
            auditee1EcNo: '',
            auditee2EcNo: '',

            auditorComments: '',
            detailsOfNoteWorthy: '',
            isoAuditorLists: [],

            plantNameAndCode: '',

            officersList: [],
            isoFinds: [],


            auditDateError: '',
            auditee1Error: '',
            auditeesError: '',
            auditor1Error: '',
            auditorsError: '',
            commError: '',
            noteError: '',

            position: 'center',

            findlists: [],

            showISOAuditFindingsDialogBox: false,
            showViewISOAuditFindingsDialogBox: false
        }

        this.showISOAuditFindingsDialog = this.showISOAuditFindingsDialog.bind(this);
        this.hideISOAuditFindingDialog = this.hideISOAuditFindingDialog.bind(this);

        this.showViewISOAuditFindingsDialog = this.showViewISOAuditFindingsDialog.bind(this);
        this.hideViewISOAuditFindingDialog = this.hideViewISOAuditFindingDialog.bind(this);

        this.addButton = this.addButton.bind(this);
        this.viewAndEditButton = this.viewAndEditButton.bind(this);

    }

    goToBackPage() {
        window.history.back();
    }

    componentDidMount = async () => {
        const unitCode = localStorage.getItem('unitCode')

        Apiservice.getIsoAuditorsList(unitCode).then(
            (resps) => {
                this.setState({
                    isoAuditorLists: resps.data
                })
            }
        )

        const res = await Apiservice.getISOAuditDetails(this.state.auditId, this.state.plantCode)

        this.setState({
            auditId: res.data.auditId,
            auditDate: new Date(res.data.auditDate),
            plantCode: res.data.plantCode,
            plantName: res.data.plantShortDesc,
            auditor1Name: res.data.auditor1,
            auditor1EcNo: res.data.auditor1Ecno,
            auditor2EcNo: res.data.auditor2Ecno,
            auditee1EcNo: res.data.auditee1Ecno,
            auditee2EcNo: res.data.auditee2Ecno,

            auditorComments: res.data.auditorComments,
            detailsOfNoteWorthy: res.data.detailsOfNoteWorthy,
            plantNameAndCode: res.data.plantShortDesc + "-" + res.data.plantCode
        })

        Apiservice.getPlantInfo(res.data.plantCode).then(
            (output) => {
                this.setState({
                    officersList: output.data
                })
            }
        )

        Apiservice.getISOAuditFindingsList(res.data.plantCode, res.data.auditId).then(
            (output2) => {
                this.setState({
                    isoFinds: output2.data
                })
            }
        )

    }

    showSuccess(message) {
        this.toast.show({ severity: 'success', summary: message, life: 3000 })
    }

    showError(message) {
        this.toast.show({ severity: 'error', summary: message, life: 3000 })
    }


    valid() {
        if (this.state.auditDate === '') {
            this.setState({
                auditDateError: "Date is required"
            })
        } else if (this.state.auditee1EcNo === '') {
            this.setState({
                auditee1Error: "Please select an auditee 1"
            })
        } else if (this.state.auditee1EcNo === this.state.auditee2EcNo) {
            this.setState({
                auditeesError: "Please select another auditee"
            })
        } else if (this.state.auditor1EcNo === '') {
            this.setState({
                auditor1Error: "Please select an auditor"
            })
        } else if (this.state.auditor1EcNo === this.state.auditor2EcNo) {
            this.setState({
                auditorsError: "Please select another auditor"
            })
        } else if (this.state.auditorComments.length > 200) {
            this.setState({
                commError: "Max characters allowed 200 only"
            })
        } else if (this.state.detailsOfNoteWorthy.length > 200) {
            this.setState({
                noteError: "Max characters allowed 200 only"
            })
        } else {
            return true
        }
    }

    saveISOAuditDetails = async (e) => {
        e.preventDefault();
        this.setState({
            auditDateError: '',
            auditeeError: '',
            auditee2Error: '',
            auditeesError: '',
            auditor2Error: '',
            auditorsError: '',
            commError: '',
            noteError: '',
        })
        if (this.valid()) {

            Apiservice.updateISOAuditDetails(
                this.state.auditId,
                this.state.auditDate,
                this.state.auditee1EcNo,
                this.state.auditee2EcNo,
                this.state.auditor1EcNo,
                this.state.auditor2EcNo,
                this.state.auditorComments,
                this.state.detailsOfNoteWorthy,
                this.state.loginEcNo,
                this.state.plantCode

            ).then(
                res => {
                    if (res.data.result === 0) {
                        this.showError(res.data.message);
                    } else {
                        this.showSuccess(res.data.message);

                    }
                }
            )
        }
    }

    showISOAuditFindingsDialog() {
        this.setState({
            showISOAuditFindingsDialogBox: true
        })

    }

    hideISOAuditFindingDialog() {
        this.setState({
            showISOAuditFindingsDialogBox: false
        })
    }

    showViewISOAuditFindingsDialog() {
        this.setState({
            showViewISOAuditFindingsDialogBox: true
        })

    }

    hideViewISOAuditFindingDialog() {
        this.setState({
            showViewISOAuditFindingsDialogBox: false
        })
    }

    addButton() {
        sessionStorage.setItem("isSaveDialog", 'yes');
        this.showISOAuditFindingsDialog();
    }

    viewAndEditButton(rowData) {
        const viewButtonshoot = () => {
            sessionStorage.setItem("findingNumber", rowData.findingNumber);
            this.showViewISOAuditFindingsDialog();
        }

        const editButtonshoot = () => {
            sessionStorage.setItem("findingNumber", rowData.findingNumber);
            sessionStorage.setItem("isSaveDialog", 'no');
            this.showISOAuditFindingsDialog();
        }

        if (rowData.correctiveActionFiled)
            return (
                <React.Fragment>
                    <Button type="button" label="View" onClick={viewButtonshoot} />
                </React.Fragment>
            )
        else
            return (
                <React.Fragment>
                    <Button type="button" label="View" onClick={viewButtonshoot} />
                &nbsp;&nbsp;&nbsp;
                    <Button type="button" label="Edit" onClick={editButtonshoot} />
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
                    <Toast ref={(el) => this.toast = el} />
                    <Navigation />
                    <div className="p-d-flex p-flex-column ">
                        <Card className="p-mb-3 p-mx-2 p-shadow-3 p-mt-2 p-pb-2 content-card" title="ISO Audit Details">
                            <form onSubmit={this.saveISOAuditDetails}>
                                <div className="p-fluid p-formgrid p-grid">
                                    <div className="p-field p-col-3">
                                        <div className="p-mb-2">
                                            <label>Audit Date<sup style={{ color: 'red' }}>&lowast;</sup></label>
                                            <Calendar readOnlyInput dateFormat="dd-mm-yy" value={this.state.auditDate}
                                                onChange={(e) => this.setState({ auditDate: moment(e.value).format("YYYY-MM-DD") })}
                                                showIcon monthNavigator yearNavigator yearRange="2000:2070" required="required"
                                            />
                                            <small style={{ color: 'red' }}>{this.state.auditDateError}</small>
                                        </div>
                                    </div>
                                    <div className="p-field p-col-3">
                                        <div className="p-mb-2">
                                            <label>Audit Id<sup style={{ color: 'red' }}>&lowast;</sup></label>
                                            <InputText disabled value={this.state.auditId} />
                                        </div>
                                    </div>
                                    <div className="p-field p-col-2">
                                        <div className="p-mb-2">
                                            <label>Plants<sup style={{ color: 'red' }}>&lowast;</sup></label>
                                            <InputText value={this.state.plantNameAndCode} disabled />

                                        </div>
                                    </div>
                                    <div className="p-field p-col">
                                        <div className="p-mb-2">
                                            <label>Auditee1<sup style={{ color: 'red' }}>&lowast;</sup></label>
                                            <Dropdown value={this.state.auditee1EcNo} options={this.state.officersList}
                                                optionLabel="displayName" optionValue="ecNo"
                                                onChange={(e) => this.setState({ auditee1EcNo: e.value })}
                                                placeholder="Select Auditee"
                                                filter filterBy="displayName" />
                                            <small style={{ color: 'red' }}>{this.state.auditee1Error}</small>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-fluid p-formgrid p-grid">
                                    <div className="p-field p-col-3">
                                        <div className="p-mb-2">
                                            <label>Auditee2</label>
                                            <Dropdown value={this.state.auditee2EcNo} options={this.state.officersList}
                                                onChange={(e) => this.setState({ auditee2EcNo: e.value })}
                                                optionLabel="displayName" optionValue="ecNo"
                                                placeholder="Select Auditee"
                                                filter filterBy="displayName"
                                            />
                                            <small style={{ color: 'red' }}>{this.state.auditeesError}</small>
                                        </div>
                                    </div>
                                    <div className="p-field p-col-3">
                                        <div className="p-mb-2">
                                            <label>Auditor1<sup style={{ color: 'red' }}>&lowast;</sup></label>
                                            <InputText value={this.state.auditor1Name} disabled />
                                        </div>
                                    </div>
                                    <div className="p-field p-col-3">
                                        <div className="p-mb-2">
                                            <label>Auditor2</label>
                                            <Dropdown value={this.state.auditor2EcNo} options={this.state.isoAuditorLists}
                                                optionLabel="displayLabel" optionValue="objectValue"
                                                onChange={(e) => this.setState({ auditor2EcNo: e.value })}
                                                placeholder="Search Auditor 2" filter
                                                filterBy="displayLabel, objectValue" />
                                            <small style={{ color: 'red' }}>{this.state.auditorsError}</small>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-fluid p-formgrid p-grid">
                                    <div className="p-field p-col-6">
                                        <label>Auditor Comments</label>
                                        <InputTextarea rows={2} value={this.state.auditorComments}
                                            onChange={(e) => this.setState({ auditorComments: e.target.value })} />
                                        <small style={{ color: 'red' }}>{this.state.commError}</small>
                                    </div>
                                    <div className="p-field p-col-6">
                                        <label>Details Of NoteWorthy</label>
                                        <InputTextarea rows={2} value={this.state.detailsOfNoteWorthy}
                                            onChange={(e) => this.setState({ detailsOfNoteWorthy: e.target.value })} />
                                        <small style={{ color: 'red' }}>{this.state.noteError}</small>
                                    </div>
                                </div>
                                <div className="p-mb-2">
                                    <Button label="Save" type="submit" />
                                    &nbsp;&nbsp;
                                    <Button type="button" label="Back"
                                        onClick={() => this.goToBackPage()}
                                        className="p-button p-mr-2" />

                                    <span className="float-e">
                                        <Button type="button" label="Add Audit Findings"
                                            onClick={() => this.addButton()} />
                                    </span>
                                </div>
                            </form>


                        </Card>

                        <React.Fragment>
                            <div className="p-mb-2 p-mx-2">
                                <div className="datatable-filter-demo">

                                    <DataTable value={this.state.isoFinds} header="ISO Audit Findings List" hidden="true"
                                        removableSort emptyMessage="No Audit Findings Present" className="p-datatable-sm p-shadow-2 p-mb-2"
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
                                        <Column header="Action" body={this.viewAndEditButton} />

                                    </DataTable>



                                </div>
                            </div>

                            <Dialog header="ISO Audit Findings" visible={this.state.showISOAuditFindingsDialogBox}
                                maximizable draggable={true} resizable={true}
                                style={{ width: '60vw' }}
                                onHide={() => this.hideISOAuditFindingDialog()}  >
                                <AddISOAuditFinding />
                            </Dialog>

                            <Dialog header="ISO Audit Findings" visible={this.state.showViewISOAuditFindingsDialogBox}
                                maximizable draggable={true} resizable={true}
                                style={{ width: '60vw' }}
                                onHide={() => this.hideViewISOAuditFindingDialog()} >
                                <ViewISOAuditFinding />
                            </Dialog>

                        </React.Fragment>

                    </div>


                </React.Fragment>


            )
        }
    }
}