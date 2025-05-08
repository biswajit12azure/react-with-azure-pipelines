import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { SupplierDetailsSchema } from "_utils/validationSchema";
import Grid from "@material-ui/core/Grid";
import { AutocompleteInput, UnderConstruction, UploadFiles } from '_components';
import { alertActions, supplyDiversityAction } from '_store';
import SupplierDetails from '../user/ProfileDetails/SupplierDetails';
import { supplierSupportedFormat } from '_utils/constant';
import { diversityRegistrationLabels } from '_utils/labels';
import { raphaelinfo } from '../../images';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';

const ManageProfileSD = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const header = 'Supplier Diversity';
  const { portalkey, id } = useParams();
  const user = useSelector(x => x.supplydiversity?.userData);
  const [selectedDocumentType, setSelectedDocumentType] = useState(null);
  const documentTypeData = user?.DocumentData || [];
  const [files, setFiles] = useState([]);
  const [classification, setClassification] = useState('');
  const states = user?.State1 || [];
  const classificationDropDownData = user?.Classification || [];
  const businessDropDownData = user?.BusinessCategory || [];
  const agencyDropDownData = user?.Agency || [];
  const exsistingFiles = user?.FileData || [];

  const documentData = documentTypeData.map(x => ({
    label: x.DocumentDescription,
    value: x.DocumentTypeID
  }));
  const stateData = states.map(x => ({
    label: x.StateName,
    value: x.StateId
  }));
  const classificationData = classificationDropDownData.map(x => ({
    label: x.ClassificationName,
    value: x.ClassificationID.toString()
  }));
  const businessCategoryData = businessDropDownData.map(x => ({
    label: x.CategoryName,
    value: x.CategoryID
  }));

  const agencyData = agencyDropDownData.map(x => ({
    label: x.AgencyName,
    value: x.AgencyID
  }));

  dayjs.extend(utc);
  dayjs.extend(customParseFormat);

  const formatPhoneNumber = (number) => {
    const cleaned = ('' + number).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return number;
  };

  const { register, handleSubmit, setValue, control, reset, formState: { errors, isValid }, trigger } = useForm({
    resolver: yupResolver(SupplierDetailsSchema),
    mode: 'onBlur'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(supplyDiversityAction.clear());
        const user = await dispatch(supplyDiversityAction.get({ id })).unwrap();
        const userData = user?.Data;
        const expirtDate = dayjs(userData.ExpiryDate).isValid() ? dayjs(userData.ExpiryDate) : dayjs();
        const data = { ...userData, PhoneNumber: formatPhoneNumber(userData.PhoneNumber), ExpiryDate: expirtDate };
        reset(data);
        if (data?.FileData) {
          setFiles(data?.FileData.map(file => ({
            ID: file.ID,
            AdditionalID: file.AdditionalID,
            DocumentTypeID: file.DocumentTypeID,
            FileName: file.FileName,
            Format: file.Format,
            Size: file.Size,
            PortalKey: file.PortalKey,
            File: file.File,
            Url: file.Url
          })));
        }

        setClassification(data?.ClassificationID || '');
      } catch (error) {
        dispatch(alertActions.error({
          message: error?.message || error,
          header: header
        }));
        reset(user);
      }
    };
    fetchData();
  }, [id, dispatch, reset, portalkey]);

  const onSubmit = async (data) => {
    dispatch(alertActions.clear());
    try {
      const requiredDocumentTypes = documentTypeData.filter(docType => !docType.DocumentDescription.includes('Additional'));

      const missingDocumentTypes = requiredDocumentTypes.filter(docType =>
        !files.some(file => file.DocumentTypeID === docType.DocumentTypeID)
      );

      if (missingDocumentTypes.length > 0) {
        const missingDescriptions = missingDocumentTypes.map(docType => docType.DocumentDescription).join(', ');
        dispatch(alertActions.error({
          message: `Missing files for document types: ${missingDescriptions}`,
          header: header
        }));
        return;
      }

      const parsedDate =  dayjs(data.ExpiryDate);
      const formattedDate = parsedDate.utc().format('YYYY-MM-DDTHH:mm:ss');

      const transformedData = {
        AdditionalID: user?.AdditionalID || 0,
        UserID: id,
        CompanyName: data.CompanyName,
        ContactPerson: data.ContactPerson,
        Title: data.Title,
        Street: data.Street,
        City: data.City,
        State: data.State,
        CompanyWebsite: data.CompanyWebsite,
        Email: data.Email,
        ZipCode: data.ZipCode,
        PhoneNumber: data.PhoneNumber,
        Fax: data.Fax,
        CellPhone: data.CellPhone,
        CategoryID: data.CategoryID,
        ClassificationID: classification,
        ServicesProductsProvided: data.ServicesProductsProvided,
        ExpiryDate: formattedDate,
        AgencyID: data.AgencyID,
        AgencyStateID: data.AgencyStateID,
        FileData: files,
      };

      let result;
      if (user?.AdditionalID !== 0) {
        result = await dispatch(supplyDiversityAction.update({ id, transformedData }));
      } else {
        result = await dispatch(supplyDiversityAction.insert({ id, transformedData }));
      }
      
      if (result?.error) {
        dispatch(alertActions.error({ message: result?.payload || result?.error.message, header: header }));
        return;
      }
      navigate('/');
      dispatch(alertActions.success({ message: diversityRegistrationLabels.message1, header: diversityRegistrationLabels.header, showAfterRedirect: true }));

    } catch (error) {
      dispatch(alertActions.error({ message: error?.message || error, header: header }));
    }
  };

  const handleBlur = async (e) => {
    const fieldName = e.target.name;
   // console.log(`Triggering validation for: ${fieldName}`);
     await trigger(fieldName);
   // console.log(`Validation result for ${fieldName}:`, result);
  };

  const handleOnChange = (event, newvalue) => {
    setSelectedDocumentType(newvalue);
  };
  const handleFileChange = (newFiles) => {
    setFiles(newFiles);
  };
  const handleClassificationChange = (newValue) => {
    setClassification(newValue);
  };

  return (
    <>
      {!(user?.loading || user?.error) && (
        <Typography component="div" className="MapCenterAccecss">
          <Typography component="div" className="MapCenterAccecssheading">
            <Typography component="h1" variant="h5">Supplier Diversity</Typography>
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Typography className="Personal-Information-container" component="div">
              <Grid container spacing={3}>
                <Grid item xs={12} sm={12} md={12} >
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={12} md={8} className="Personal-Information">
                      <Typography component="div" className="mapcontainer">
                        <Typography component="div" className="Personal-Informationsheading">
                          <Typography component="h2" variant="h5" className='margin-bottom-12'>Personal Information</Typography>
                        </Typography>
                        <SupplierDetails
                          register={register}
                          errors={errors}
                          control={control}
                          classification={classification}
                          stateData={stateData}
                          businessCategoryData={businessCategoryData}
                          classificationData={classificationData}
                          agencyData={agencyData}
                          handleClassificationChange={handleClassificationChange}
                          handleBlur={handleBlur}
                          trigger={trigger}
                          setValue={setValue} />
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={12} md={4} >
                      <Typography component="div" className="Personal-Informationsheading">
                        <Grid item xs={12} sm={6} md={12} >
                          <Typography component="h2" variant="h5" >Documents upload <img src={raphaelinfo} alt='raphaelinfo'></img></Typography>
                          <Typography component="div" className="passwordcheck">
                            <AutocompleteInput
                              control={control}
                              name="documentType"
                              label="Document Type"
                              options={documentData}
                              error={!!errors.documentType}
                              helperText={errors.documentType?.message}
                              handleBlur={handleBlur}
                              onChange={handleOnChange}
                            />
                          </Typography>
                        </Grid>
                        <UploadFiles
                          initialFiles={files}
                          portalKey={portalkey}
                          selectedDocumentType={selectedDocumentType}
                          supportedFormats={supplierSupportedFormat}
                          documentTypes={documentTypeData}
                          control={control}
                          errors={errors}
                          onFileChange={handleFileChange}
                          exsistingFiles={exsistingFiles}
                        />
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Typography>
            <Grid item xs={12} sm={12} md={12} className="Personal-Information">
              <Button type="submit" variant="contained" className='CompleteRegistration' color="primary" disabled={!isValid}>
                Complete Registration
              </Button>
            </Grid>
          </form>
        </Typography>
      )}
      {user?.error && <UnderConstruction />}
    </>
  );
};

export default ManageProfileSD;