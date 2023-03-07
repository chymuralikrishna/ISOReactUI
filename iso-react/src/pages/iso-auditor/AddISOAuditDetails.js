import React, { Component } from "react";
import { Redirect, Link } from 'react-router-dom';
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import moment from "moment";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import Apiservice from "../../api/Apiservice";
import Navigation from "../Navigation";
import { Toast } from 'primereact/toast';

export default class AddISOAuditDetails extends Component {

    constructor(props) {
        super(props)

        this.state = {

            auditDate: new Date(),
            auditId: null,
            plantCode: null,

            auditee1EcNo: null,
            auditee2EcNo: null,

            auditor1EcNo: JSON.parse(localStorage.getItem('ecNo')),
            auditor1Name: localStorage.getItem('user'),

            auditor2EcNo: null,

            auditorComments: "",
            detailsOfNoteWorthy: "",

            unitCode: JSON.parse(localStorage.getItem('unitCode')),
            loginEcNo: JSON.parse(localStorage.getItem('ecNo')),

            auditIdList: [],
            plants: [],
            isoAuditorLists: [],
            officersList: [],

            auditDateError: '',
            auditIdError: '',
            plantCodeError: '',
            auditee1Error: '',
            auditeesError: '',
            auditorsError: '',
            commError: '',
            noteError: '',

        }

        this.showSuccess = this.showSuccess.bind(this)
        this.showError = this.showError.bind(this)

       
        this.onChangePlant = this.onChangePlant.bind(this)
       
    }

    async componentDidMount() {
        Apiservice.getOpenAuditIds(this.state.unitCode).then(
            (response) => {
                this.setState({
                    auditIdList: response.data
                })
            }
        )
        Apiservice.getAllPlants().then(
            (res) => {
                this.setState({
                    plants: res.data
                })
            }
        )
        Apiservice.getIsoAuditorsList(this.state.unitCode).then(
            (resp) => {
                this.setState({
                    isoAuditorLists: resp.data
                })
            }
        )
    }

    onChangePlant(e) {
        this.setState({
            plantCode: e.value
        })
        Apiservice.getPlantInfo(e.value).then(
            (output) => {
                this.setState({
                    officersList: output.data
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
        if (this.state.auditId === null) {
            this.setState({
                auditIdError: "Please select a Audit Id"
            })
        } else if (this.state.auditDate === '') {
            this.setState({
                auditDateError: "Date is required"
            })
        } else if (this.state.plantCode === null) {
            this.setState({
                plantCodeError: "Please Select Plant Code"
            })
        } else if (this.state.auditee1EcNo === '') {
            this.setState({
                auditee1Error: "Please select an auditee"
            })
        } else if (this.state.auditee1EcNo === this.state.auditee2EcNo) {
            this.setState({
                auditeesError: "Please select another auditee"
            })
        } else if (this.state.auditor1EcNo === this.state.auditor2EcNo) {
            this.setState({
                auditorsError: "Please select another auditor"
            })
        } else if (this.state.auditorComments.length > 500) {
            this.setState({
                commError: "Max characters allowed 500 only"
            })
        } else if (this.state.detailsOfNoteWorthy.length > 500) {
            this.setState({
                noteError: "Max characters allowed 500 only"
            })
        } else {
            return true
        }
    }


    saveISOAuditDetailsForm = async () => {

        sessionStorage.setItem('auditId', this.state.auditId)
        sessionStorage.setItem('plantCode', this.state.plantCode)

        this.setState({
            auditIdError: '',
            auditDateError: '',
            plantCodeError: '',
            auditee1Error: '',
            auditeesError: '',
            auditorsError: '',
            commError: '',
            noteError: '',
        })
        if (this.valid()) {

            const res = await Apiservice.saveISOAuditDetails(
                this.state.auditDate,
                this.state.auditId,
                this.state.auditee1EcNo,
                this.state.auditee2EcNo,
                this.state.auditor1EcNo,
                this.state.auditor2EcNo,
                this.state.auditorComments,
                this.state.detailsOfNoteWorthy,
                this.state.loginEcNo,
                this.state.plantCode
            )

            if (res.data.result === 0) {
               this.showError(res.data.message);
            } else {
               this.showSuccess(res.data.message)
               this.props.history.push('/editISOAuditDetails',{});
            }
        }
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
                        <Card className="p-mb-3 p-mx-2 p-shadow-3 p-mt-2 p-pb-2 content-card" title="Create New ISO Audit">

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
                                        <Dropdown value={this.state.auditId} name="auditId"
                                            options={this.state.auditIdList}
                                            optionLabel="displayLabel" optionValue="objectValue"
                                            onChange={(e) => this.setState({ auditId: e.value })}
                                            placeholder="Select Audit Id" filter filterBy="objectValue" />
                                        <small style={{ color: 'red' }}>{this.state.auditIdError}</small>
                                    </div>
                                </div>
                                <div className="p-field p-col-2">
                                    <div className="p-mb-2">
                                        <label>Plants<sup style={{ color: 'red' }}>&lowast;</sup></label>
                                        <Dropdown value={this.state.plantCode} name="plantCode" options={this.state.plants}
                                            onChange={this.onChangePlant} placeholder="Select Plant Code"
                                            optionLabel="plantShortDesc" optionValue="plantCode"
                                            filter filterBy="plantShortDesc,plantCode" />
                                        <small style={{ color: 'red' }}>{this.state.plantCodeError}</small>
                                    </div>
                                </div>
                                <div className="p-field p-col">
                                    <div className="p-mb-2">
                                        <label>Auditee1<sup style={{ color: 'red' }}>&lowast;</sup></label>

                                        <Dropdown value={this.state.auditee1EcNo}
                                            options={this.state.officersList} 
                                            optionLabel="displayName" optionValue="ecNo"
                                            onChange={(e) => this.setState({ auditee1EcNo: e.value })}
                                            placeholder="Select Auditee" filter filterBy="displayName"
                                        />
                                        <small style={{ color: 'red' }}>{this.state.auditee1Error}</small>
                                    </div>
                                </div>
                            </div>
                            <div className="p-fluid p-formgrid p-grid">
                                <div className="p-field p-col-3">
                                    <div className="p-mb-2">
                                        <label>Auditee2</label>
                                        <Dropdown value={this.state.auditee2EcNo}
                                            options={this.state.officersList} 
                                            optionLabel="displayName" optionValue="ecNo"
                                            onChange={(e) => this.setState({ auditee2EcNo: e.value })}
                                            placeholder="Select Auditee" filter filterBy="displayName"
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
                                        <Dropdown value={this.state.auditor2EcNo}
                                            options={this.state.isoAuditorLists} 
                                            optionLabel="displayLabel" optionValue="objectValue"
                                            onChange={(e) => this.setState({ auditor2EcNo: e.value })}
                                            placeholder="Select Auditor 2" filter
                                            filterBy="displayLabel, objectValue" />
                                        <small style={{ color: 'red' }}>{this.state.auditorsError}</small>
                                    </div>
                                </div>
                            </div>
                            <div className="p-fluid p-formgrid p-grid">
                                <div className="p-field p-col-6">
                                    <label>Auditor Comments</label>
                                    <InputTextarea rows={2} value={this.state.auditorComments}
                                        onChange={(e) => this.setState({ auditorComments: e.target.value })}
                                    />
                                    <small style={{ color: 'red' }}>{this.state.commError}</small>
                                </div>
                                <div className="p-field p-col-6">
                                    <label>Details Of NoteWorthy</label>
                                    <InputTextarea rows={2} value={this.state.detailsOfNoteWorthy}
                                        onChange={(e) => this.setState({ detailsOfNoteWorthy: e.target.value })}
                                    />
                                    <small style={{ color: 'red' }}>{this.state.noteError}</small>
                                </div>
                            </div>
                            <div className="p-mb-2">
                                <React.Fragment>
                                <Button onClick={() => this.saveISOAuditDetailsForm()} 
                                        className="p-button p-mr-2">Save</Button>
                                </React.Fragment>
                            </div>

                        </Card>

                    </div>
                </React.Fragment>
            )
        }
    }

}

