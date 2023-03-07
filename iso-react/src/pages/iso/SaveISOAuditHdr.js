import React, { Component } from "react";
import { Redirect, Link } from 'react-router-dom';
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import moment from "moment";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import Apiservice from "../../api/Apiservice";
import Navigation from "../Navigation";
import { Toast } from 'primereact/toast';

export default class SaveISOAuditHdr extends Component {


    constructor(props) {
        super(props)

        this.state = {
            auditId: sessionStorage.getItem('audit_id'),
            auditAgency: "",
            auditType: "Internal",
            startDate: new Date(),
            endDate: "",
            auditComments: "",
            status: "Open",
            createdBy: JSON.parse(localStorage.getItem("ecNo")),
            loginEcNo: JSON.parse(localStorage.getItem("ecNo")),
            unitCode: 101,
            aaError: '',
            atError: '',
            sdError: '',
            edError: '',
            acError: '',

        }

    }

    componentDidMount = async () => {
        const auditId = this.state.auditId;

        if (auditId != '') {
            console.log(auditId);
            const res = await Apiservice.getAuditIdDetails(auditId)

            this.setState({

                auditId: res.data.auditId,
                auditAgency: res.data.auditAgency,
                auditComments: res.data.auditComments,
                startDate: new Date(res.data.startDate),
                endDate: new Date(res.data.endDate),
                auditType: res.data.auditType,
                status: res.data.status,
                loginEcNo: JSON.parse(localStorage.getItem("ecNo"))
            })
        }

    }

    valid() {




        if (this.state.auditAgency.length > 20) {
            this.setState({
                aaError: "Max Length should be 20 Characters only"
            })
        }
        else if (this.state.auditComments.length > 70) {
            this.setState({
                acError: "Max Length should be 70 Characters only"
            })
        }
        else if (this.state.endDate === '') {
            this.setState({
                edError: "End Date Required"
            })
        } else if (this.state.auditType === '') {
            this.setState({
                atError: "Audit Type Required"
            })
        }
        else {

            let wlsdt = this.state.startDate
            let wled = this.state.endDate
            if (new Date(wlsdt) > new Date(wled)) {
                this.showError("End date must be greater than start date.");
                return false;
            }

            return true
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

    handlerSubmit = async (e) => {
        e.preventDefault();

        this.setState({
            aaError: '',
            acError: '',
            edError: '',
            atError: ''
        })
        if (this.valid()) {

            if (this.state.auditId == '') {
                Apiservice.saveISOAuditHdr(this.state).then(
                    res => {
                        if (res.data.result > 0) { this.showSuccess(res.data.message); }
                        else { this.showError(res.data.message); }

                        this.setState(
                            {
                                auditId: res.data.auditId
                            })

                    }
                )
            } else {
                Apiservice.updateISOAuditHdr(this.state).then(
                    res => {
                        if (res.data > 0)
                            this.showSuccess("Audit Details Updated Successfully");
                        else
                            this.showError("Error occured while updating Audit Details");
                    }
                )
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
                        <div className="p-mb-2 p-mx-4">
                            <h1 style={{ fontSize: "20px", marginTop: "10px" }}>Create ISO Audit</h1>
                        </div>
                        <Card className="p-mb-2 p-mx-4 p-shadow-3 p-mb-3">
                            <form onSubmit={this.handlerSubmit}>
                                <div className="p-mb-2">
                                    <label>Audit Id:-</label>
                                    <label>{this.state.auditId}</label>
                                </div>
                                <div className="p-fluid p-formgrid p-grid">

                                    <div className="p-field p-col">

                                        <div className="p-mb-2">
                                            <label>Audit Type<sup style={{ color: 'red' }}>&lowast;</sup></label>
                                            <select multiple={false} name="auditType" className="form-control"
                                                value={this.state.auditType}
                                                onChange={this.handlerChange}>
                                                <option>Internal</option>
                                                <option>External</option>
                                            </select>
                                            <small style={{ color: 'red' }}>{this.state.atError}</small>
                                        </div>

                                        <div className="p-mb-2">
                                            <label>Audit Agency</label>
                                            <InputText type="text" name="auditAgency"
                                                value={this.state.auditAgency}
                                                maxlength="20" onChange={this.handlerChange}
                                                placeholder="Enter Audit Agency" />
                                            <small style={{ color: 'red' }}>{this.state.aaError}</small>
                                        </div>

                                        <div className="p-mb-2">
                                            <label>Audit Comments</label>
                                            <InputTextarea name="auditComments" maxlength="70"
                                                value={this.state.auditComments}
                                                placeholder="Enter Audit Comments"
                                                rows="4" onChange={this.handlerChange} />
                                            <small style={{ color: 'red' }}>{this.state.acError}</small>
                                        </div>
                                    </div>
                                    <div className="p-field p-col">
                                        <div className="p-mb-2">
                                            <label>Start Date<sup style={{ color: 'red' }}>&lowast;</sup></label>
                                            <Calendar dateFormat="dd-mm-yy" readOnlyInput value={this.state.startDate}
                                                onChange={(e) => this.setState({ startDate: e.value })}
                                                showIcon monthNavigator yearNavigator yearRange="1980:2070"
                                                required="required" />
                                        </div>
                                        <div className="p-mb-2">
                                            <label>Status<sup style={{ color: 'red' }}>&lowast;</sup></label>
                                            <select multiple={false} name="status" className="form-control"
                                                value={this.state.status}
                                                onChange={this.handlerChange}>
                                                <option>Open</option>
                                                <option>Closed</option>
                                            </select>
                                            <small style={{ color: 'red' }}>{this.state.atError}</small>
                                        </div>

                                    </div>
                                    <div className="p-field p-col">
                                        <div className="p-mb-2">
                                            <label>End Date<sup style={{ color: 'red' }}>&lowast;</sup></label>
                                            <Calendar dateFormat="dd-mm-yy" readOnlyInput
                                                value={this.state.endDate}
                                                onChange={(e) => this.setState({ endDate: e.value })}
                                                showIcon monthNavigator yearNavigator yearRange="1980:2070" 
                                                placeholder="Select End Date" />
                                            <small style={{ color: 'red' }}>{this.state.edError}</small>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-mb-2">
                                    <Button label="Save" type="submit" />
                                    <Link to="/viewisolist" className="p-button p-button-secondary p-ml-2">Back</Link>
                                </div>
                            </form>
                        </Card>
                    </div>
                </React.Fragment>
            )
        }
    }

}

