import React from 'react';
import { Controller } from 'react-hook-form';
import { ComboSelectBox, } from '_components';
import { accessRights, organizationList } from '_utils/tempData';

const MarketerDetails = (props) => {

    const { errors, control } = props;

    return <>
         <><Controller
            name="selectAccessRight"
            control={control}
            render={({ field }) => (
                <ComboSelectBox
                    {...field}
                    boxLabel="Select Access Right"
                    options={accessRights}
                    handleChange={(value) => field.onChange(value)}
                    error={!!errors.assignToJurisdiction}
                    helperText={errors.assignToJurisdiction?.message}
                />
            )}
        />
            <Controller
                name="selectAMarketer"
                control={control}
                render={({ field }) => (
                    <ComboSelectBox
                        {...field}
                        boxLabel="Select a Marketer"
                        options={organizationList}
                        handleChange={(value) => field.onChange(value)}
                        error={!!errors.assignToJurisdiction}
                        helperText={errors.assignToJurisdiction?.message}
                    />
                )}
            />
        </>        
    </>;
};

export default MarketerDetails;