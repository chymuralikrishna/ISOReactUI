import React, { Component } from "react";
import { Redirect, Link } from 'react-router-dom';
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import Apiservice from "../../api/Apiservice";
import Navigation from "../Navigation";
import { Toast } from 'primereact/toast';

export default class AddIsoRole extends Component {


    constructor(props) {
        super(props)

        this.state = {

            createdBy: JSON.parse(localStorage.getItem("ecNo")),
            forUnitCode: JSON.parse(localStorage.getItem("unitCode")),

            officersList: [],
            auditorEcNo: null,
            isoRoles: [],
            role: "",

        }

    }

    handlerChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }


    showSuccess(e) {
        this.toast.show({ severity: 'success', summary: 'Record Saved', detail: 'Role details updated', life: 3000 })
    }

    async componentDidMount() {
        Apiservice.isoRolesList().then(
            (response) => {
                this.setState({
                    isoRoles: response.data
                })
            }
        )

        const getUnitCode = localStorage.getItem("unitCode")

        Apiservice.getOfficersListInUnit(getUnitCode).then(
            (result) => {
                this.setState({
                    officersList: result.data
                })
            }
        )


    }

    handlerSubmit = (e) => {
        e.preventDefault();

        Apiservice.createIsoRole(this.state.auditorEcNo, this.state.createdBy, this.state.forUnitCode, this.state.role).then(
            res => {
                this.showSuccess(res);
            }
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
                        <div className="p-mb-2 p-mx-2">
                            <h1 style={{ fontSize: "20px", margin: "10px 0" }}>Add ISO Roles</h1>
                        </div>
                        <Card className="p-mb-2 p-mx-2 p-shadow-3">
                            <form onSubmit={this.handlerSubmit}>
                                <div className="p-fluid p-formgrid p-grid">
                                    
                                    <div className="p-field p-col-3">
                                        <div className="p-mb-2">
                                            <label>Officer Name<sup style={{ color: 'red' }}>&lowast;</sup></label>
                                            <Dropdown value={this.state.auditorEcNo} name="auditorEcNo"
                                                options={this.state.officersList}
                                                onChange={(e) => this.setState({ auditorEcNo: e.value })}
                                                optionLabel="displayName" optionValue="ecNo"
                                                placeholder="Select" filter filterBy="displayName" />
                                            <small style={{ color: 'red' }}>{this.state.aeError}</small>
                                        </div>
                                    </div>
                                    <div className="p-field p-col-3">
                                        <div className="p-mb-2">
                                            <label>Role<sup style={{ color: 'red' }}>&lowast;</sup></label>
                                            <Dropdown value={this.state.role} options={this.state.isoRoles}
                                                name="role"
                                                onChange={(e) => this.setState({ role: e.value })}
                                                optionLabel="displayLabel" optionValue="objectValue"
                                                placeholder="select role" />

                                            <small style={{ color: 'red' }}>{this.state.roleError}</small>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-mb-2">
                                    <Button label="Add" type="submit" />
                                    <Link to="/isorolelist" className="p-button p-button-secondary p-ml-2">Back</Link>
                                </div>
                            </form>
                        </Card>
                    </div>
                </React.Fragment>
            )
        }
    }

}

