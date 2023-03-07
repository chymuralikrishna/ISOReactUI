import React, { Component } from 'react';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import Apiservice from '../api/Apiservice';


export default class Navigation extends Component {


    logOut() {
        Apiservice.logout();
    }


    render() {

        const type = localStorage.getItem('type')

        const items = [
            {
                label: 'Home',
                icon: 'pi pi-fw pi-home',
                url: '#/dashboard'
            }

        ];

        if (type === 'ISO INCHARGE') {
            items.push(
                {
                    label: 'ISO List',
                    items: [
                        {
                            label: 'Audit List',
                            url: '#/viewisolist'
                        },
                        {
                            label: 'Audit Summary List',
                            url: '#/IsoAuditFindingsSummaryList'
                        }
                    ]
                },
                {
                    label: 'ISO Roles Management',
                    items: [
                        {
                            label: 'ISO Roles',
                            url: '#/isorolelist'
                        }
                    ]
                }
            )
        } else if (type === 'ISO AUDITOR') {
            items.push(
                {
                    label: 'ISO Audit Detail',
                    items: [
                        {
                            label: 'Create New',
                            url: '#/addISOAuditDetails'
                        },
                        {
                            label: 'Audit List',
                            url: '#/IsoAuditDetailsList'
                        },
                        {
                            label: 'Audit Summary List',
                            url: '#/IsoAuditFindingsSummaryList'
                        }

                    ]
                }
            )
        } else if (type === 'PLANT') {
            items.push(
                {
                    label: 'ISO Audit Details',
                    items: [
                        {
                            label: 'ISO Audit Details',
                            url: '#/isoAuditList'
                        },
                        {
                            label: 'ISO Audit Findings List',
                            url: '#/isoAuditFindingsListPlant'
                        }
                    ]
                },
                {
                    label: 'ISO Audit Findings Details',
                    items: [
                        {
                            label: 'Audit Summary List',
                            url: '#/IsoAuditFindingsSummaryList'
                        }
                    ]
                }
            )
        }

        return (
            <div className="p-shadow-3">
                <Menubar
                    model={items}
                    start={<img alt="logo" src="http://website.nfc.gov.in/images/nfc.png" height="40" className="p-mr-2"></img>}
                    end={
                        [
                            <div className="p-adj" style={{ color: "red" }}>{localStorage.getItem('env')}</div>,
                            <div className="p-adj">{localStorage.getItem("user")},  {localStorage.getItem("grade")},  {localStorage.getItem("plantDescription")}</div>,
                            <Button label="" className="p-button-sm" onClick={this.logOut} icon="pi pi-power-off" />
                        ]
                    }
                />
            </div>
        );
    }
}