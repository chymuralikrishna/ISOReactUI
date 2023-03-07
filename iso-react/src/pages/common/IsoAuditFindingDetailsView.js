import React from 'react'
import { Panel } from 'primereact/panel'
import Apiservice from '../../api/Apiservice'
import CommonFuctions from "../CommonFunctions/CommonFunctions";


export default class ISOAuditFindingDetailsView extends React.Component {

    constructor(props) {
        super(props)
        this.state = {

            auditId: sessionStorage.getItem('auditId'),
            plantCode: sessionStorage.getItem('plantCode'),
            findingNumber: sessionStorage.getItem('findingNumber'),

            auditDetails: [],
            isoAuditFinding: [],
            dnlFile: "",
            isFilePresent: false,

        }

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

        Apiservice.getISOAuditFindingDetails(this.state.auditId, this.state.plantCode, this.state.findingNumber).then(
            (ress) => {

                this.setState({
                    isoAuditFinding: ress.data
                })

                if (this.state.isoAuditFinding.dmsFileName) {

                    this.setState({
                        isFilePresent: true,
                        dnlFile: Apiservice.getDownloadFileFromDMSURL(this.state.isoAuditFinding.dmsFileName)
                    })


                }
            }
        )
    }

    render() {
        return (

            <React.Fragment>

                <Panel header="Audit Details">
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
                        </tbody>
                    </table>
                </Panel>


                <Panel header="Audit Finding Details">

                    <table className="table">
                        <tbody>
                            <tr>
                                <td><strong>ISO Standard</strong></td>
                                <td>{this.state.isoAuditFinding.isoStandard}</td>
                                <td><strong>Clause</strong></td>
                                <td>{this.state.isoAuditFinding.clause}</td>
                                <td><strong>ISO Audit Finding Type</strong></td>
                                <td>{this.state.isoAuditFinding.findingTypeId}</td>
                            </tr>
                            <tr>
                                <td><strong>Requirement</strong></td>
                                <td>{this.state.isoAuditFinding.requirement}</td>
                                <td><strong>Failure</strong></td>
                                <td>{this.state.isoAuditFinding.failure}</td>
                                <td><strong>Evidence</strong></td>
                                <td>{this.state.isoAuditFinding.evidence}</td>
                            </tr>
                            <tr>
                                <td><strong>Uploaded Document</strong></td>
                                <td><a href={this.state.dnlFile} target="_blank">{this.state.isoAuditFinding.dmsFileName}</a></td>
                                <td><strong>Document Description</strong></td>
                                <td>{this.state.isoAuditFinding.documentDescription}</td>
                            </tr>
                        </tbody>
                    </table>

                </Panel>

                {this.state.isoAuditFinding.correctiveActionFiled ?
                    <React.Fragment>
                        <Panel header="Corrective Action Report">

                            <table className="table">
                                <tbody>
                                    <tr>
                                        <td><strong>Proposed Correction</strong></td>
                                        <td>{this.state.isoAuditFinding.proposedCorrection}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Root Cause</strong></td>
                                        <td>{this.state.isoAuditFinding.rootCause}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Proposed Corrective Action</strong></td>
                                        <td>{this.state.isoAuditFinding.proposedCorrectiveAction}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Proposed Completion Date</strong></td>
                                        <td>{this.formatDate(this.state.isoAuditFinding.proposedCompletionDate)}</td>
                                    </tr>
                                </tbody>
                            </table>

                        </Panel>

                    </React.Fragment>
                    : ""

                }

            </React.Fragment>

        )
    }
}