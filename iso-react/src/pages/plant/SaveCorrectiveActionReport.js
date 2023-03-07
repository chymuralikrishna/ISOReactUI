import React from 'react'
import { Panel } from 'primereact/panel'
import Apiservice from '../../api/Apiservice'
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { Button } from 'primereact/button';

import { ConfirmDialog } from 'primereact/confirmdialog';
import { confirmDialog } from 'primereact/confirmdialog';


export default class saveCorrectiveActionReport extends React.Component {

    constructor(props) {
        super(props)
        this.state = {

            auditId: sessionStorage.getItem('auditId'),
            plantCode: sessionStorage.getItem('plantCode'),
            findingNumber: sessionStorage.getItem('findingNumber'),

            proposedCorrection: "",
            rootCause: "",
            proposedCorrectiveAction: "",
            proposedCompletionDate: "",


            proposedCorrectionError: "",
            rootCauseError: "",
            propDateError: "",
            proposedCorrectiveActionError: ""


        }

        this.formatDate = this.formatDate.bind(this);
    }

    handlerChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }



    formatDate(value) {
        if (value != null)
            return new Date(value).toLocaleDateString();

        return "";
    }

    showSuccess(message) {
        this.toast.show({ severity: 'success', summary: message, life: 3000 })
    }

    showError(message) {
        this.toast.show({ severity: 'error', summary: message, life: 3000 })
    }

    rejectFunction() {

    }

    saveCorrectiveActionReportPopUp() {
        confirmDialog({
            message: 'Details cannot be modified after submission. Are you sure you want to submit Corrective Action Report?',
            header: 'Corrective Action Report Submission',
            icon: 'pi pi-exclamation-triangle',
            accept: () => this.saveCorrectiveActionReport(),
            reject: this.rejectFunction()
        })
    }

    saveCorrectiveActionReport = async () => {

        if (this.validationCheck()) {

            let loginEcNo = JSON.parse(localStorage.getItem('ecNo'));
            let response = await Apiservice.saveCorrectiveActionReport(
                this.state.auditId,
                this.state.plantCode,
                this.state.findingNumber,
                this.state.proposedCorrection,
                this.state.rootCause,
                this.state.proposedCorrectiveAction,
                this.state.proposedCompletionDate,
                loginEcNo
            );

            if (response.data) {
                if (response.data.result > 0) {
                    //  this.showSuccess(response.data.message);

                    window.location.reload()
                } else {
                    // this.showError(response.data.message);
                }
            }


        }

    }



    validationCheck() {

        let isValid = true;

        this.setState({
            proposedCorrectionError: "",
            rootCauseError: "",
            propDateError: "",
            proposedCorrectiveActionError: ""
        })

        if (this.state.proposedCorrection === '') {
            this.setState({
                proposedCorrectionError: "Please enter Proposed Correction"
            })
            isValid = false;
        } else if (this.state.proposedCorrection.length > 500) {
            this.setState({
                proposedCorrectionError: "Max characters allowed 500 only"
            })

            isValid = false;
        }

        if (this.state.rootCause === '') {
            this.setState({
                rootCauseError: "Please enter root cause"
            })

            isValid = false;
        } else if (this.state.rootCause.length > 500) {
            this.setState({
                rootCauseError: "Max characters allowed 500 only"
            })

            isValid = false;
        }

        if (this.state.proposedCorrectiveAction === '') {
            this.setState({
                proposedCorrectiveActionError: "Please enter Proposed Correction"
            })

            isValid = false;
        } else if (this.state.proposedCorrectiveAction.length > 500) {
            this.setState({
                proposedCorrectiveActionError: "Max characters allowed 500 only"
            })

            isValid = false;
        }

        if (this.state.proposedCompletionDate === '') {
            this.setState({
                propDateError: "Please enter Proposed Completion Date"
            })

            isValid = false;
        }

        return isValid;
    }

    goToBackPage() {
        window.history.back();
    }


    render() {
        return (

            <React.Fragment>
                <Panel header="Corrective Action Report">
                    <div className="p-fluid p-formgrid p-grid">
                        <div className="p-field p-col-4  p-mb-1">
                            <label>Proposed Correction<sup style={{ color: 'red' }}>&lowast;</sup></label>
                            <InputTextarea value={this.state.proposedCorrection} name="proposedCorrection"
                                onChange={this.handlerChange} autoResize
                            />
                            <small style={{ color: 'red' }}>{this.state.proposedCorrectionError}</small>
                        </div>
                        <div className="p-field p-col-4 p-mb-1">
                            <label>Root Cause<sup style={{ color: 'red' }}>&lowast;</sup></label>
                            <InputTextarea value={this.state.rootCause} name="rootCause"
                                onChange={this.handlerChange} autoResize />
                            <small style={{ color: 'red' }}>{this.state.rootCauseError}</small>
                        </div>
                        <div className="p-field p-col-4 p-mb-0">
                            <label>Proposed Completion Date<sup style={{ color: 'red' }}>&lowast;</sup></label>
                            <Calendar readOnlyInput dateFormat="dd-mm-yy" value={this.state.proposedCompletionDate}
                                name="proposedCompletionDate" onChange={this.handlerChange}
                                showIcon monthNavigator yearNavigator yearRange="2000:2070"
                            />
                            <small style={{ color: 'red' }}>{this.state.propDateError}</small>

                        </div>
                        <div className="p-field p-col-4 p-mb-1">
                            <label>Proposed Corrective Action<sup style={{ color: 'red' }}>&lowast;</sup></label>
                            <InputTextarea value={this.state.proposedCorrectiveAction} name="proposedCorrectiveAction"
                                onChange={this.handlerChange} autoResize />
                            <small style={{ color: 'red' }}>{this.state.proposedCorrectiveActionError}</small>
                        </div>


                    </div>

                    <Button type="button" label="Save" onClick={() => this.saveCorrectiveActionReportPopUp()}
                        className="p-button p-mr-2" />

                    <Button type="button" label="Back"
                        onClick={() => this.goToBackPage()}
                        className="p-button p-mr-2" />

                </Panel>

            </React.Fragment>

        )
    }
}