import React from 'react'

import { Button } from 'primereact/button'
import Apiservice from '../../api/Apiservice'
import { Toast } from 'primereact/toast';

import { InputTextarea } from "primereact/inputtextarea";

export default class UploadDocuments extends React.Component {

    constructor(props) {
        super(props)
        this.state = {

            auditId: sessionStorage.getItem('auditId'),
            plantCode: sessionStorage.getItem('plantCode'),
            findingNumber: sessionStorage.getItem('findingNumber'),

            documentDescription: "",

            docError: "",
            descpError: ""

        }

        this.saveDocumentDetails = this.saveDocumentDetails.bind(this);

    }

    handlerChangePopUp = (e) => {
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



    onFileChange = e => {

        let selectedFile = e.target.files
        let fileName = ""

        if (selectedFile.length > 0) {
            let fileToLoad = selectedFile[0]
            fileName = fileToLoad.name
            let fileReader = new FileReader()
            fileReader.onload = (fileLoadedEvent) => {
                this.setState({ fileBytes: fileLoadedEvent.target.result.split(';base64,')[1] });
            }
            fileReader.readAsDataURL(fileToLoad)
        }
        this.setState({
            selectedFile: e.target.files[0],
            fileName: fileName
        })
    }

    saveDocumentDetails = async (e) => {

        this.setState({
            docError: "",
            descpError: ""
        })

        if (this.popvalid()) {

            let response = await Apiservice.dmsUpload(
                this.state.fileBytes,
                this.state.fileName
            );

            if (response.data.status == 1) {

                let loginEcNo = localStorage.getItem('ecNo');
                let res = await Apiservice.saveDocumentDetails(
                    this.state.auditId,
                    this.state.plantCode,
                    this.state.findingNumber,
                    this.state.documentDescription,
                    response.data.dmsFileName,
                    response.data.dmsTokenId,
                    loginEcNo
                );

                if (res.data.result == 1) {
                    this.showSuccess("Document Details Saved Successfully");
                    window.location.reload();
                } else {
                    this.showError("Error occured while saving document details");
                }

            } else {
                this.showError("Error occured while uploading document");
            }
        }
    }

    popvalid() {

        let result = true;

        let file = document.getElementById('file');
        if (file.files.length == 0) {
            this.setState({
                docError: "Please select a file to upload"
            })

            result = false;
        }


        if (this.state.documentDescription === '') {
            this.setState({
                descpError: "Please enter description"
            })

            result = false;
        }

        if (this.state.documentDescription.length > 100) {
            this.setState({
                descpError: "Max 100 characters allowed for Document Description "
            })

            result = false;

        }


        return result;
    }


    render() {
        return (
            <React.Fragment>
                <Toast ref={(el) => this.toast = el} />
                <div className="p-fluid p-formgrid p-grid">
                    <div className="p-field p-col-6">
                        <small style={{ color: 'red' }}>{this.state.docError}</small>
                        <label>Document  </label>
                        &nbsp;&nbsp;&nbsp;
                        <div style={{ display: "inline-block" }}>
                            <input type="file" onChange={this.onFileChange} id="file" />
                        </div>
                    </div>
                    <div className="p-field p-col-6 p-mb-0">
                        <label>Document Description</label>
                        <InputTextarea value={this.state.documentDescription} name="documentDescription"
                            onChange={this.handlerChangePopUp} rows={1} />
                        <small style={{ color: 'red' }}>{this.state.descpError}</small>
                    </div>
                </div>
                <div className="p-field p-text-center">
                    <Button onClick={() => this.saveDocumentDetails()} style={{ width: "auto" }} label="upload" type="button" />
                </div>


            </React.Fragment>
        )
    }
}