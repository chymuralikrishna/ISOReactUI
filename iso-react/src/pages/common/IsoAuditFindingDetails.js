import React from 'react'

import { Toast } from 'primereact/toast'
import { Panel } from 'primereact/panel'

import { InputTextarea } from "primereact/inputtextarea";
import Apiservice from '../../api/Apiservice'

import { Dialog } from "primereact/dialog";
import { Button } from 'primereact/button';
import ISOAuditFindingLogs from "./ISOAuditFindingLogs";
import ISOAuditFindingDetailsView from "./IsoAuditFindingDetailsView";
import SaveCorrectiveActionReport from "../plant/SaveCorrectiveActionReport";
import Navigation from "../Navigation";

import { confirmDialog } from 'primereact/confirmdialog';

import UploadDocuments from "../iso-auditor/UploadDocuments";
import ISOAuditFindingAttachments from "../common/ISOAuditFindingAttachments";


export default class ISOAuditFindingDetails extends React.Component {

    constructor(props) {
        super(props)
        this.state = {

            auditId: sessionStorage.getItem('auditId'),
            plantCode: sessionStorage.getItem('plantCode'),
            findingNumber: sessionStorage.getItem('findingNumber'),

            renderButtons: [],

            showUploadDocumentDialogBox: false,

            comments: ""

        }

    }

    handlerChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }


    showSuccess(message) {
        this.toast.show({ severity: 'success', summary: message, life: 3000 })
    }

    showError(message) {
        this.toast.show({ severity: 'error', summary: message, life: 3000 })
    }

    async componentDidMount() {
        let loginEcNo = localStorage.getItem("ecNo");
        let loginRole = localStorage.getItem('type');
        Apiservice.getRenderButtons(this.state.auditId, this.state.plantCode,
            this.state.findingNumber, loginEcNo, loginRole).then(
                (ress) => {

                    this.setState({
                        renderButtons: ress.data
                    })

                }
            )
    }

    rejectFunction() {

    }

    submitForClousureConfirmPopUp() {
        confirmDialog({
            message: 'Are you sure you want to submit NC closure?',
            header: 'NC Closure submission',
            icon: 'pi pi-exclamation-triangle',
            accept: () => this.submitForClosure(),
            reject: this.rejectFunction()
        })
    }

    submitForClosure = async () => {

        if (this.validationCheckForComments()) {

            let loginEcNo = JSON.parse(localStorage.getItem('ecNo'));
            let response = await Apiservice.submitForClosure(
                this.state.auditId,
                this.state.plantCode,
                this.state.findingNumber,
                this.state.comments,
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

    recommendClousureConfirmPopUp() {
        confirmDialog({
            message: 'Are you sure you want to recommend NC closure request?',
            header: 'Recommend NC Closure request',
            icon: 'pi pi-exclamation-triangle',
            accept: () => this.recommendClosure(),
            reject: this.rejectFunction()
        })
    }

    recommendClosure = async () => {

        if (this.validationCheckForComments()) {

            let loginEcNo = JSON.parse(localStorage.getItem('ecNo'));
            let response = await Apiservice.recommendClosure(
                this.state.auditId,
                this.state.plantCode,
                this.state.findingNumber,
                this.state.comments,
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

    approveClousureConfirmPopUp() {
        confirmDialog({
            message: 'Are you sure you want to approve NC closure request?',
            header: 'Approve NC Closure request',
            icon: 'pi pi-exclamation-triangle',
            accept: () => this.approveClosure(),
            reject: this.rejectFunction()
        })
    }

    approveClosure = async () => {

        if (this.validationCheckForComments()) {

            let loginEcNo = JSON.parse(localStorage.getItem('ecNo'));
            let response = await Apiservice.approveClosure(
                this.state.auditId,
                this.state.plantCode,
                this.state.findingNumber,
                this.state.comments,
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

    returnClousureConfirmPopUp() {
        confirmDialog({
            message: 'Are you sure you want to return NC closure request?',
            header: 'Return NC Closure request',
            icon: 'pi pi-exclamation-triangle',
            accept: () => this.returnClosure(),
            reject: this.rejectFunction()
        })
    }

    returnClosure = async () => {

        if (this.validationCheckForComments()) {

            let loginEcNo = JSON.parse(localStorage.getItem('ecNo'));
            let response = await Apiservice.returnClosure(
                this.state.auditId,
                this.state.plantCode,
                this.state.findingNumber,
                this.state.comments,
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

    validationCheckForComments() {

        if (this.state.comments === '') {
            this.showError("Comments cannot be empty");
            return false;
        }

        if (this.state.comments.length > 500) {
            this.showError("Max 500 characters allowed for Comments ");
            return false;
        }

        return true;
    }

    goToBackPage() {
        window.history.back();
    }

    showUploadDocumentDialog() {
        this.setState({
            showUploadDocumentDialogBox: true
        })

    }

    hideUploadDocumentDialog() {
        this.setState({
            showUploadDocumentDialogBox: false
        })
    }


    render() {
        return (

            <React.Fragment>

                <Toast ref={(el) => this.toast = el} />
                <Navigation />
                <div className="p-d-flex p-flex-column p-mt-1">
                    <div className="">
                        <div className="p-col-12">


                            <ISOAuditFindingDetailsView />
                            <ISOAuditFindingLogs />
                            <ISOAuditFindingAttachments />

                            {this.state.renderButtons.renderSaveCorrectiveActionButton ?
                                <SaveCorrectiveActionReport />
                                :
                                <React.Fragment>
                                    <Panel>
                                        <table className="table">
                                            <tbody>
                                                <tr>
                                                    <td><strong>Comments</strong></td>
                                                    <td>
                                                        <InputTextarea value={this.state.comments} name="comments"
                                                            onChange={this.handlerChange} autoResize style={{ width: 500 }} />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </Panel>

                                </React.Fragment>
                            }



                            {this.state.renderButtons.renderSubmitForClosureButton ?

                                <React.Fragment>
                                    <Button type="button" label="Upload Documents For Evidence"
                                        onClick={() => this.showUploadDocumentDialog()}
                                        className="p-button p-mr-2" />
                                    <Button type="button" label="Submit For Closure"
                                        onClick={() => this.submitForClousureConfirmPopUp()}
                                        className="p-button p-mr-2" />

                                </React.Fragment>
                                :
                                ""
                            }

                            {this.state.renderButtons.renderRecommendForClosureButton ?
                                <React.Fragment>
                                    <Button type="button" label="Recommend Closure"
                                        onClick={() => this.recommendClousureConfirmPopUp()}
                                        className="p-button p-mr-2" />

                                    <Button type="button" label="Return Closure"
                                        onClick={() => this.returnClousureConfirmPopUp()}
                                        className="p-button p-mr-2" />


                                </React.Fragment>
                                :
                                ""
                            }

                            {this.state.renderButtons.renderApproveClosureButton ?
                                <React.Fragment>
                                    <Button type="button" label="Approve Closure"
                                        onClick={() => this.approveClousureConfirmPopUp()}
                                        className="p-button p-mr-2" />

                                    <Button type="button" label="Return Closure"
                                        onClick={() => this.returnClousureConfirmPopUp()}
                                        className="p-button p-mr-2" />


                                </React.Fragment>
                                :
                                ""
                            }

                            <Button type="button" label="Back"
                                onClick={() => this.goToBackPage()}
                                className="p-button p-button-secondary p-mr-2" />


                            <Dialog header="Document Upload Dialog"
                                visible={this.state.showUploadDocumentDialogBox}
                                maximizable draggable={true} resizable={true}
                                style={{ width: '60vw' }}
                                onHide={() => this.hideUploadDocumentDialog()} >
                                <UploadDocuments />
                            </Dialog>




                        </div>
                    </div>
                </div>
            </React.Fragment>

        )
    }
}