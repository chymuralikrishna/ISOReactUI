import React from 'react'
import { Link } from 'react-router-dom';
import Apiservice from '../../api/Apiservice'
import { DataTable } from 'primereact/datatable';
import { Column } from "primereact/column";

export default class ISOAuditFindingAttachments extends React.Component {

    constructor(props) {
        super(props)
        this.state = {

            auditId: sessionStorage.getItem('auditId'),
            plantCode: sessionStorage.getItem('plantCode'),
            findingNumber: sessionStorage.getItem('findingNumber'),

            auditFindingAttachments: []

        }

        this.onIndexTemplate = this.onIndexTemplate.bind(this)


    }

    onIndexTemplate(data, props) {
        return props.rowIndex + 1
    }

    componentDidMount = async () => {

        Apiservice.getDocumentDetailsList(this.state.auditId, this.state.plantCode, this.state.findingNumber).then(
            (ress) => {
                this.setState({
                    auditFindingAttachments: ress.data
                })
            }
        )

    }

    documentBody(rowData) {

        const docDownloadButton = () => {
            window.location.href = Apiservice.getDownloadFileFromDMSURL(rowData.dmsFileName);
        }


        return (
            <React.Fragment>
                <Link onClick={() => docDownloadButton()} >{rowData.dmsFileName}</Link>
            </React.Fragment>
        )
    }


    render() {
        return (
            <React.Fragment>
                <div className="datatable-filter-demo">
                    <DataTable value={this.state.auditFindingAttachments} header="Attachments"
                        removableSort
                        emptyMessage="No Attachments" className="p-datatable-sm p-shadow-2 p-mb-2"
                        showGridlines rows={20} rowsPerPageOptions={[5, 10, 20, 50]} paginator >
                        <Column field="Index" header="Sno" body={this.onIndexTemplate} style={{ width: '3%' }} />
                        <Column field="description" header="Document Description"
                            sortable filter filterPlaceholder="Search" filterMatchMode="contains" />
                        <Column field="dmsFileName" header="Document" body={this.documentBody}
                            sortable filter filterPlaceholder="Search" filterMatchMode="contains" />
                    </DataTable>
                </div>

            </React.Fragment>
        )
    }
}