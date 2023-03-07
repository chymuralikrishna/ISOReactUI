import React from 'react'
import { Redirect, Link } from 'react-router-dom'
import { Column } from "primereact/column";
import { DataTable } from 'primereact/datatable';
import Navigation from "../Navigation";
import Apiservice from "../../api/Apiservice";
import CommonFunctions from '../CommonFunctions/CommonFunctions';

export default class IsoAuditFindingsListPlant extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            loginEcNo: localStorage.getItem("ecNo"),
            isoAuditFindings: []
        }

        this.viewButton = this.viewButton.bind(this);
        this.onIndexTemplate = this.onIndexTemplate.bind(this)
        this.formatDate = this.formatDate.bind(this)
        this.auditDateTemplate = this.auditDateTemplate.bind(this)

    }


    async componentDidMount() {
        Apiservice.getISOAuditFindingsListForManagingPlants(this.state.loginEcNo).then(
            (res) => {
                this.setState({
                    isoAuditFindings: res.data
                })
            }
        )
    }

    formatDate(value) {
        if (value)
            return CommonFunctions.getDateInDDMMYYYYFormat(value);

        return "";
    }

    onIndexTemplate(data, props) {
        return props.rowIndex + 1
    }

    auditDateTemplate(rowData) {
        return this.formatDate(rowData['auditDate']);
    }

    plantTemplate(rowData) {
        return (
            <React.Fragment>
                <span>{rowData.plantName}-{rowData.plantCode}</span>
            </React.Fragment>
        )
    }

    viewButton(rowData) {
        const shoot = () => {
            sessionStorage.setItem("auditId", rowData.auditId)
            sessionStorage.setItem("plantCode", rowData.plantCode)
            sessionStorage.setItem("findingNumber", rowData.findingNumber)
        }

        return (
            <React.Fragment>
                <Link onClick={shoot} to='/ISOAuditFindingDetails' className="p-button p-mr-2">View</Link>
            </React.Fragment>
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
                    <Navigation />
                    <DataTable value={this.state.isoAuditFindings} header="ISO Audit Findings List"
                        removableSort emptyMessage="No Data Found" className="p-datatable-sm p-shadow-2 p-mx-2 p-my-2"
                        showGridlines rows={20} rowsPerPageOptions={[5, 10, 20, 50]} paginator  >
                        <Column field="Index" header="Sno" body={this.onIndexTemplate} style={{ width: '3%' }} />
                        <Column field="auditId" header="Audit ID"
                            sortable filter filterPlaceholder="Search" filterMatchMode="contains" />
                        <Column field="auditDate" body={this.auditDateTemplate} header="Audit Date"
                            sortable filter filterPlaceholder="Search" filterMatchMode="contains" />
                        <Column field="plantCode" body={this.plantTemplate} header="Plant"
                            sortable filter filterPlaceholder="plant code" filterMatchMode="contains" />
                        {/* <Column field="findingNumber" header="Finding Number"
                            sortable filter filterPlaceholder="Search" filterMatchMode="contains" /> */}
                        <Column field="isoAuditFindingType" header="Iso Audit Finding Type"
                            sortable filter filterPlaceholder="Search" filterMatchMode="contains" />
                        <Column field="isoStandard" header="Iso Standard"
                            sortable filter filterPlaceholder="Search" filterMatchMode="contains" />
                        <Column field="clause" header="Clause"
                            sortable filter filterPlaceholder="Search" filterMatchMode="contains" />
                        {/* <Column field="requirement" header="Requirement"
                            sortable filter filterPlaceholder="Search" filterMatchMode="contains" />
                        <Column field="failure" header="Failure"
                            sortable filter filterPlaceholder="Search" filterMatchMode="contains" /> */}
                        <Column field="status" header="Status"
                            sortable filter filterPlaceholder="Search" filterMatchMode="contains" />
                        <Column body={this.viewButton} header="Actions" />

                    </DataTable>
                </React.Fragment>
            )
        }
    }
}