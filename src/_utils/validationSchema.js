import * as Yup from 'yup';
export const registerValidationSchema = Yup.object().shape({
    FullName: Yup.string()
        .required('Full Name is required')
        .matches(/^[A-Za-z\s]+$/, 'Only alphabets and spaces allowed.'),
    CompanyName: Yup.string()
        .required('Company Name is required')
        .matches(/^[a-zA-Z0-9&\-. ]+$/, 'Only alphanumeric characters, spaces, and limited special characters "&", "-", "." allowed.'),

    MobileNumber: Yup.string()
        .required('Phone Number is required')
        .matches(/^\d{3}-\d{3}-\d{4}$/, 'Phone number must be in the format 999-999-9999'),
    EmailAddress: Yup.string()
        .required('Email Address is required')
        .matches(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Invalid email address.'
          )
          .test('single-tld', 'Invalid email address.', (value) => {
            if (!value) return false;
            const domainParts = value.split('@')[1]?.split('.');
            return domainParts && domainParts.length <= 2; // Ensure max 1 dot in domain
          }),
    Password: Yup.string()
        .required('Password is required')
        .test('minLength', value => value && value.length >= 8 && value.length <= 16)
        .test('uppercase', value => /[A-Z]/.test(value))
        .test('lowercase', value => /[a-z]/.test(value))
        .test('number', value => /[0-9]/.test(value))
        .test('special', value => /[!@#$%&*()_+=<>?",'".;/]/.test(value))
        .test('FullName', function (value) {
            const { FullName } = this.parent;
            return value && !value.toLowerCase().includes(FullName.toLowerCase());
        }),
    PortalId: Yup.number()
        .nullable()
        .required('Please select any Portal'),
});

export const passwordValidationSchema = (fullName) => Yup.object().shape({
    Password: Yup.string()
        .required('Password is required')
        .test('minLength', 'Password must be 8 to 16 characters', value => value && value.length >= 8 && value.length <= 16)
        .test('uppercase', 'Password must contain at least one uppercase letter', value => /[A-Z]/.test(value))
        .test('lowercase', 'Password must contain at least one lowercase letter', value => /[a-z]/.test(value))
        .test('number', 'Password must contain at least one number', value => /[0-9]/.test(value))
        .test('special', 'Password must contain at least one special character', value => /[!@#$%^&*(),.?":{}|<>']/.test(value))
        .test('FullName', 'Password must not contain your full name', function (value) {
            return value && !value.toLowerCase().includes(fullName.toLowerCase());
        }),
        ConfirmPassword: Yup.string()
        .required('Please re-enter your new password')
        .oneOf([Yup.ref('Password'), null], 'Passwords do not match.'),
    
});

export const resetPasswordValidationSchema = (fullName) => Yup.object().shape({
    CurrentPassword: Yup.string()
        .required('Current password is required'),
    Password: Yup.string()
        .required('New Password is required')
        .test('minLength', 'Password must be 8 to 16 characters', value => value && value.length >= 8 && value.length <= 16)
        .test('uppercase', 'Password must contain at least one uppercase letter', value => /[A-Z]/.test(value))
        .test('lowercase', 'Password must contain at least one lowercase letter', value => /[a-z]/.test(value))
        .test('number', 'Password must contain at least one number', value => /[0-9]/.test(value))
        .test('special', 'Password must contain at least one special character', value => /[!@#$%^&*(),.?":{}|<>']/.test(value))
        .test('FullName', 'Password must not contain your full name', function (value) {
            return value && !value.toLowerCase().includes(fullName.toLowerCase());
        }),
        ConfirmPassword: Yup.string()
        .required('Please re-enter your new password')
        .oneOf([Yup.ref('Password'), null], 'Passwords do not match.'),
});

export const mapCenterValidationSchema = Yup.object().shape({
    FullName: Yup.string().nullable()
        .required('Full Name is required')
        .matches(/^[A-Za-z\s]+$/, 'Full Name can only contain alphabets and spaces'),
    HomeStreetAddress1: Yup.string().nullable()
        .matches(/^[a-zA-Z0-9\s,.'-]*$/, 'Address can contain alphanumeric characters and special characters')
        .required('Address is required'),
    HomeCity: Yup.string().nullable()
        .matches(/^[a-zA-Z\s-]*$/, 'City can contain alphabets, spaces, and hyphens')
        .required('City is required'),
    HomeState: Yup.number()
        .nullable()
        .required('State is required'),
    HomeZipCode: Yup.string().nullable()
        .matches(/^\d{5}$/, 'Zip code must be 5 digits')
        .required('Zip code is required'),
    DLNumber: Yup.string().nullable()
        .matches(/^[a-zA-Z0-9]{1,18}$/, 'Driving License can contain up to 18 alphanumeric characters')
        .required('Driving License is required'),
    DLState: Yup.number()
        .nullable()
        .required('License state is required'),
        CompanyName: Yup.string()
        .required('Company Name is required')
        .matches(/^[a-zA-Z0-9&\-. ]+$/, 'Only alphanumeric characters, spaces, and limited special characters "&", "-", "." allowed.'),
    TaxIdentificationNumber: Yup.string().nullable()
        .required('Tax Identification Number is required')
        .matches(/^\d{9}$/, 'Tax Identification Number must contain nine numbers'),
    CompanyStreetAddress1: Yup.string().nullable()
        .matches(/^[a-zA-Z0-9\s,.'-]*$/, 'Address can contain alphanumeric characters and special characters')
        .required('Address is required'),
    CompanyCity: Yup.string().nullable()
        .matches(/^[a-zA-Z\s-]*$/, 'City can contain alphabets, spaces, and hyphens')
        .required('City is required'),
    CompanyState: Yup.number()
        .nullable()
        .required('State is required'),
    CompanyZipCode: Yup.string().nullable()
        .matches(/^\d{5}$/, 'Zip code must be 5 digits')
        .required('Zip code is required'),
    CompanyContactName: Yup.string()
        .nullable()
        .required('Full Name is required'),
    CompanyContactTelephone: Yup.string()
        .nullable()
        .required('Phone Number is required')
        .matches(/^\d{3}-\d{3}-\d{4}$/, 'Phone number must be in the format 999-999-9999'),
    CompanyContactEmailAddress: Yup.string()
        .nullable()
        .required('Email Address is required')
        .matches(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Invalid email address.'
          )
          .test('single-tld', 'Invalid email address.', (value) => {
            if (!value) return false;
            const domainParts = value.split('@')[1]?.split('.');
            return domainParts && domainParts.length <= 2; // Ensure max 1 dot in domain
          }),
    AlternateEmail: Yup.string()
        .required('Email is required')
        .matches(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Invalid email address.'
          )
          .test('single-tld', 'Invalid email address.', (value) => {
            if (!value) return false;
            const domainParts = value.split('@')[1]?.split('.');
            return domainParts && domainParts.length <= 2; // Ensure max 1 dot in domain
          }),
    MobileNumber: Yup.string()
        .nullable()
        .required('Phone Number is required')
        .matches(/^\d{3}-\d{3}-\d{4}$/, 'Phone number must be in the format 999-999-9999'),
    AlternatePhoneNumber: Yup.string()
        .nullable()
        .required('Phone Number is required')
        .matches(/^\d{3}-\d{3}-\d{4}$/, 'Phone number must be in the format 999-999-9999'),
});


export const mapCenterAdminValidationSchema = Yup.object().shape({
    FullName: Yup.string().nullable()
        .required('Full Name is required'),
    AlternateEmail: Yup.string()
        .required('Email is required')
        .matches(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Invalid email address.'
          )
          .test('single-tld', 'Invalid email address.', (value) => {
            if (!value) return false;
            const domainParts = value.split('@')[1]?.split('.');
            return domainParts && domainParts.length <= 2; // Ensure max 1 dot in domain
          }),
    MobileNumber: Yup.string()
        .nullable()
        .required('Phone Number is required')
        .matches(/^\d{3}-\d{3}-\d{4}$/, 'Phone number must be in the format 999-999-9999'),
    AlternatePhoneNumber: Yup.string()
        .nullable()
        .required('Phone Number is required')
        .matches(/^\d{3}-\d{3}-\d{4}$/, 'Phone number must be in the format 999-999-9999'),
    HomeStreetAddress1: Yup.string().nullable()
        .matches(/^[a-zA-Z0-9\s,.'-]*$/, 'Address can contain alphanumeric characters and special characters')
        .required('Address is required'),
    HomeCity: Yup.string().nullable()
        .matches(/^[a-zA-Z\s-]*$/, 'City can contain alphabets, spaces, and hyphens')
        .required('City is required'),
    HomeState: Yup.number()
        .nullable()
        .required('State is required'),
    HomeZipCode: Yup.string().nullable()
        .matches(/^\d{5}$/, 'Zip code must be 5 digits')
        .required('Zip code is required'),
    DLNumber: Yup.string().nullable()
        .matches(/^[a-zA-Z0-9]{1,18}$/, 'Driving License can contain up to 18 alphanumeric characters')
        .required('Driving License is required'),
    DLState: Yup.number()
        .nullable()
        .required('License state is required'),
    CompanyName: Yup.string()
        .nullable()
        .required('Company Name is required'),
    TaxIdentificationNumber: Yup.string().nullable()
        .matches(/^\d{9}$/, 'Tax Identification Number must be 9 digits')
        .required('Tax Identification Number is required'),
    CompanyStreetAddress1: Yup.string().nullable()
        .matches(/^[a-zA-Z0-9\s,.'-]*$/, 'Address can contain alphanumeric characters and special characters')
        .required('Address is required'),
    CompanyCity: Yup.string().nullable()
        .matches(/^[a-zA-Z\s-]*$/, 'City can contain alphabets, spaces, and hyphens')
        .required('City is required'),
    CompanyState: Yup.number()
        .nullable()
        .required('State is required'),
    CompanyZipCode: Yup.string().nullable()
        .matches(/^\d{5}$/, 'Zip code must be 5 digits')
        .required('Zip code is required'),
    CompanyContactName: Yup.string()
        .nullable()
        .required('Full Name is required'),
    CompanyContactTelephone: Yup.string()
        .nullable()
        .required('Phone Number is required')
        .matches(/^\d{3}-\d{3}-\d{4}$/, 'Phone number must be in the format 999-999-9999'),
    CompanyContactEmailAddress: Yup.string()
        .nullable()
        .required('Email Address is required')
        .matches(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Invalid email address.'
          )
          .test('single-tld', 'Invalid email address.', (value) => {
            if (!value) return false;
            const domainParts = value.split('@')[1]?.split('.');
            return domainParts && domainParts.length <= 2; // Ensure max 1 dot in domain
          }),
});

export const profileValidationSchema = () => Yup.object().shape({
    firstSecurityQuestion: Yup.number()
        .required('Please select the first security question'),
    firstSecurityAnswer: Yup.string()
        .required('First security answer is required'),
    secondSecurityQuestion: Yup.number()
        .required('Please select the second security question'),
    secondSecurityAnswer: Yup.string()
        .required('Second security answer is required'),
    thirdSecurityQuestion: Yup.number()
        .required('Please select the third security question'),
    thirdSecurityAnswer: Yup.string()
        .required('Third security answer is required'),
});

export const otpValidationSchema = Yup.object().shape({
    otp: Yup.string().length(6, "OTP must be exactly 6 digits").required("OTP is required"),
});

export const loginValidationSchema = Yup.object().shape({
    Email: Yup.string()
        .required('Email is required')
        .matches(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Invalid email address.'
          )
          .test('single-tld', 'Invalid email address.', (value) => {
            if (!value) return false;
            const domainParts = value.split('@')[1]?.split('.');
            return domainParts && domainParts.length <= 2; // Ensure max 1 dot in domain
          }),
    Password: Yup.string()
        .required('Password is required'),
});

export const resetValidationSchema = Yup.object().shape({
    email: Yup.string()
        .required('Email is required')
        .matches(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Invalid email address.'
          )
          .test('single-tld', 'Invalid email address.', (value) => {
            if (!value) return false;
            const domainParts = value.split('@')[1]?.split('.');
            return domainParts && domainParts.length <= 2; // Ensure max 1 dot in domain
          }),
});

export const uploadValidationSchema = Yup.object().shape({
    file: Yup.mixed().test('fileSize', 'File is too large', (value) => {
        return value && value.size <= 1000000; // 1MB limit
    }).required('File is required'),
    documentType: Yup.string()
        .required('Document type is required')
        .nullable(),
});

export const SupplierDetailsSchema = Yup.object().shape({
    CompanyName: Yup.string().nullable().required('Company Name is Required'),
    CompanyWebsite: Yup.string().nullable().required('Company Website is Required')
        .matches(/(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/, 'Please provide a valid website URL'),
    CategoryID: Yup.number().nullable().required('Business Category is Required'),
    ClassificationID: Yup.string().nullable().required('Classification is required'),
    ServicesProductsProvided: Yup.string().nullable().required('Services are Required'),
    ExpiryDate: Yup.date().nullable().required('Expiry Date of certification is required'),
    ContactPerson: Yup.string().nullable().required('Contact Person is Required'),
    Title: Yup.string().nullable().required('Title is Required'),
    Email: Yup.string().nullable().required('Email is required')   
    .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Invalid email address.'
      )
      .test('single-tld', 'Invalid email address.', (value) => {
        if (!value) return false;
        const domainParts = value.split('@')[1]?.split('.');
        return domainParts && domainParts.length <= 2; // Ensure max 1 dot in domain
      }),
    PhoneNumber: Yup.string().nullable().required('Phone Number is required').matches(/^\d{3}-\d{3}-\d{4}$/, 'Phone number must be in the format 999-999-9999'),
    Street: Yup.string().nullable().required('Address is required'),
    State: Yup.number().nullable().required('State is required'),
    City: Yup.string().nullable().required('City is Required'),
    ZipCode: Yup.string().nullable().required('Zip code is required'),
    AgencyID: Yup.number().nullable().required('Agency is Required'),
    AgencyStateID: Yup.number().nullable().required('Agency State is Required'),
});

export const profileInformationSchema = Yup.object().shape({
    FullName: Yup.string().nullable().required('Full Name is required'),
    CompanyName: Yup.string().nullable().required('Company Name is required'),
    MobileNumber: Yup.string()
        .nullable()
        .required('Phone Number is required')
        .matches(/^\d{3}-\d{3}-\d{4}$/, 'Phone number must be in the format 999-999-9999'),
    EmailID: Yup.string().nullable().required('Email Address is required')
    .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Invalid email address.'
      )
      .test('single-tld', 'Invalid email address.', (value) => {
        if (!value) return false;
        const domainParts = value.split('@')[1]?.split('.');
        return domainParts && domainParts.length <= 2; // Ensure max 1 dot in domain
      }),
    StateID: Yup.number().nullable().required('State is required'),
    Address: Yup.string().nullable().required('Address is required'),
    ZipCode: Yup.string().nullable().required('Zip code is required'),
    TaxIdentificationNumber: Yup.lazy(() => Yup.string().nullable().when('TaxIdentificationNumber', {
        is: (value) => value != null,
        then: Yup.string().required('Tax Identification Number is required'),
    }))
});

export const supportInformationSchema = Yup.object().shape({
    PortalID: Yup.number().nullable().required('Please select any Portal'),
    PhoneNumber: Yup.string().required('Phone Number is required')
    .matches(/^\d{3}-\d{3}-\d{4}$/, 'Phone number must be in the format 999-999-9999'),
    EmailAddress: Yup.string().nullable().required("Email Address is required"),
    Fax: Yup.string().nullable().required('Fax is required')
    .matches(/^\d{3}-\d{3}-\d{4}$/, 'Fax must be in the format (eg. 123-123-1234)'),
});

export const newRoleSchema = Yup.object().shape({
    RoleName: Yup.string().required('Role Name is required'),
    PortalId: Yup.number().nullable().required('Please select any Portal')
});

export const newAnnounceMentSchema = Yup.object().shape({
    Title: Yup.string().required('Title is required'),
    PortalID: Yup.number().nullable().required('Please select any Portal'),
    RoleID: Yup.string().nullable().required('Please select any Role'),
    Data: Yup.string().required('Message is required'),
    SelectedDate: Yup.array()
        .of(Yup.date().nullable().required('Select Date is required'))
        .required('Select Date is required')
        .min(2, 'Please select a date range'),
});

export const filterPopupAnnounceMentSchema = Yup.object().shape({
    filterPortalID: Yup.number().nullable().required('Please select any Portal'),
    filterRoleID: Yup.string().nullable().required('Please select any Role')
});

export const newFaqSchema = Yup.object().shape({
    Question: Yup.string().required('Title is required'),
    PortalID: Yup.number().nullable().required('Please select any Portal'),
    Answer: Yup.string().required('Message is required')
});

export const userProfileFilterSchema = Yup.object().shape({
    //  PortalId: Yup.number().nullable().required('Portal is Required'),
    email: Yup.string().nullable()
    .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Invalid email address.'
      )
      .test('single-tld', 'Invalid email address.', (value) => {
        if (!value) return false;
        const domainParts = value.split('@')[1]?.split('.');
        return domainParts && domainParts.length <= 2; // Ensure max 1 dot in domain
      }),
});

export const createMarketerSchema = Yup.object().shape({
    MarketerName: Yup.string()
    .required('Company Name is required')
    .matches(/^[a-zA-Z&\-. ]+$/, 'Only alpha character, spaces, and limited special characters "&", "-", "." allowed.'),
    // MarketerName: Yup.string().nullable().required('Company Name is Required'),
    ServiceProvider: Yup.number().nullable().required('Service Provider are Required'),
    StartDate: Yup.date().nullable().required('Start Date is required')
});

export const createMarketerGroupSchema = Yup.object().shape({
    GroupName: Yup.string().required('Group Name is required'),
    GroupType: Yup.string().required('Group Type is required'),
    JurisdictionID: Yup.number().nullable().when('GroupType', {
        is: (value) => value?.toLowerCase() !== 'firm',
        then: Yup.number().required('Jurisdiction is required'),
        otherwise: Yup.number().nullable(),
    }),
    StartMonth: Yup.date().required('Start Month is required'),
    BalancingModelID: Yup.string().required('Balancing Model is required'),
});

export const profileInformationUpdateSchema = Yup.object().shape({
    FullName: Yup.string()
        .required('Full Name is required')
        .matches(/^[A-Za-z\s]+$/, 'Only alphabets and spaces allowed.'),
    CompanyName: Yup.string().nullable().required('Company Name is required'),
    MobileNumber: Yup.string()
        .nullable()
        .required('Phone Number is required')
        .matches(/^\d{3}-\d{3}-\d{4}$/, 'Phone number must be in the format 999-999-9999'),
    EmailID: Yup.string().nullable().required('Email Address is required')
    .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Invalid email address.'
      )
      .test('single-tld', 'Invalid email address.', (value) => {
        if (!value) return false;
        const domainParts = value.split('@')[1]?.split('.');
        return domainParts && domainParts.length <= 2; // Ensure max 1 dot in domain
      }),
});

export const profileInformationMCUpdateSchema = Yup.object().shape({
    FullName: Yup.string()
        .required('Full Name is required')
        .matches(/^[A-Za-z\s]+$/, 'Only alphabets and spaces allowed.'),
    EmailID: Yup.string().nullable().required('Email Address is required')
        .email('Email Address is invalid'),
    AlternateEmail: Yup.string().nullable().notRequired()
    .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Invalid email address.'
      )
      .test('single-tld', 'Invalid email address.', (value) => {
        if (!value) return false;
        const domainParts = value.split('@')[1]?.split('.');
        return domainParts && domainParts.length <= 2; // Ensure max 1 dot in domain
      }),
    MobileNumber: Yup.string().nullable().required('Phone Number is required').matches(/^\d{3}-\d{3}-\d{4}$/, 'Phone number must be in the format 999-999-9999'),
    AlternatePhoneNumber: Yup.string().nullable().notRequired().test(
        'valid-format',
        'Phone number must be in the format 999-999-9999',
        (value) => !value || /^\d{3}-\d{3}-\d{4}$/.test(value)
    ),
    HomeStreetAddress1: Yup.string().nullable().required('Home Address is required'),
    HomeCity: Yup.string().nullable().required('Home City is required'),
    HomeState: Yup.number().nullable().required('State is required'),
    HomeZipCode: Yup.string().nullable().required('ZipCode is required'),
    DLNumber: Yup.string().nullable().required('DL Number is required'),
    DLState: Yup.number().nullable().required('DL State is required'),
    CompanyName: Yup.string().nullable().required('Company Name is required'),
    TaxIdentificationNumber: Yup.string().nullable().required('Tax Identification Number is required'),
    CompanyStreetAddress1: Yup.string().nullable().required('Company Address is required'),
    CompanyCity: Yup.string().nullable().required('Company Cityis required'),
    CompanyState: Yup.number().nullable().required('Company State is required'),
    CompanyZipCode: Yup.string().nullable().required('Company ZipCode is required'),
    CompanyContactName: Yup.string().nullable().required('Company ContactName is required'),
    CompanyContactTelephone: Yup.string().nullable().required('Company Contact Telephone is required').matches(/^\d{3}-\d{3}-\d{4}$/, 'Phone number must be in the format 999-999-9999'),
    CompanyContactEmailAddress: Yup.string().nullable().required('Email Address is required')
    .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Invalid email address.'
      )
      .test('single-tld', 'Invalid email address.', (value) => {
        if (!value) return false;
        const domainParts = value.split('@')[1]?.split('.');
        return domainParts && domainParts.length <= 2; // Ensure max 1 dot in domain
      }),
    // AuthorizedWGLContact: Yup.string().notRequired()
});

export const createPipelineNomination = Yup.object().shape({
    PipelineID: Yup.number().nullable().required('Pipeline is required'),
    ContractID: Yup.string().nullable()
        .required('ContractID is required'),
});

export const pipelineNominationFilterSchema = Yup.object().shape({
    MarketerID: Yup.number().nullable().required('Marketer is Required'),
    PipelineID: Yup.number().nullable().required('Pipeline is Required'),
    SelectedDate: Yup.array()
        .of(Yup.date().nullable().required('From - To date is required'))
        .required('From - To is required')
        .min(2, 'Please select a from - to'),
});

export const byFirmFilter = Yup.object().shape({
    StartMonth: Yup.date().required('Month is required')
});

export const MarketerGroupFilterSchema = Yup.object().shape({
    MarketerID: Yup.number().nullable().required('Marketer is Required'),
    GroupName: Yup.number().nullable().notRequired(),
    StartMonth: Yup.date().nullable().notRequired(),
    EndMonth: Yup.date().nullable().notRequired()
})

export const byInterruptibleFilter = Yup.object().shape({
    MarketerID: Yup.number().nullable().required('Marketer is Required'),
    StartMonth: Yup.date().required('Month is required')
});

export const activityFilterSchema = Yup.object().shape({
    SelectedDate: Yup.array()
        .of(Yup.date().nullable().required('From - To date is required'))
        .required('From - To is required')
        .min(2, 'Please select a from - to'),
});

export const accountInquirySchema = Yup.object().shape({
    searchType: Yup.string().required('Search type is required'),
    washingtonGasAccount: Yup.string().when('searchType', {
        is: 'Washington Gas Account',
        then: Yup.string().matches(/^\d+$/, 'Invalid account number').required('Account number is required'),
    }),
    accountHolder: Yup.object().shape({
        firstName: Yup.string().when('searchType', {
            is: 'Account Holder',
            then: Yup.string().required('First name or organization is required'),
        }),
        lastName: Yup.string(),
    }).default(undefined),
    phoneNumber: Yup.string().when('searchType', {
        is: 'Phone Number',
        then: Yup.string().matches(/^\d{3}-\d{3}-\d{4}$/, 'Invalid phone number').required('Phone number is required').matches(/^\d{3}-\d{3}-\d{4}$/, 'Phone number must be in the format 999-999-9999'),
    }),
    serviceAddress: Yup.object().shape({
        houseNumber: Yup.string().when('searchType', {
            is: 'Service Address',
            then: Yup.string(),
        }),
        apartmentSuite: Yup.string(),
        streetAddress: Yup.string().when('searchType', {
            is: 'Service Address',
            then: Yup.string().required('Street address is required'),
        }),
        city: Yup.string(),
        state: Yup.string(),
    }).default(undefined),
});

export const monthlyStorageSchema = Yup.object().shape({
    ReportDate: Yup.date().required('Month is required'),
    MarketerID: Yup.number().required('Marketer is Required'),
});
export const supplierPendingEnrollmentOrDropSchema = Yup.object().shape({
    ReportDate: Yup.date().required('Month is required'),
    MarketerID: Yup.number().required('Marketer is Required'),
}); 