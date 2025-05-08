import { configureStore } from "@reduxjs/toolkit";

import { alertReducer } from "./alert.slice";
import { authReducer } from "./auth.slice";
import { usersReducer } from "./users.slice";
import { configReducer } from "./configuration.slice";
import { registrationReducer } from "./registration.slice";
import { mapCenterReducer } from "./mapcenter.slice";
import { masterReducer } from "./master.slice";
import { supplyDiversityReducer } from "./supplydiversity.slice";
import { userProfileReducer } from "./userProfile.slice";
import { announcementReducer } from "./announcement.slice";
import { supportReducer } from "./support.slice";
import { faqReducer } from "./faq.slice";
import { marketerReducer } from "./marketer.slice";
import { marketergroupReducer } from "./marketergroup.slice";
import { nominationReducer } from "./nomination.slice";
import { myprofileReducer } from "./ProfileUpdate.slice";
import { nominationpipelineReducer } from "./nominationPipeline.slice";
import { customerReducer } from "./admincustomer.slice";
import { firmReducer } from "./firm.slice";
import { interruptibleReducer } from "./interruptible.slice";
import { nominationgroupReducer } from "./nominationGroup.slice";
import { activityLogReducer } from "./activitylog.slice";
import { filehubReducer } from "./filehub.slice";
import { manageServiceReducer } from "./manageService.slice";
import { fuelChargeReducer } from "./addFuelCharge.slice";
import { fileSubTypeReducer } from "./fileSubType.slice";
import { fileHubListReducer } from "./filehublist.slice";
import { uploadUetReducer } from "./uploaduet.slice";
import { fileHubDeleteReducer } from "./filehubDelete.slice";
import { announcementFilterReducer } from "./announcementFilter.slice";
import { accountInquiryReducer } from "./accountInquery.slice";
import { marketerReportReducer } from "./marketersReports.slice";
import { forecastReportReducer } from "./foreCastReport.slice";
import { summaryStorageMarketerReportReducer } from "./summaryStorage.slice";
import { alertMessageReducer } from "./alertAnnouncement.slice";
import { monthlyStorageReducer } from "./monthlyStorage.slice";
import { marketerBillingHistoryReducer } from "./marketerCustomer.slice";
import { cityGateReducer } from "./cityGate.slice";
import { dcNominationReportReducer } from './dcnomination.slice';
import {complianceReportReducer} from './summarynominationcompliance.slice';
import {activityInterruptibleReducer} from './activityInterruptible.slice';
import {nominationComplianceReducer} from './nominationCompliance.slice';
import {pipelineConfirmationReducer} from './pipelineConfirmation.slice';
import {supplierPendingEnrollmentOrDropReducer} from './supplierPendingEnrollmentOrDrop.slice';
import {supplierActiveCustomerReportReducer} from './supplierActiveCustomer.slice';

export * from "./alert.slice";
export * from "./auth.slice";
export * from "./users.slice";
export * from "./configuration.slice";
export * from "./registration.slice";
export * from "./mapcenter.slice";
export * from "./master.slice";
export * from "./supplydiversity.slice";
export * from "./userProfile.slice";
export * from "./announcement.slice";
export * from "./support.slice";
export * from "./faq.slice";
export * from "./marketer.slice";
export * from "./marketergroup.slice";
export * from "./nomination.slice";
export * from "./ProfileUpdate.slice";
export * from "./nominationPipeline.slice";
export * from "./admincustomer.slice";
export * from "./firm.slice";
export * from "./interruptible.slice";
export * from "./nominationGroup.slice";
export * from "./activitylog.slice";
export * from "./filehub.slice";
export * from "./manageService.slice";
export * from "./addFuelCharge.slice";
export * from "./fileSubType.slice";
export * from "./filehublist.slice";
export * from "./uploaduet.slice";
export * from "./filehubDelete.slice";
export * from "./announcementFilter.slice";
export * from "./accountInquery.slice";
export * from "./marketersReports.slice";
export * from "./foreCastReport.slice";
export * from "./foreCastReport.slice";
export * from "./alertAnnouncement.slice";
export * from "./marketerCustomer.slice";
export * from "./monthlyStorage.slice";
export * from "./cityGate.slice";
export * from "./dcnomination.slice";
export * from "./accountInquery.slice"
export * from "./nominationCompliance.slice"
export * from "./activityInterruptible.slice"
export * from "./pipelineConfirmation.slice"
export * from "./supplierPendingEnrollmentOrDrop.slice";
export * from "./summarynominationcompliance.slice";
export * from "./supplierActiveCustomer.slice"

export const store = configureStore({
  reducer: {
    alert: alertReducer,
    auth: authReducer,
    users: usersReducer,
    configs: configReducer,
    registration: registrationReducer,
    mapcenter: mapCenterReducer,
    master: masterReducer,
    supplydiversity: supplyDiversityReducer,
    userProfile: userProfileReducer,
    announcement: announcementReducer,
    supports: supportReducer,
    faq: faqReducer,
    marketer: marketerReducer,
    marketergroup: marketergroupReducer,
    nomination: nominationReducer,
    profileupdate: myprofileReducer,
    nominationpipeline: nominationpipelineReducer,
    admincustomer: customerReducer,
    firm: firmReducer,
    interruptible: interruptibleReducer,
    nominationgroup: nominationgroupReducer,
    activityLog: activityLogReducer,
    filehubReducer: filehubReducer,
    manageservice: manageServiceReducer,
    fuelCharge: fuelChargeReducer,
    fileSubType: fileSubTypeReducer,
    filehubList: fileHubListReducer,
    uploadUet: uploadUetReducer,
    filehubdelete: fileHubDeleteReducer,
    announcementFilterReducer: announcementFilterReducer,
    accountInquiryReducer: accountInquiryReducer,
    marketerCustomerReport: marketerReportReducer,
    forecastReportReducer: forecastReportReducer,
    summaryStorageMarketerReportReducer: summaryStorageMarketerReportReducer,
    alertMessage: alertMessageReducer,
    monthlyStorage: monthlyStorageReducer,
    marketerBillingHistory: marketerBillingHistoryReducer,
    cityGate: cityGateReducer,
    dcNominationReportReducer:dcNominationReportReducer,
    complianceReportReducer:complianceReportReducer,
    activityInterruptibleReducer:activityInterruptibleReducer,
    nominationComplianceReducer:nominationComplianceReducer,
    pipelineConfirmationReducer:pipelineConfirmationReducer,
    supplierPendingEnrollmentOrDropReducer:supplierPendingEnrollmentOrDropReducer,
    supplierActiveCustomerReportReducer:supplierActiveCustomerReportReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: process.env.NODE_ENV !== "development",
    }),
});
