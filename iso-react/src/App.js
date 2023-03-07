import React, { Component } from "react";
import './App.css';
import { HashRouter, Route, Switch } from "react-router-dom";
import Dashboard from "./pages/Dashboard";

import Login from "./pages/Login";
import Error from "./pages/Error";

import 'primereact/resources/themes/bootstrap4-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';


import ISOAuditDetails from "./pages/common/ISOAuditDetails";
import ISOAuditFindingDetails from "./pages/common/IsoAuditFindingDetails";

import IsoAuditDetailsList from "./pages/iso-auditor/IsoAuditDetailsList";
import EditISOAuditDetails from "./pages/iso-auditor/EditISOAuditDetails";
import AddISOAuditDetails from "./pages/iso-auditor/AddISOAuditDetails";

import SaveISOAuditHdr from "./pages/iso/SaveISOAuditHdr";
import IsoDashboard from "./pages/iso/Iso-Dashboard";
import AddIsoRole from "./pages/iso/iso-role";
import IsoRoleList from "./pages/iso/iso-rolelist";

import IsoAuditFindingsListPlant from "./pages/plant/IsoAuditFindingsListPlant";
import IsoAuditList from "./pages/plant/IsoAuditList";

import IsoAuditFindingsSummaryList from "./pages/common/IsoAuditFindingsSummaryList";
import IsoAuditFindingsDashBoardList from "./pages/common/IsoAuditFindingsDashBoardList";

class App extends Component {
  render() {

    return (
      <React.Fragment>
        <HashRouter>
          <Switch>
            <Route path="/" component={Login} exact />
            <Route path="/dashboard" component={Dashboard} exact />
            
            <Route path="/ISOAuditDetails" component={ISOAuditDetails} exact />
            <Route path="/ISOAuditFindingDetails" component={ISOAuditFindingDetails} exact />
            <Route path="/IsoAuditFindingsSummaryList" component={IsoAuditFindingsSummaryList} exact />
            <Route path="/IsoAuditFindingsDashBoardList" component={IsoAuditFindingsDashBoardList} exact />

            {/* ISO Incharge pages */}
            <Route path="/isorolelist" component={IsoRoleList} exact />
            <Route path="/add-isorole" component={AddIsoRole} exact />
            <Route path="/saveISOAuditHdr" component={SaveISOAuditHdr} exact />
            <Route path="/viewisolist" component={IsoDashboard} exact />

            {/* ISO Auditor pages */}
            <Route path="/addISOAuditDetails" component={AddISOAuditDetails} exact />
            <Route path="/editISOAuditDetails" component={EditISOAuditDetails} exact />
            <Route path="/IsoAuditDetailsList" component={IsoAuditDetailsList} exact />


            {/* Plant pages */}
            <Route path="/isoAuditList" component={IsoAuditList} exact />
            <Route path="/isoAuditFindingsListPlant" component={IsoAuditFindingsListPlant} exact />
            
            {/* <Route component={Error} /> */}
          </Switch>
        </HashRouter>
      </React.Fragment>
    );
  }
}

export default App;
