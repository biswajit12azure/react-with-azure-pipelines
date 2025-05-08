import { getMapCenterData, getMyProfileData, getSupportData, getAIUserProfileData, user, IndividualUserData, announcementData, faqData, marketerGetData, marketerGroupGetData } from '_utils/constant';
import { portalAccessData } from '_utils/constant';
import { portalData, userRegistrationVerified } from '_utils/constant';
import { getSupplierDiversityData } from '_utils/constant';

// array in local storage for registered users
const usersKey = 'react-18-redux-registration-login-example-users';
const portalAccessKey = 'portal-access-data';
const mapCenterUserKey = 'map-center-user-datas';
const supplierDiversityUserKey = "supply-diversity-user-datas";
const userProfileKey = "user-profile-details-data";
const supportDetailsKey = "support-details-data";
const adminUserProfileKey = "admin-user-profile-data";
const IndividualUserKey = JSON.parse(localStorage.getItem('userId')) || '';
let users = JSON.parse(localStorage.getItem(usersKey)) || [];
let registerPortalData = portalData;
let userVerifyData = userRegistrationVerified;


const fakeBackend = () => {
    let realFetch = window.fetch;
    window.fetch = function (url, opts) {
        return new Promise((resolve, reject) => {
            // wrap in timeout to simulate server api call
            setTimeout(handleRoute, 500);

            function handleRoute() {
                switch (true) {
                    case url.endsWith('/api/Account/Authenticate') && opts.method === 'POST':
                        return authenticate();
                    case url.endsWith('/api/Account/refreshToken') && opts.method === 'POST':
                        return refreshToken();
                    case url.endsWith('/api/Account/Register') && opts.method === 'POST':
                        return register();
                    case url.endsWith('/api/Account') && opts.method === 'GET':
                        return getUsers();
                    case url.match(/\/api\/Account\/\d+$/) && opts.method === 'GET':
                        return getUserById();
                    case url.match(/\/api\/Account\/\d+$/) && opts.method === 'PUT':
                        return updateUser();
                    case url.match(/\/api\/Account\/\d+$/) && opts.method === 'DELETE':
                        return deleteUser();
                    case url.match(/\/api\/Account\/\d+$/) && opts.method === 'POST':
                        return upload();
                    case url.endsWith('/api/UserPortalRoleMapping/GetUserPortalRoleMapping') && opts.method === 'GET':
                        return getAccessData();
                    case url.endsWith('/api/UserPortalRoleMapping') && opts.method === 'PUT':
                        return postAccessData();
                    case url.endsWith('/api/Master/GetPortalDetails') && opts.method === 'GET':
                        return getPortalData();
                    case url.match(/\/api\/Account\/VerifiedEmailByUser\/\d+$/) && opts.method === 'GET':
                        return getVerifiedUserData();
                    case url.match(/\/api\/Account\/GetRegisterMapCentreAsync\/\d+$/) && opts.method === 'GET':
                        return getMapCenterUser();
                    case url.match('api/Account/Register-MC') && opts.method === 'POST':
                        return updateMapCenterUser();
                    case url.match(/\/api\/Account\/GetRegisterSupplierDiversityAsync\/\d+$/) && opts.method === 'GET':
                        return getSupplierDiversityUser();
                    case url.match('/api/Account/Register-SD') && opts.method === 'POST':
                        return updateSupplierDiversityUser();
                    case url.match(/\/api\/Account\/getUserProfileDetails\/\d+$/) && opts.method === 'GET':
                        return getUserProfileDetails();
                    case url.match(/\/api\/Account\/getIndividualUserDetails\/\d+$/) && opts.method === 'GET':
                        return getById();
                    case url.match(/\/api\/Account\/GetUserProfileByPortalID\/\d+$/) && opts.method === 'GET':
                        return getUserProfile();
                    case url.match('api/Account/SaveUserProfile') && opts.method === 'PUT':
                        return updateUserProfileDetails();
                    case url.match(/\/api\/Account\/GetSupportByID\/\d+$/) && opts.method === 'GET':
                        return getSupportDetails();
                    case url.match(/api\/Master\/SaveSupportDetails/) && opts.method === 'PUT':
                        return updateSupportDetails();
                    case url.match(/\/api\/Announcement\/GetAnnouncementByID\?userID=\d+$/) && opts.method === 'GET':
                        return getAnnouncements();
                    case url.match(/\/api\/Announcement\/GetAnnouncementByAllRole\?userID=\d+$/) && opts.method === 'GET':
                        return getAnnouncements();
                    case url.match(/\/api\/FAQ\/GetAllFAQ\?userID=\d+$/) && opts.method === 'GET':
                        return getFAQs();
                    case url.match(/\/api\/FAQ\/GetFAQByAdminRole\?userID=\d+$/) && opts.method === 'GET':
                        return getFAQs();
                    case url.match('/api/Master/GetAllMarketers') && opts.method === 'GET':
                        return getMarketers();
                    case url.match(/\/api\/MarketerGroup\/GetMarketersGroupByMarketerID\/\d+$/) && opts.method === 'GET':
                        return getMarketerGroups();
                    default:
                        // pass through any requests not handled above
                        return realFetch(url, opts)
                            .then(response => resolve(response))
                            .catch(error => reject(error));
                }
            }

            // route functions

            function authenticate() {
                const { Email, Password } = body();
                const user = users.find(x => x.EmailAddress === Email && x.Password === Password);

                if (!user) return error('You have entered an incorrect password for the profile associated with this email address.');

                let currentDateTime = new Date();
                let expiryTime = currentDateTime.setMinutes(currentDateTime.getMinutes() + 5);
                user.jwToken = 'fake-jwt-token';
                user.tokenExpiry = expiryTime;
                return ok({
                    ...basicDetails(user)
                    // token: ,
                    // tokenExpiry : /*'2024-09-25 21:03:24.789150'*/
                });
            }

            function refreshToken() {
                if (!isAuthenticated()) return unauthorized();
                // let auth = JSON.parse(localStorage.getItem('auth')) || [];
                //const user = users.find(x => x.id === auth?.id);               

                let currentDateTime = new Date();
                let expiryTime = currentDateTime.setMinutes(currentDateTime.getMinutes() + 7);

                return ok({
                    token: 'fake-jwt-refreshtoken',
                    tokenExpiry: expiryTime/*'2024-09-25 21:05:24.789150'                 */
                });
            }

            function register() {
                const user = body();

                if (users.find(x => x.EmailAddress === user.EmailAddress)) {
                    return error('email "' + user.EmailAddress + '" is already taken')
                }

                user.id = users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;
                user.createdDate = new Date();
                user.status = 1;
                users.push(user);
                localStorage.setItem(usersKey, JSON.stringify(users));

                return ok();
            }

            function getUsers() {
                if (!isAuthenticated()) return unauthorized();
                return ok(users.map(x => basicDetails(x)));
            }

            function getUserById() {
                if (!isAuthenticated()) return unauthorized();

                const user = users.find(x => x.id === idFromUrl());
                return ok(basicDetails(user));
            }

            function updateUser() {
                if (!isAuthenticated()) return unauthorized();

                const { data, portalName } = body();
                let params = data;
                let user = users.find(x => x.id === idFromUrl());

                // only update password if entered
                if (!params.password) {
                    delete params.password;
                }

                // if email changed check if taken
                if (params.emailAddress !== user.emailAddress && users.find(x => x.emailAddress === params.emailAddress)) {
                    return error('email "' + params.emailAddress + '" is already taken')
                }

                // update and save user

                let userAccess = {
                    ...params,
                    UserAccess: params.UserAccess.map(portal =>
                        portal.PortalName === portalName
                            ? { ...portal, IsProfileCompleted: 1 }
                            : portal
                    )
                };

                Object.assign(user, userAccess);

                localStorage.setItem(usersKey, JSON.stringify(users));
                return ok();
            }

            function deleteUser() {
                if (!isAuthenticated()) return unauthorized();

                users = users.filter(x => x.id !== idFromUrl());
                localStorage.setItem(usersKey, JSON.stringify(users));
                return ok();
            }

            function upload() {

                return ok({
                    viewuri: 'https://freeimage.host/i/dyXxVKN',

                });
            }

            function getAccessData() {
                let accessData = JSON.parse(localStorage.getItem(portalAccessKey)) || portalAccessData;;
                return ok(accessData);
            }

            function postAccessData() {
                // Retrieve the access data from the body function
                const accessData = body();
                let portalAccess = JSON.parse(localStorage.getItem(portalAccessKey)) || portalAccessData;
                let newAccesData = { ...portalAccess };

                // Create a new array for the updated portal access data
                const updatedPortalAccess = portalAccess?.Data.map(portal => {
                    // Create a shallow copy of the portal object
                    const newPortal = { ...portal };
                    newPortal.PortalRoleAccess = portal.PortalRoleAccess.map(roleAccess => {
                        // Create a shallow copy of the roleAccess object
                        const newRoleAccess = { ...roleAccess };
                        newRoleAccess.FeatureAccess = roleAccess.FeatureAccess.map(permission => {
                            // Create a shallow copy of the permission object
                            const newPermission = { ...permission };
                            // Find the corresponding changed data
                            const changedData = accessData.find(x => x.RoleAccessMappingID === permission.RoleAccessMappingID);
                            // Update the permission if there is a corresponding change
                            if (changedData && permission.RoleAccessMappingID === changedData.RoleAccessMappingID) {
                                newPermission.IsActive = changedData.IsActive;
                            }
                            return newPermission;
                        });
                        return newRoleAccess;
                    });
                    return newPortal;
                });

                newAccesData.Data = updatedPortalAccess;
                // Store the updated portal access data in localStorage
                localStorage.setItem(portalAccessKey, JSON.stringify(newAccesData));

                // Return a successful response
                return ok();
            }

            function getPortalData() {
                return ok(registerPortalData);
            }

            function getVerifiedUserData() {

                return ok(userVerifyData);
            }

            function getMapCenterUser() {
                try {
                    let mapCenterUser = JSON.parse(localStorage.getItem(mapCenterUserKey)) || getMapCenterData;;
                    return ok(mapCenterUser);
                }
                catch (error) {
                    return error('Failed to get map center user');
                }
            }

            function getSupplierDiversityUser() {
                try {
                    let supplierDiversityUser = JSON.parse(localStorage.getItem(supplierDiversityUserKey)) || getSupplierDiversityData;
                    return ok(supplierDiversityUser);
                }
                catch (error) {
                    return error('Failed to get Supplier Diversity User');
                }
            }

            function getUserProfileDetails() {
                try {
                    let userProfileDetails = JSON.parse(localStorage.getItem(userProfileKey)) || getMyProfileData;
                    return ok(userProfileDetails);
                }
                catch (error) {
                    return error('Failed to get  user');
                }
            }

            function getById() {
                try {
                    let userProfileDetails = JSON.parse(localStorage.getItem(IndividualUserKey)) || IndividualUserData;
                    return ok(userProfileDetails);
                }
                catch (error) {
                    return error('Failed to get  user');
                }

            }
            function getUserProfile() {
                try {
                    let userProfile = JSON.parse(localStorage.getItem(adminUserProfileKey)) || getAIUserProfileData;
                    return ok(userProfile);
                }
                catch (error) {
                    return error('Failed to get  user Details');
                }
            }
            function getSupportDetails() {
                try {
                    let supportDetail = getSupportData;
                    return ok(supportDetail);
                }
                catch (error) {
                    return error('Failed to get details');
                }
            }

            function getAnnouncements() {
                try {
                    let announcement = announcementData;
                    return ok(announcement);
                }
                catch (error) {
                    return error('Failed to get details');
                }
            }

            function getFAQs() {
                try {
                    let faq = faqData;
                    return ok(faq);
                }
                catch (error) {
                    return error('Failed to get details');
                }
            }

            function getMarketers() {
                try {
                    let marketerts = marketerGetData;
                    return ok(marketerts);
                }
                catch (error) {
                    return error('Failed to get details');
                }
            }

            function getMarketerGroups() {
                try {
                    let marketertGroups = marketerGroupGetData;
                    return ok(marketertGroups);
                }
                catch (error) {
                    return error('Failed to get details');
                }
            }

            function updateMapCenterUser() {
                try {
                    const mapCenterData = body();

                    let mapCenterUserData = JSON.parse(localStorage.getItem(mapCenterUserKey)) || getMapCenterData;

                    // Create a deep copy of the object to avoid modifying read-only properties
                    let newData = JSON.parse(JSON.stringify(mapCenterData));

                    newData.Data.DocumentData = [...mapCenterUserData.Data.DocumentData];

                    // Save the updated data back to localStorage
                    localStorage.setItem(mapCenterUserKey, JSON.stringify(newData));

                    // Return a successful response
                    return ok();
                } catch (err) {

                    return error('Failed to update map center user');
                }
            }

            function updateSupplierDiversityUser() {
                try {
                    const supplierDiversityData = body();

                    let supplierDiversityUserData = JSON.parse(localStorage.getItem(supplierDiversityUserKey)) || getSupplierDiversityData;

                    // Create a deep copy of the object to avoid modifying read-only properties
                    let newData = JSON.parse(JSON.stringify(supplierDiversityData));

                    newData.Data.DocumentData = [...supplierDiversityUserData.Data.DocumentData];
                    newData.Data.State1 = [...supplierDiversityUserData.Data.State1];
                    newData.Data.BusinessCategory = [...supplierDiversityUserData.Data.BusinessCategory];
                    newData.Data.Classification = [...supplierDiversityUserData.Data.Classification];
                    newData.Data.Agency = [...supplierDiversityUserData.Data.Agency];
                    // Save the updated data back to localStorage
                    localStorage.setItem(supplierDiversityUserKey, JSON.stringify(newData));

                    // Return a successful response
                    return ok();
                } catch (err) {

                    return error('Failed to update Supplier Diversity user');
                }
            }

            function updateUserProfileDetails() {
                try {
                    const userProfileData = body();

                    let userProfileJsonData = JSON.parse(localStorage.getItem(userProfileKey)) || getMyProfileData;

                    // Create a deep copy of the object to avoid modifying read-only properties
                    let newData = JSON.parse(JSON.stringify(userProfileData));

                    newData.Data.State = [...userProfileJsonData.Data.State];
                    // Save the updated data back to localStorage
                    localStorage.setItem(userProfileKey, JSON.stringify(newData));

                    // Return a successful response
                    return ok();
                } catch (err) {

                    return error('Failed to update user');
                }
            }

            function updateSupportDetails() {
                try {
                    const supportData = body();
                    // Create a deep copy of the object to avoid modifying read-only properties
                    let newData = JSON.parse(JSON.stringify(supportData));

                    // Save the updated data back to localStorage
                    localStorage.setItem(supportDetailsKey, JSON.stringify(newData));

                    // Return a successful response
                    return ok();
                } catch (err) {

                    return error('Failed to update details');
                }
            }
            // helper functions

            function ok(body) {
                resolve({ ok: true, ...headers(), json: () => Promise.resolve(body) })
            }

            function unauthorized() {
                resolve({ status: 401, ...headers(), json: () => Promise.resolve({ message: 'Unauthorized' }) })
            }

            function error(message) {
                resolve({ status: 400, ...headers(), json: () => Promise.resolve({ message }) })
            }

            function isAuthenticated() {
                return opts.headers['Authorization'] === 'Bearer fake-jwt-token' || 'Bearer fake-jwt-refreshtoken';
            }

            function body() {
                return opts.body && JSON.parse(opts.body);
            }

            function idFromUrl() {
                const urlParts = url.split('/');
                return parseInt(urlParts[urlParts.length - 1]);
            }

            function headers() {
                return {
                    headers: {
                        get(key) {
                            return ['application/json'];
                        }
                    }
                }
            }

            function basicDetails(userdetail) {
                // const {id,userName,email,roles,isVerified,jwtToken,tokenExpiry,refreshToken,refreshTokenExpiry} = user;
                const updatedUser = {
                    ...user,
                    Data: {
                        ...user.Data,
                        UserDetails: {
                            ...user.Data.UserDetails,
                            ...userdetail
                        }
                    }
                };
                return updatedUser;
            }
        });
    }
}

export default fakeBackend;