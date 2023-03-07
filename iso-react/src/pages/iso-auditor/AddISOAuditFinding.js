import React from 'react'
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button'
import Apiservice from '../../api/Apiservice'
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from 'primereact/toast';

export default class EditPopup extends React.Component {

    constructor(props) {
        super(props)
        this.state = {

            isSaveDialog: sessionStorage.getItem('isSaveDialog'),
            auditId: sessionStorage.getItem('auditId'),
            plantCode: sessionStorage.getItem('plantCode'),
            findingNumber: sessionStorage.getItem('findingNumber'),

            isoStandard: [],
            clause: "",
            isoAuditFindingType: "",
            requirement: "",
            failure: "",
            evidence: "",
            documentDescription: "",
            dmsFileName: "",
            dmsTokenId: "",

            isostdError: "",
            claError: "",
            isofndError: "",
            reqError: "",
            falError: "",
            eviError: "",
            descpError: "",

            isFilePresent: false,
            uploadStatus: "",
            isLoading2: false,

            docError: "",
            docData: [],
            dnlFile: "",
        }

        this.isoStandards = [
            { name: 'QMS', code: 'QMS' },
            { name: 'EMS', code: 'EMS' },
            { name: 'OHSMS', code: 'OHSMS' },
        ]

        this.isoFindingTypes = [
            { name: 'NC', code: 'NC' },
            { name: 'O', code: 'O' },
            { name: 'OI', code: 'OI' },
        ]

        this.saveISOAuditFinding = this.saveISOAuditFinding.bind(this);

    }

    componentDidMount = async () => {

        if (this.state.isSaveDialog === 'no') {
            Apiservice.getISOAuditFindingDetails(this.state.auditId, this.state.plantCode, this.state.findingNumber).then(
                (ress) => {

                    this.setState({
                        isoStandard: ress.data.isoStandard.split(","),
                        clause: ress.data.clause,
                        isoAuditFindingType: ress.data.findingTypeId,
                        requirement: ress.data.requirement,
                        failure: ress.data.failure,
                        evidence: ress.data.evidence,
                        dmsFileName: ress.data.dmsFileName,
                        documentDescription: ress.data.description,
                    })

                    if (this.state.dmsFileName) {

                        this.setState({
                            isFilePresent: true,
                            dnlFile: Apiservice.getDownloadFileFromDMSURL(this.state.dmsFileName)
                        })

                    }
                }
            )
        }
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

    popvalid() {
        if (this.state.isoStandard === '') {
            this.setState({
                isostdError: "Please select ISO Standard."
            })
        } else if (this.state.clause === '') {
            this.setState({
                claError: "Please enter Clause."
            })
        } else if (this.state.isoAuditFindingType === '') {
            this.setState({
                isofndError: "Please select ISO Findings Type."
            })
        } else if (this.state.requirement === '') {
            this.setState({
                reqError: "Please enter requirement."
            })
        } else if (this.state.failure === '') {
            this.setState({
                falError: "Please enter failure."
            })
        } else if (this.state.evidence === '') {
            this.setState({
                eviError: "Please enter evidence."
            })
        } else if (this.state.isFilePresent && this.state.documentDescription === '') {
            this.setState({
                descpError: "Please enter description"
            })
        } else {
            return true
        }
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

    onFileUpload = (e) => {

        let file = document.getElementById('file')

        if (file.files.length == 0) {
            this.setState({
                isLoading2: false,
                docError: "Please select a file to upload"
            })
        } else {
            Apiservice.dmsUpload(
                this.state.fileBytes,
                this.state.fileName
            ).then(
                (response) => {
                    this.setState({
                        isLoading2: true
                    })
                    if (response.data.status === 0) {
                        this.setState({ uploadStatus: "Upload Failed!.. Try re-uploading proper file.", })
                    } else if (response.data.status === 1) {

                        this.setState({
                            isFilePresent: true,
                            uploadStatus: "Uploaded File:",
                            isLoading2: false,
                            docData: response.data,
                            dmsFileName: response.data.dmsFileName
                        })

                        this.setState({
                            dnlFile: Apiservice.getDownloadFileFromDMSURL(this.state.dmsFileName)
                        })


                    }
                }
            )
        }
    }

    saveISOAuditFinding = async () => {


        this.setState({
            isostdError: '',
            claError: '',
            isofndError: '',
            reqError: '',
            falError: '',
            eviError: '',
            docError: '',
            descpError: ''
        })
        if (this.popvalid()) {

            this.state.auditId = sessionStorage.getItem('auditId')
            this.state.plantCode = sessionStorage.getItem('plantCode')
            this.state.loginEcNo = localStorage.getItem('ecNo')

            let isSaveDialog = sessionStorage.getItem('isSaveDialog');
            let response;
            console.log(isSaveDialog);
            if (isSaveDialog === 'yes') {
                console.log("save api");
                response = await Apiservice.saveISOAuditFindingByAuditor(
                    this.state.auditId,
                    this.state.clause,
                    this.state.dmsFileName,
                    this.state.documentDescription,
                    this.state.evidence,
                    this.state.failure,
                    this.state.isoAuditFindingType,
                    this.state.isoStandard.toString(),
                    this.state.loginEcNo,
                    this.state.plantCode,
                    this.state.requirement,
                )

                if (response.data.result === 0) {
                    this.showError(response.data.message);
                } else {
                    this.showSuccess(response.data.message);
                    window.location.reload()
                }

            } else if (isSaveDialog === 'no') {
                console.log("update api");
                response = await Apiservice.updateISOAuditFindingByAuditor(
                    this.state.auditId,
                    this.state.clause,
                    this.state.dmsFileName,
                    this.state.documentDescription,
                    this.state.evidence,
                    this.state.failure,
                    this.state.isoAuditFindingType,
                    this.state.isoStandard.toString(),
                    this.state.loginEcNo,
                    this.state.plantCode,
                    this.state.requirement,
                    this.state.findingNumber
                )

                if (response.data.result === 0) {
                    this.showError(response.data.message);
                } else {
                    this.showSuccess(response.data.message);
                    window.location.reload()
                }

            }



        }
    }

    render() {
        return (
            <React.Fragment>
                <Toast ref={(el) => this.toast = el} />

                <form>
                    <div className="p-fluid p-formgrid p-grid">
                        <div className="p-field p-col-4  p-mb-1">
                            <label>ISO Standard<sup style={{ color: 'red' }}>&lowast;</sup></label>
                            <MultiSelect value={this.state.isoStandard} name="isoStandard"
                                options={this.isoStandards}
                                optionLabel="name" optionValue="code"
                                onChange={this.handlerChangePopUp}
                                filter filterBy="name"
                                placeholder="Select ISO Standards" />
                            <small style={{ color: 'red' }}>{this.state.isostdError}</small>
                        </div>
                        <div className="p-field p-col-4 p-mb-1">
                            <label>Clause<sup style={{ color: 'red' }}>&lowast;</sup></label>
                            <InputText value={this.state.clause} name="clause"
                                onChange={this.handlerChangePopUp} />
                            <small style={{ color: 'red' }}>{this.state.claError}</small>
                        </div>
                        <div className="p-field p-col-4 p-mb-1">
                            <label>ISO Audit Finding Type<sup style={{ color: 'red' }}>&lowast;</sup></label>
                            <Dropdown value={this.state.isoAuditFindingType} name="isoAuditFindingType"
                                options={this.isoFindingTypes} onChange={this.handlerChangePopUp}
                                optionLabel="name" optionValue="code"
                                filter filterBy="name"
                                placeholder="Select ISO Findings Type" />
                            <small style={{ color: 'red' }}>{this.state.isofndError}</small>
                        </div>
                        <div className="p-field p-col-4 p-mb-0">
                            <label>Requirement<sup style={{ color: 'red' }}>&lowast;</sup></label>
                            <InputTextarea value={this.state.requirement} name="requirement"
                                onChange={this.handlerChangePopUp} rows={2} />
                            <small style={{ color: 'red' }}>{this.state.reqError}</small>
                        </div>
                        <div className="p-field p-col-4 p-mb-0">
                            <label>Failure<sup style={{ color: 'red' }}>&lowast;</sup></label>
                            <InputTextarea value={this.state.failure} name="failure"
                                onChange={this.handlerChangePopUp} rows={2} />
                            <small style={{ color: 'red' }}>{this.state.falError}</small>
                        </div>
                        <div className="p-field p-col-4 p-mb-2">
                            <label>Evidence<sup style={{ color: 'red' }}>&lowast;</sup></label>
                            <InputTextarea value={this.state.evidence} name="evidence"
                                onChange={this.handlerChangePopUp} rows={2} />
                            <small style={{ color: 'red' }}>{this.state.eviError}</small>
                        </div>
                        <div className="p-field p-col-6">
                            <small style={{ color: 'red' }}>{this.state.docError}</small>
                            {this.state.isFilePresent ?
                                <React.Fragment>
                                    <span>
                                        <small style={{ color: 'green' }}>{this.state.uploadStatus}</small>
                                        <a href={this.state.dnlFile} target="_blank">{this.state.dmsFileName}</a>
                                    </span>
                                    <br />
                                </React.Fragment> : ''}
                            <div style={{ display: "inline-block" }}>
                                {this.state.isLoading2 ? <ProgressSpinner style={{ width: "50px", height: "50px" }}
                                    strokeWidth="5" animationDuration="0.5s" /> : ""}

                                <input type="file" onChange={this.onFileChange} id="file" />
                                <Button onClick={this.onFileUpload} style={{ width: "auto" }} label="upload" type="button" />
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
                        <hr />
                        <Button type="button" label="Save" onClick={() => this.saveISOAuditFinding()}
                            className="p-button p-mr-2" />
                    </div>
                </form>

            </React.Fragment>
        )
    }
}