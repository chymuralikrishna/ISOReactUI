import React from 'react'
import Apiservice from '../../api/Apiservice'
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from 'primereact/toast';

export default class EditPopup extends React.Component {

    constructor(props) {
        super(props)
        this.state = {

            auditId: sessionStorage.getItem('auditId'),
            plantCode: sessionStorage.getItem('plantCode'),
            findingNumber: sessionStorage.getItem('findingNumber'),

            isoStandard: "",
            clause: "",
            isoAuditFindingType: "",
            requirement: "",
            failure: "",
            evidence: "",
            documentDescription: "",
            dmsFileName: "",

            isFilePresent: false,
            dnlFile: "",
        }


    }

    async componentDidMount() {
        Apiservice.getISOAuditFindingDetails(this.state.auditId, this.state.plantCode, this.state.findingNumber).then(
            (ress) => {

                this.setState({
                    isoStandard: ress.data.isoStandard,
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



    render() {
        return (
            <React.Fragment>
                <Toast ref={(el) => this.toast = el} />

                <form>
                    <div className="p-fluid p-formgrid p-grid">
                        <div className="p-field p-col-4  p-mb-1">
                            <label>ISO Standard<sup style={{ color: 'red' }}>&lowast;</sup></label>
                            <InputText value={this.state.isoStandard} disabled />
                        </div>
                        <div className="p-field p-col-4 p-mb-1">
                            <label>Clause<sup style={{ color: 'red' }}>&lowast;</sup></label>
                            <InputText value={this.state.clause} disabled />
                        </div>
                        <div className="p-field p-col-4 p-mb-1">
                            <label>ISO Audit Finding Type<sup style={{ color: 'red' }}>&lowast;</sup></label>
                            <InputText value={this.state.isoAuditFindingType} disabled />
                        </div>
                        <div className="p-field p-col-4 p-mb-0">
                            <label>Requirement<sup style={{ color: 'red' }}>&lowast;</sup></label>
                            <InputTextarea value={this.state.requirement} disabled />
                        </div>
                        <div className="p-field p-col-4 p-mb-0">
                            <label>Failure<sup style={{ color: 'red' }}>&lowast;</sup></label>
                            <InputTextarea value={this.state.failure} disabled />
                        </div>
                        <div className="p-field p-col-4 p-mb-2">
                            <label>Evidence<sup style={{ color: 'red' }}>&lowast;</sup></label>
                            <InputTextarea value={this.state.evidence} disabled />
                        </div>
                        <div className="p-field p-col-6">
                            {this.state.isFilePresent ?
                                <React.Fragment>
                                    <span>
                                        <label>Uploaded File</label>
                                        <a href={this.state.dnlFile} target="_blank">{this.state.dmsFileName}</a>
                                    </span>
                                    <br />
                                </React.Fragment> : ''}
                        </div>
                        <div className="p-field p-col-6 p-mb-0">
                            {this.state.isFilePresent ?
                                <React.Fragment>
                                    <label>Document Description<sup style={{ color: 'red' }}>&lowast;</sup></label>
                                    <InputTextarea value={this.state.documentDescription} disabled />
                                </React.Fragment>
                                : ''}
                        </div>
                    </div>

                </form>

            </React.Fragment>
        )
    }
}