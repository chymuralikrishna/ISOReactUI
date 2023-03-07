import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Navigation from "./Navigation";
import Apiservice from "../api/Apiservice";

export default class Dashboard extends Component {


    constructor(props) {
        super(props)

        this.state = {
            loginRole: localStorage.getItem('type'),
            dashBoardCounts: []
        }

        this.dashBoardCounts = this.dashBoardCounts.bind(this);

    }

    async componentDidMount() {

        let loginEcNo = JSON.parse(localStorage.getItem('ecNo'));
        let response;

        if (this.state.loginRole === 'PLANT') {
            response = await Apiservice.getDashboardCountsForPlant(loginEcNo);
        } else if (this.state.loginRole === 'ISO AUDITOR') {
            response = await Apiservice.getDashboardCountsForAuditors(loginEcNo);
        } else if (this.state.loginRole === 'ISO INCHARGE') {
            response = await Apiservice.getDashboardCountsForISOIncharge();
        }

       
        this.setState({
            dashBoardCounts: response.data
        })

        

    }

    dashBoardCounts() {


        const shoot = (dashBoardCountType) => {
            sessionStorage.setItem("DashBoardCountType", dashBoardCountType)
        }

        let loginRole = localStorage.getItem('type');

        switch (loginRole) {
            case "PLANT":
                return (
                    <React.Fragment>
                            <div className="p-mr-2 p-mb-2  p-shadow-2">
                                <label>Corrective Action Pending</label>
                                <Link onClick={()=>shoot("correctiveActionForNCPendingCount")} to='/IsoAuditFindingsDashBoardList'>
                                    {this.state.dashBoardCounts.correctiveActionForNCPendingCount}
                                </Link>
                            </div>
                            <div className="p-mr-2 p-mb-2  p-shadow-2">
                                <label>NC Pending For Closure</label>
                                <Link onClick={()=>shoot("managingPlantsPendingNCCount")} to='/IsoAuditFindingsDashBoardList'>
                                    {this.state.dashBoardCounts.managingPlantsPendingNCCount}
                                </Link>
                            </div>
                            <div className="p-mr-2 p-mb-2  p-shadow-2">
                                <label>NC Submitted For Approval</label>
                                <Link onClick={()=>shoot("nccountSubmittedForClosure")} to='/IsoAuditFindingsDashBoardList'>
                                    {this.state.dashBoardCounts.nccountSubmittedForApproval}
                                </Link>
                            </div>
                    </React.Fragment>

                )
                break;
            case "ISO AUDITOR":
                return (
                    <React.Fragment>
                        <div className="p-mr-2 p-mb-2  p-shadow-2">
                            <label>NC Pending For Approval</label>
                            <Link onClick={shoot("nccountSubmittedForClosure")} to='/IsoAuditFindingsDashBoardList'>
                                {this.state.dashBoardCounts.nccountSubmittedForClosure}
                            </Link>
                        </div>
                    </React.Fragment>

                )
                break;
            case "ISO INCHARGE":
                return (
                    <React.Fragment>
                        <div className="p-mr-2 p-mb-2  p-shadow-2">
                            <label>NC Pending For Approval</label>
                            <Link onClick={shoot("nccountSubmittedForClosure")} to='/IsoAuditFindingsDashBoardList'>
                                {this.state.dashBoardCounts.nccountSubmittedForClosure}
                            </Link>
                        </div>
                    </React.Fragment>

                )
                break;


            default:
                break;
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
                    <Navigation />
                    <div className="p-d-flex p-flex-column ">
                        <div className="p-mb-2 p-mx-4">
                            <h1 style={{ fontSize: "20px", marginTop: "10px" }}>Welcome to ISO Dashboard</h1>
                        </div>

                    </div>
                    <div className="p-d-flex p-mx-4 blockCards">
                        {this.dashBoardCounts()}
                    </div>

                </React.Fragment>
            )
        }
    }
}