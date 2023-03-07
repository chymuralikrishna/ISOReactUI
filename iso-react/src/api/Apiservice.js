import axios from "axios";
import moment from 'moment';



const TEST_ENV = 'TEST';
const LIVE_ENV = 'LIVE';

const environment = LIVE_ENV;
const TEST_URL = "http://172.19.98.173:8080";
const LIVE_URL = "http://apps.nfc.gov.in";

const TEST_LOGIN_API = "http://apps.nfc.gov.in/CommonAPIs/commonUtilAPIs/validateTestLoginCredentials";
const LIVE_LOGIN_API = "http://apps.nfc.gov.in/LDAPService/validate1";

const dmsConfigId = 6;

let LOGIN_API;
let API_URL;

if (environment === TEST_ENV) {
    API_URL = TEST_URL;
    LOGIN_API = TEST_LOGIN_API;
    localStorage.setItem('env', TEST_ENV)
} else if (environment === LIVE_ENV) {
    API_URL = LIVE_URL;
    LOGIN_API = LIVE_LOGIN_API;
    localStorage.setItem('env', LIVE_ENV)
}

class ApiService {

    login(userName, password) {
        return axios.post(LOGIN_API, {
            userName,
            password
        });
    }

    loginOption(ecNo, isoAuditorLogin, isoLogin, plantLogin) {
        return axios.post(API_URL + "/ISO/isValidLogin", {
            ecNo,
            isoAuditorLogin,
            isoLogin,
            plantLogin
        });
    }

    logout() {
        window.localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/iso-react"
    }

    saveISOAuditHdr(isoDetails) {
        return axios.post(API_URL + "/ISO/saveISOAuditHdr", isoDetails)
    }

    updateISOAuditHdr(isoDetails) {
        return axios.post(API_URL + "/ISO/updateISOAuditHdr", isoDetails)
    }

    saveISOAuditDetails(
        auditDate,
        auditId,
        auditee1EcNo,
        auditee2EcNo,
        auditor1EcNo,
        auditor2EcNo,
        auditorComments,
        detailsOfNoteWorthy,
        loginEcNo,
        plantCode
    ) {
        auditDate = moment(auditDate).format("YYYY-MM-DD")
        return axios.post(API_URL + "/ISO/saveISOAuditDetails", {
            auditDate,
            auditId,
            auditee1EcNo,
            auditee2EcNo,
            auditor1EcNo,
            auditor2EcNo,
            auditorComments,
            detailsOfNoteWorthy,
            loginEcNo,
            plantCode
        })
    }

    saveISOAuditFindingByAuditor(
        auditId,
        clause,
        dmsFileName,
        documentDescription,
        evidence,
        failure,
        isoAuditFindingType,
        isoStandard,
        loginEcNo,
        plantCode,
        requirement,
    ) {
        return axios.post(API_URL + "/ISO/saveISOAuditFindingByAuditor",
            {
                auditId,
                clause,
                dmsFileName,
                documentDescription,
                evidence,
                failure,
                isoAuditFindingType,
                isoStandard,
                loginEcNo,
                plantCode,
                requirement
            }
        )
    }


    updateISOAuditFindingByAuditor(
        auditId,
        clause,
        dmsFileName,
        documentDescription,
        evidence,
        failure,
        isoAuditFindingType,
        isoStandard,
        loginEcNo,
        plantCode,
        requirement,
        findingNumber
    ) {
        return axios.post(API_URL + "/ISO/updateISOAuditFindingByAuditor",
            {
                auditId,
                plantCode,
                findingNumber,
                clause,
                dmsFileName,
                documentDescription,
                evidence,
                failure,
                isoAuditFindingType,
                isoStandard,
                loginEcNo,
                requirement
            }
        )
    }

    saveCorrectiveActionReport(
        auditId,
        plantCode,
        findingNo,
        proposedCorrection,
        rootCause,
        proposedCorrectiveAction,
        proposedCompletionDate,
        loginEcNo

    ) {
        return axios.post(API_URL + "/ISO/saveCorrectiveActionReport",
            {
                auditId,
                plantCode,
                findingNo,
                proposedCorrection,
                rootCause,
                proposedCorrectiveAction,
                proposedCompletionDate,
                loginEcNo
            }
        )

    }

    submitForClosure(
        auditId,
        plantCode,
        findingNo,
        comments,
        loginEcNo
    ) {
        return axios.post(API_URL + "/ISO/submitForClosure",
            {
                auditId,
                plantCode,
                findingNo,
                comments,
                loginEcNo
            }
        )
    }

    recommendClosure(
        auditId,
        plantCode,
        findingNo,
        comments,
        loginEcNo
    ) {
        return axios.post(API_URL + "/ISO/recommendClosure",
            {
                auditId,
                plantCode,
                findingNo,
                comments,
                loginEcNo
            }
        )
    }

    approveClosure(
        auditId,
        plantCode,
        findingNo,
        comments,
        loginEcNo
    ) {
        return axios.post(API_URL + "/ISO/approveClosure",
            {
                auditId,
                plantCode,
                findingNo,
                comments,
                loginEcNo
            }
        )
    }

    returnClosure(
        auditId,
        plantCode,
        findingNo,
        comments,
        loginEcNo
    ) {
        return axios.post(API_URL + "/ISO/returnClosure",
            {
                auditId,
                plantCode,
                findingNo,
                comments,
                loginEcNo
            }
        )
    }

    createIsoRole(auditorEcNo, createdBy, forUnitCode, role) {
        return axios.post(API_URL + "/ISO/saveNewISOAuditor", { auditorEcNo, createdBy, forUnitCode, role })
    }

    getDetails(unitCode) {
        return axios.get(API_URL + "/ISO/getISOAuditList?unitCode=" + unitCode)
    }

    getISOAuditDetailsListForManagingPlants(loginEcNo) {
        return axios.get(API_URL + "/ISO/getISOAuditDetailsListForManagingPlants?loginEcNo=" + loginEcNo)
    }

    getISOAuditFindingsListForManagingPlants(loginEcNo) {
        return axios.get(API_URL + "/ISO/getISOAuditFindingsListForManagingPlants?loginEcNo=" + loginEcNo)
    }

    getISOAuditFindingsSummaryList(auditId) {
        return axios.get(API_URL + "/ISO/getISOAuditFindingsSummaryList?auditId=" + auditId)
    }

    getPlantInfo(plantCodes) {
        return axios.get(API_URL + "/CommonAPIs/employee/getOfficersListAndManagingOfficersListOfPlant?plantCode=" + plantCodes)
    }

    getPlantsInUnit(unitCode) {
        return axios.get(API_URL + "/CommonAPIs/plants/getPlantListForUnitCode?unitCode=" + unitCode)
    }

    getOfficersListInUnit(unitCode) {
        return axios.get(API_URL + "/CommonAPIs/employee/getOfficersListInNFCUnit?unitCode=" + unitCode)
    }

    getAllPlants() {
        return axios.get(API_URL + "/CommonAPIs/plants/getPlantList1")
    }

    getUnitCodes() {
        return axios.get(API_URL + "/CommonAPIs/plants/getUnitList")
    }

    getInchargeUnitCode(ecno) {
        return axios.get(API_URL + "/ISO/getInchargeUnitList?loginEcNo=" + ecno)
    }

    getIsoRoleDetails(unitCode) {
        return axios.get(API_URL + "/ISO/getISOAuditorsAndInchargeList?unitCode=" + unitCode)
    }

    getIsoAuditorsList(unitCode) {
        return axios.get(API_URL + "/ISO/getISOAuditorsList?unitCode=" + unitCode)
    }

    isoRolesList() {
        return axios.get(API_URL + "/ISO/getISORolesList")
    }

    getOpenAuditIds(unitCode) {
        return axios.get(API_URL + "/ISO/getOpenISOAuditIDList?unitCode=" + unitCode)
    }

    getAuditIds(unitCode) {
        return axios.get(API_URL + "/ISO/getISOAuditIDList?unitCode=" + unitCode)
    }

    getPlantList() {
        return axios.get(API_URL + "/CommonAPIs/plants/getPlantList")
    }

    getISOAuditFindingDetails(auditId, plantCode, findingNumber) {
        return axios.get(API_URL + "/ISO/getISOAuditFindingDetails?auditId=" + auditId + "&plantCode=" + plantCode + "&findingNo=" + findingNumber)
    }

    getISOAuditFindingLogsList(auditId, plantCode, findingNumber) {
        return axios.get(API_URL + "/ISO/getISOAuditFindingLogsList?auditId=" + auditId + "&plantCode=" + plantCode + "&findingNo=" + findingNumber)
    }

    getRenderButtons(auditId, plantCode, findingNumber, loginEcNo, loginRole) {
        return axios.get(API_URL + "/ISO/getRenderButtons?auditId=" + auditId + "&plantCode=" + plantCode + "&findingNo=" + findingNumber
            + "&loginEcNo=" + loginEcNo + "&loginRole=" + loginRole)
    }

    getUserDetails(ecno) {
        return axios.get(API_URL + "/CommonAPIs/employee/getEmployeeDetails?ecNo=" + ecno)
    }

    getAuditIdDetails(auditId) {
        return axios.get(API_URL + "/ISO/getISOAuditHdr?auditId=" + auditId)
    }

    getISOAuditDetailsList(auditId) {
        return axios.get(API_URL + "/ISO/getISOAuditDetailsList?auditId=" + auditId)
    }

    getISOAuditDetails(auditId, plantCode) {
        return axios.get(API_URL + "/ISO/getISOAuditDetails?auditId=" + auditId + "&plantCode=" + plantCode)
    }

    getISOAuditFindingsList(plantCode, auditId) {
        return axios.get(API_URL + "/ISO/getISOAuditFindingsList?plantCode=" + plantCode + "&auditId=" + auditId)
    }

    updateISOAuditDetails(
        auditId,
        auditDate,
        auditee1EcNo,
        auditee2EcNo,
        auditor1EcNo,
        auditor2EcNo,
        auditorComments,
        detailsOfNoteWorthy,
        loginEcNo,
        plantCode,
        plantName,
    ) {
        auditDate = moment(auditDate).format("YYYY-MM-DD")
        return axios.post(API_URL + "/ISO/updateISOAuditDetails", {
            auditId,
            auditDate,
            auditee1EcNo,
            auditee2EcNo,
            auditor1EcNo,
            auditor2EcNo,
            auditorComments,
            detailsOfNoteWorthy,
            loginEcNo,
            plantCode,
            plantName,
        })
    }

    deleteRole(auditorEcNo, role) {
        return axios.delete(API_URL + "/ISO/deleteISOAuditor?auditorEcNo=" + auditorEcNo + "&role=" + role)
    }

    dmsUpload(fileBytes, fileName) {
        return axios.post(API_URL + "/CommonAPIs/DMSAPIs/uploadDocumentToDMS", { dmsConfigId, fileBytes, fileName })
    }

    getDownloadFileFromDMSURL(fileName) {
        return "http://apps.nfc.gov.in/CommonAPIs/DMSAPIs/downloadFileFromDMS?dmsFileName=" + encodeURI(fileName) + "&dmsConfigId="+ dmsConfigId;
    }
  
    saveDocumentDetails(auditId, plantCode, findingNo, description, dmsFileName, dmsTokenId, uploadedByEcno) {
        return axios.post(API_URL + "/ISO/saveDocumentDetails", {
            auditId, description, dmsFileName, dmsTokenId, findingNo, plantCode, uploadedByEcno
        })
    }

    getDocumentDetailsList(auditId, plantCode, findingNo) {
        return axios.get(API_URL + "/ISO/getDocumentDetailsList?auditId=" + auditId + "&plantCode=" + plantCode + "&findingNo=" + findingNo)
    }


    getDashboardCountsForPlant(loginEcNo) {
        return axios.get(API_URL + "/ISO/getDashboardCountsForPlant?loginEcNo=" + loginEcNo);
    }

    getDashboardCountsForAuditors(loginEcNo) {
        return axios.get(API_URL + "/ISO/getDashboardCountsForAuditors?loginEcNo=" + loginEcNo);
    }

    getDashboardCountsForISOIncharge(loginEcNo) {
        return axios.get(API_URL + "/ISO/getDashboardCountsForISOIncharge?");
    }

    getNCListPendingForCorrectiveAction(loginEcNo) {
        return axios.get(API_URL + "/ISO/getNCListPendingForCorrectiveAction?loginEcNo=" + loginEcNo);
    }

    getNCListPendingForManagingPlants(loginEcNo) {
        return axios.get(API_URL + "/ISO/getNCListPendingForManagingPlants?loginEcNo=" + loginEcNo);
    }

    getNCListSubmittedForApproval(loginEcNo, loginRole) {
        return axios.get(API_URL + "/ISO/getNCListSubmittedForApproval?loginEcNo=" + loginEcNo + "&loginRole=" + loginRole);
    }

}

export default new ApiService();