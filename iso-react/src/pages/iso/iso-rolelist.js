import React, { Component } from "react";
import { Redirect, Link } from 'react-router-dom';
import { Column } from "primereact/column";
import { DataTable } from 'primereact/datatable';
import Navigation from "../Navigation";
import Apiservice from "../../api/Apiservice";
import { confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";


export default class IsoRoleList extends Component {

    constructor(props) {
        super(props)



        this.state = {

            unitCode: JSON.parse(localStorage.getItem("unitCode")),
            isoDetails: []
        }


        this.delBtn = this.delBtn.bind(this)
        this.accept = this.accept.bind(this)
        this.reject = this.reject.bind(this)
        this.deleteConfirm = this.deleteConfirm.bind(this)

        this.onIndexTemplate = this.onIndexTemplate.bind(this)


    }

    onIndexTemplate(data, props) {
        return props.rowIndex + 1
    }

    officerNameFormat(rowData) {
        return (
            <React.Fragment>
                <span>{rowData.auditorName}, ({rowData.auditorEcNo})</span>
            </React.Fragment>
        )
    }

    plantFormat(rowData) {
        return (
            <React.Fragment>
                <span>{rowData.plantName}, ({rowData.plantCode})</span>
            </React.Fragment>
        )
    }

    async componentDidMount() {
        Apiservice.getIsoRoleDetails(this.state.unitCode).then(
            (res) => {
                this.setState({
                    isoRoleDetails: res.data
                })
            }
        )
    }

    accept(auditorEcNo, role) {
        Apiservice.deleteRole(auditorEcNo, role).then()
        window.location.reload()
    }

    reject() {
        this.toast.show({ severity: 'info', summary: 'Rejected', detail: 'You have rejected', life: 3000 })
    }

    deleteConfirm = (auditorEcNo, role) => {
        confirmDialog({
            message: 'Do you want to delete this record?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept: () => this.accept(auditorEcNo, role),
            reject: () => this.reject()
        })

    }


    delBtn(rowData) {
        return <i className="pi pi-trash" style={{ color: 'red' }}
            onClick={() => this.deleteConfirm(rowData.auditorEcNo, rowData.role)} ></i>
    }


    render() {

        const loggedIn = localStorage.getItem('ecNo')

        if (loggedIn === null) {
            return <Redirect to='/' />
        }
        else {

            return (
                <React.Fragment>
                    <Navigation />
                    <Toast ref={(el) => this.toast = el} />
                    <div className="p-d-flex p-flex-column ">
                        <div className="p-d-flex p-jc-between p-mb-0 p-mx-2">
                            <div> <h1 style={{ fontSize: "20px", margin: "10px 0" }}></h1></div>
                            <div >
                                <Link to={"/add-isorole"} className="p-button p-button-sm p-my-2">Create ISO Roles</Link>
                            </div>
                        </div>

                        <div className="p-mb-2 p-mx-2">
                            <div className="datatable-filter-demo">
                                <DataTable value={this.state.isoRoleDetails} header="ISO Roles"
                                    emptyMessage="No Data Found" className="p-datatable-sm p-shadow-2 p-mb-4"
                                    showGridlines rows={20} rowsPerPageOptions={[5, 10, 20, 50]} paginator >
                                    <Column field="Index" header="Sno" body={this.onIndexTemplate} style={{ width: '3%' }} />
                                    <Column field="auditorName" body={this.officerNameFormat} header="Officer Name"
                                        sortable filter filterPlaceholder="Search" filterMatchMode="contains" />
                                    <Column field="plantName" body={this.plantFormat} header="Plant"
                                        sortable filter filterPlaceholder="Search" filterMatchMode="contains" />
                                    <Column field="role" header="Role"
                                        sortable filter filterPlaceholder="Search" filterMatchMode="contains" />
                                    <Column header="Actions" body={this.delBtn} />
                                </DataTable>
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            )
        }
    }
}