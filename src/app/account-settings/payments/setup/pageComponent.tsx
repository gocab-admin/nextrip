'use client'
import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import CloseIcon from '@mui/icons-material/Close';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import LockIcon from '@mui/icons-material/Lock';

import APICONSTANT from "@/services/config";
import { postApiMethod, putApiMethod } from "@/services/global";
import HTMLButton from '@/components/DynamicComponent/HtmlButton';
import { Bank } from "@/app/global/svg";
import { dispatch } from '@/redux/store';
import { addAlert } from '@/redux/slice/AlertSlice';
import { StyledTextField } from '@/components/styledComponent/styledcomp';
import { usePageContext } from "@/components/Providers/PageContext";
import DynamicButtonComponent from '@/components/DynamicComponent/ButtonComponent';
import CountryCode from "@/country";

import styles from './page.module.scss'
import PhoneInput from 'react-phone-input-2';
import { isValidPhoneNumber } from 'react-phone-number-input';
import PhoneInputComponent from '@/components/phoneInput';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250
        }
    }
};

const SetupPayout = () => {
    const { i18 } = usePageContext();
    const router = useRouter()
    const searchparams = useSearchParams()
    const path = usePathname()
    const mode = searchparams && searchparams.get('mode')
    const [LocationName, setLocationName] = useState<string>('');
    const [selectedValue, setSelectedValue] = useState(false);
    const [postData, setPostData] = useState<any>({})
    const [step, setStep] = useState('1')
    const [callingCode, setCallingCode] = useState<any>('IN')
    const [selectedValue2, setSelectedValue2] = useState('');
    const [editvalue, setEditValue] = useState('');
    const [editData, setEditData] = useState({
        acctHolderName: postData.acctHolderName || '',
        acctNumber: postData.acctNumber || '',
        acctType: postData.acctType || '',
        bankName: postData.bankName || '',
        country: postData.country || '',
        routing_number: postData.routing_number || '',
        permanentAcctNum: postData.permanentAcctNum || '',
        city: postData.address?.city || '',
        state: postData.address?.state || '',
        postalCode: postData.address?.postal_code || '',
        email: postData.email || '',
        phone: postData.phone || ''
    })

    const handleRadioChange = (event: any) => {
        setSelectedValue2(event.target.value);
    };
    const handleInputChange = (property: any, value: any) => {
        setEditData((prevData) => ({
            ...prevData,
            [property]: value
        }));
    };
    const handleChange = (event: SelectChangeEvent<typeof LocationName>) => {
        const {
            target: { value }
        } = event;
        setLocationName(
            value
        );
    };
    const { handleSubmit, control, setValue, formState: { errors } } = useForm();
    const postapi = async (url: any, data: any) => {
        const res: any = await postApiMethod(url, data);
        if (res.statusCode === 200) {
            setPostData(res.data.bankDetail)
            // setStep('4')
            // setStep('5')
            if (mode === 'stripe') {
                router.push(res.data.link.url);
            } else {
                router.push('/account-settings/payments/payment-method/');
            }
            dispatch(addAlert({
                isOpen: true,
                message: res.message,
                type: "success",
                severity: "success"
            }));
        }
        else {
            dispatch(addAlert({
                isOpen: true,
                message: res.response.data.message,
                type: "error",
                severity: "error"
            }));
        }

    };
    const editapi = async (url: any, data: any) => {
        const res: any = await putApiMethod(url, data);
        if (res.statusCode === 200) {
            router.push('account-settings/payments/payment-method/')
            setEditValue('')
            dispatch(addAlert({
                isOpen: true,
                message: res.message,
                type: "success",
                severity: "success"
            }))
        }
        else {
            console.log('error')
        }

    };
    const onSubmit = (data: any) => {
        const newData = {
            ...data,
            acctType: selectedValue2,
            country: LocationName,
            paymentMethod: mode
        }
        postapi(APICONSTANT.addBank, newData);
    };

    useEffect(() => {
        setEditData({
            acctHolderName: postData.acctHolderName || '',
            acctNumber: postData.acctNumber || '',
            acctType: postData.acctType || '',
            bankName: postData.bankName || '',
            country: postData.country || '',
            routing_number: postData.routing_number || '',
            permanentAcctNum: postData.permanentAcctNum || '',
            city: postData.address?.city || '',
            state: postData.address?.state || '',
            postalCode: postData.address?.postal_code || '',
            email: postData.email || '',
            phone: postData.phone || ''
        });
    }, [postData]);
    const handleEdit = () => {
        const data = {
            ...editData,
            userBankId: postData._id,
            stripeBankId: postData.stripeBankId,
            stripeAcctId: postData.stripeAcctId
        }
        editapi(APICONSTANT.addBank, data)
    }

    return (
        <div className={`${styles.body} `}>
            <div className={`${styles.header} border-bottom position-relative`}>
                <div className='position-absolute right-0 ' onClick={() => router.push('/account-settings/payments/payment-method/')} style={{ cursor: 'pointer' }}><CloseIcon /></div>
                <div className='d-flex justify-content-center '>
                    <h5 className='m-0'>{i18?.ACCOUNTINFO?.SETUPPAYOUTS || "Setup payouts"}</h5>
                </div>
            </div>
            <div className={`${styles.bodyContent}`}>
                {step === '1' &&
                    <div className={`${styles.content} `} style={{ marginBottom: '100px' }}>

                        <span className={`${styles.span}`}>{i18?.SETUPPAYOUTS?.LETADDPAYOUT || "Let's add a payout method"}</span>
                        <p className={`${styles.p}`}>{i18?.SETUPPAYOUTS?.TOSTARTSENDYOURMONEY || "To start, let us know where you'd like us to send your money."}</p>
                        <div className={`${styles.billing}`}>
                            <p>{`${i18?.SETUPPAYOUTS?.BILLING || "Billing"} ${i18?.PROFILE?.COUNTRY || "country"}/${i18?.PROFILE?.REGION || "region"}`}</p>
                            <FormControl sx={{ width: '100%', '&:focus': { borderColor: 'black' } }}>
                                <Select
                                    displayEmpty
                                    value={LocationName}
                                    onChange={handleChange}
                                    input={<OutlinedInput />}
                                    inputProps={{
                                        'aria-label': 'Without label'
                                        // sx: { borderColor: 'red' }, // Border color when not focused
                                    }}
                                    renderValue={(selected) => {
                                        if (selected.length === 0) {
                                            return <p className='m-0 fs-6'>{`${i18?.SETUPPAYOUTS?.BILLING || "Billing"} ${i18?.PROFILE?.COUNTRY || "country"}/${i18?.PROFILE?.REGION || "region"}`}</p>;
                                        }

                                        return selected;
                                    }}
                                    MenuProps={MenuProps}
                                >
                                    {CountryCode.map((data) => (
                                        <MenuItem
                                            key={data.name}
                                            value={data.code}
                                        >
                                            {`${data.name} (${data.code})`}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div className={`${styles.pay} mt-5 `}>
                            <p>{i18?.ACCOUNTINFO?.HOWYOUGETPAID || "How you'll get paid"}</p>
                            <span className={`${styles.span}`}>{`${i18?.SETUPPAYOUTS?.PAYOUTSWILLBESENTIN || "Payouts will be sent in"} INR.`}</span>
                            <div className={`${styles.box} ${selectedValue ? styles.boxhover : ''}`}>
                                <Bank
                                    width="45"
                                    height="45"
                                    fill="currentColor"
                                />
                                <div className='d-flex justify-content-between '>
                                    <div className='d-grid'>
                                        <span>{i18?.SETUPPAYOUTS?.BANKACCOUNT || "Bank account"}</span>
                                        <ul>
                                            <li className='text-muted'>3–5 {i18?.SETUPPAYOUTS?.BUSINESSDAYS || "business days"}</li>
                                            <li className='text-muted'>{i18?.SETUPPAYOUTS?.NOFEES || "No fees"}</li>
                                        </ul>
                                    </div>
                                    <FormControl>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="row-radio-buttons-group"
                                            onChange={() => setSelectedValue(true)}
                                        >
                                            <FormControlLabel
                                                value=""
                                                label=""
                                                control={
                                                    <Radio
                                                        sx={{
                                                            color: '#717171',
                                                            '&.Mui-checked': {
                                                                color: 'black'
                                                            }

                                                        }}
                                                    />
                                                }
                                            />
                                        </RadioGroup>
                                    </FormControl>
                                </div>
                            </div>
                            {/* {selectedValue && <span style={{fontSize:'12px '}}>Payouts take longer for some banks, and reviews could result in holds or delays. <b style={{textDecoration:'underline'}} onClick={() => setModalOpen(true)}>Learn more</b></span>} */}
                        </div>
                    </div>
                }
                {
                    step === '2' &&
                    <div className={`${styles.content}`} style={{ marginBottom: '100px' }}>

                        <span className={`${styles.span}`}>{i18?.SETUPPAYOUTS?.ADDBANKACCOUNTINFO || "Add bank account info"}</span>
                        <p className={`${styles.p1}`}>{i18?.SETUPPAYOUTS?.CURRENTORSAVINGS || "Is this a current or savings account?"}</p>
                        <FormControl>
                            <RadioGroup
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                value={selectedValue2}
                                onChange={handleRadioChange}
                            >
                                <FormControlLabel
                                    value="current" // Set a unique value for each radio button
                                    label={i18?.SETUPPAYOUTS?.CURRENT || "Current"}
                                    control={
                                        <Radio
                                            sx={{
                                                color: '#717171',
                                                '&.Mui-checked': {
                                                    color: 'black'
                                                }
                                            }}
                                        />
                                    }
                                />
                                <FormControlLabel
                                    value="savings" // Set a unique value for each radio button
                                    label={i18?.SETUPPAYOUTS?.SAVINGS || "Savings"}
                                    control={
                                        <Radio
                                            sx={{
                                                color: '#717171',
                                                '&.Mui-checked': {
                                                    color: 'black'
                                                }
                                            }}
                                        />
                                    }
                                />
                            </RadioGroup>
                        </FormControl>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className='d-grid'>
                                <label className={`${styles.label}`} >{i18?.SETUPPAYOUTS?.BANKNAME || "Bank Name"}</label>
                                <Controller
                                    name="bankName"
                                    control={control}
                                    rules={{ required: 'Bank Name is required' }}
                                    render={({ field }) => (
                                        <>
                                            <StyledTextField
                                                className={`${styles.form_select3}`}
                                                {...field}
                                                variant='filled'
                                                label={i18?.SETUPPAYOUTS?.BANKNAME || "Bank Name"}
                                                error={!!errors.bankName}
                                            />
                                            {errors.bankName && <p className='text-danger'>{errors.bankName.message?.toString()}</p>}
                                        </>
                                    )}
                                />
                            </div>

                            <div className='d-grid'>
                                <label className={`${styles.label}`}>{i18?.SETUPPAYOUTS?.ACCOUNTHOLDERNAME || "Account Holder Name"}</label>
                                <Controller
                                    name="acctHolderName"
                                    control={control}
                                    rules={{ required: 'Account Holder Name is required' }}
                                    render={({ field }) => (
                                        <>
                                            <StyledTextField
                                                className={`${styles.form_select3}`}
                                                {...field}
                                                variant='filled'
                                                label={i18?.SETUPPAYOUTS?.ACCOUNTHOLDERNAME || "Account Holder Name"}
                                                error={!!errors.acctHolderName}
                                            />
                                            {errors.acctHolderName && <p className='text-danger'>{errors.acctHolderName.message?.toString()}</p>}
                                        </>
                                    )}
                                />
                            </div>


                            <div className=''>
                                <label className={`${styles.label}`}>{i18?.SETUPPAYOUTS?.ACCOUNTNUMBER || "Account Number"}</label>
                                <Controller
                                    name="acctNumber"
                                    control={control}
                                    rules={{ required: 'Account Number is required' }}
                                    render={({ field }) => (
                                        <>
                                            <StyledTextField
                                                className={`${styles.form_select3}`}
                                                {...field}
                                                variant='filled'
                                                label={i18?.SETUPPAYOUTS?.ACCOUNTNUMBER || "Account Number"}
                                                error={!!errors.acctNumber}
                                            />
                                        </>
                                    )}
                                />
                                {/* <Controller
                                        name="confirmAccountNumber"
                                        control={control}
                                        rules={{ required: 'Confirm Account Number is required' }}
                                        render={({ field }) => (
                                            <>
                                                <StyledTextField
                                                    className={`${styles.form_select1}`}
                                                    {...field}
                                                    variant='filled'
                                                    label="Confirm Account Number"
                                                    error={!!errors.confirmAccountNumber}
                                                />
                                                {errors.acctNumber && <p className='text-danger'>{errors.acctNumber.message?.toString()}</p>}
                                                {errors.confirmAccountNumber && <p className='text-danger'>{errors.confirmAccountNumber.message?.toString()}</p>}
                                            </>
                                        )}
                                    /> */}
                            </div>


                            <div className='d-grid'>
                                <label className={`${styles.label}`}>{i18?.SETUPPAYOUTS?.ROUTINGNUMBER || "Routing number/IFSC code"}</label>
                                <Controller
                                    name="routing_number"
                                    control={control}
                                    rules={{ required: 'routing_number Code is required' }}
                                    render={({ field }) => (
                                        <>
                                            <StyledTextField
                                                className={`${styles.form_select3}`}
                                                {...field}
                                                variant='filled'
                                                label={i18?.SETUPPAYOUTS?.ROUTINGNUMBER || "Routing number"}
                                                error={!!errors.routing_number}
                                            />
                                            {errors.routing_number && <p className='text-danger'>{errors.routing_number.message?.toString()}</p>}
                                        </>
                                    )}
                                />
                            </div>


                            <div className='d-grid'>
                                <label className={`${styles.label}`}>{`${i18?.SETUPPAYOUTS?.PERMANENTACCOUNTNUMBER || "Permanent Account Number"} (PAN)`}</label>
                                <Controller
                                    name="permanentAcctNum"
                                    control={control}
                                    rules={{ required: 'PAN is required' }}
                                    render={({ field }) => (
                                        <>
                                            <StyledTextField
                                                className={`${styles.form_select3}`}
                                                {...field}
                                                variant='filled'
                                                label={i18?.SETUPPAYOUTS?.PERMANENTACCOUNTNUMBER || "Permanent Account Number"}
                                                error={!!errors.permanentAcctNum}
                                            />
                                            {errors.permanentAcctNum && <p className='text-danger'>{errors.permanentAcctNum.message?.toString()}</p>}
                                        </>
                                    )}
                                />
                            </div>

                            <div className='d-grid'>
                                <label className={`${styles.label}`}>{i18?.PROFILE?.STREETADDRESS || "Street address"}</label>
                                <Controller
                                    name="line1"
                                    control={control}
                                    rules={{ required: i18?.PROFILE?.STREETADDRESS || "Street address" + ' is required' }}
                                    render={({ field }) => (
                                        <>
                                            <StyledTextField
                                                className={`${styles.form_select3}`}
                                                {...field}
                                                variant='filled'
                                                label={i18?.PROFILE?.STREETADDRESS || "Street address"}
                                                error={!!errors.line1}
                                            />
                                            {errors.line1 && <p className='text-danger'>{errors.line1.message?.toString()}</p>}
                                        </>
                                    )}
                                />
                            </div>

                            <div className='d-grid'>
                                <label className={`${styles.label}`}>{i18?.PROFILE?.CITY || "City"}</label>
                                <Controller
                                    name="city"
                                    control={control}
                                    rules={{ required: i18?.PROFILE?.CITY || "City" + ' is required' }}
                                    render={({ field }) => (
                                        <>
                                            <StyledTextField
                                                className={`${styles.form_select3}`}
                                                {...field}
                                                variant='filled'
                                                label={i18?.PROFILE?.CITY || "City"}
                                                error={!!errors.city}
                                            />
                                            {errors.city && <p className='text-danger'>{errors.city.message?.toString()}</p>}
                                        </>
                                    )}
                                />
                            </div>

                            <div className='d-grid'>
                                <label className={`${styles.label}`}>{i18?.PROFILE?.POSTCODE || "Postcode"}</label>
                                <Controller
                                    name="postal_code"
                                    control={control}
                                    rules={{ required: i18?.PROFILE?.POSTCODE || "Postcode" + ' is required' }}
                                    render={({ field }) => (
                                        <>
                                            <StyledTextField
                                                className={`${styles.form_select3}`}
                                                {...field}
                                                variant='filled'
                                                label={i18?.PROFILE?.POSTCODE || "Postcode"}
                                                error={!!errors.postal_code}
                                            />
                                            {errors.postal_code && <p className='text-danger'>{errors.postal_code.message?.toString()}</p>}
                                        </>
                                    )}
                                />
                            </div>

                            <div className='d-grid'>
                                <label className={`${styles.label}`}>{i18?.PROFILE?.STATE || "State"}</label>
                                <Controller
                                    name="state"
                                    control={control}
                                    rules={{ required: i18?.PROFILE?.STATE || "State" + ' is required' }}
                                    render={({ field }) => (
                                        <>
                                            <StyledTextField
                                                className={`${styles.form_select3}`}
                                                {...field}
                                                variant='filled'
                                                label={i18?.PROFILE?.STATE || "State"}
                                                error={!!errors.state}
                                            />
                                            {errors.state && <p className='text-danger'>{errors.state.message?.toString()}</p>}
                                        </>
                                    )}
                                />
                            </div>

                        </form>
                    </div>
                }
                {
                    step === '3' &&
                    <div className={`${styles.content}`} style={{ marginBottom: '100px' }}>
                        <span className={`${styles.span}`}>{i18?.SETUPPAYOUTS?.ADDTHEADDRESS || "Add the address assosiated with this account"}</span>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {/* <FormControl sx={{ width: '100%', '&:focus': { borderColor: 'none' } }}>
                                <Select
                                    displayEmpty
                                    value={LocationName}
                                    onChange={handleChange}
                                    input={<OutlinedInput />}
                                    inputProps={{
                                        'aria-label': 'Without label',
                                        // sx: { borderColor: 'red' }, // Border color when not focused
                                    }}
                                    renderValue={(selected) => {
                                        if (selected.length === 0) {
                                            return <p className='m-0 fs-6'>Billing country/region</p>;
                                        }

                                        return selected;
                                    }}
                                    MenuProps={MenuProps}
                                >
                                    {CountryCode.map((data) => (
                                        <MenuItem
                                            key={data.name}
                                            value={data.name}
                                        >
                                            {data.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl> */}
                            {/* <div className='mb-3'>
                                <Controller
                                    name="line1"
                                    control={control}
                                    rules={{ required: 'Line 1 Address is required' }}
                                    render={({ field }) => (
                                        <>
                                            <StyledTextField
                                                className={`${styles.input6} w-full m-0`}
                                                {...field}
                                                variant='filled'
                                                label="Line 1"
                                                error={!!errors.city}
                                            />
                                            {errors.line1 && <p className='text-danger'>{errors.line1.message?.toString()}</p>}
                                        </>
                                    )}
                                />
                            </div>
                            <div>
                                <Controller
                                    name="city"
                                    control={control}
                                    rules={{ required: 'City Address is required' }}
                                    render={({ field }) => (
                                        <>
                                            <StyledTextField
                                                className={`${styles.input6} w-full m-0`}
                                                {...field}
                                                variant='filled'
                                                label="City"
                                                error={!!errors.city}
                                            />
                                            {errors.city && <p className='text-danger'>{errors.city.message?.toString()}</p>}
                                        </>
                                    )}
                                />
                            </div>
                            <div>

                                <Controller
                                    name="state"
                                    control={control}
                                    rules={{ required: 'State is required' }}
                                    render={({ field }) => (
                                        <>
                                            <StyledTextField
                                                className={`${styles.input6}`}
                                                {...field}
                                                variant='filled'
                                                label="State"
                                                error={!!errors.state}
                                            />
                                            {errors.state && <p className='text-danger'>{errors.state.message?.toString()}</p>}
                                        </>
                                    )}
                                />



                            </div>
                            <div>
                                <Controller
                                    name="postal_code"
                                    control={control}
                                    rules={{ required: 'Postcode is required' }}
                                    render={({ field }) => (
                                        <>
                                            <StyledTextField
                                                className={`${styles.input6}`}
                                                {...field}
                                                variant='filled'
                                                label="Postcode"
                                                error={!!errors.postal_code}
                                            />
                                            {errors.postal_code && <p className='text-danger'>{errors.postal_code.message?.toString()}</p>}
                                        </>
                                    )}
                                />
                            </div> */}

                            {/* <div>
                                <Controller
                                    name="name"
                                    control={control}
                                    rules={{ required: 'Name is required' }}
                                    render={({ field }) => (
                                        <>
                                            <StyledTextField
                                                className={`${styles.input6}`}
                                                {...field}
                                                variant='filled'
                                                label="Name"
                                                error={!!errors.city}
                                            />
                                            {errors.name && <p className='text-danger'>{errors.name.message?.toString()}</p>}
                                        </>
                                    )}
                                />
                            </div> */}
                            <div className=''>
                                <Controller
                                    name="email"
                                    control={control}
                                    rules={{ required: 'Email is required' }}
                                    render={({ field }) => (
                                        <>
                                            <StyledTextField
                                                className={`${styles.input6}`}
                                                {...field}
                                                variant='filled'
                                                label="Email"
                                                error={!!errors.city}
                                            />
                                            {errors.email && <p className='text-danger'>{errors.email.message?.toString()}</p>}
                                        </>
                                    )}
                                />
                            </div>
                            <div className={`${styles.input_border} mt-2 p-1`}>

                                <Controller
                                    name="phone"
                                    control={control}
                                    rules={{ required: 'PhoneNumber is required' }}
                                    render={({ field }) => (
                                        <>
                                            <PhoneInputComponent
                                                onPhoneChange={(number: any, code: any) => {
                                                    setValue("phone", number);
                                                    setValue("phoneCode", code);
                                                }}
                                            />

                                        </>
                                    )}
                                />
                            </div>
                            {errors.phone && <p className='text-danger'>{errors.phone.message?.toString()}</p>}
                        </form>




                    </div>

                }
                {
                    step === '4' &&
                    <div className={`${styles.content}`} style={{ marginBottom: '100px' }}>
                        <span className={`${styles.span}`}> {i18?.SETUPPAYOUTS?.LETSVERIFYINFO || "Let's review info"}</span>
                        <p>{i18?.SETUPPAYOUTS?.ALMOSTDONEJUST || "Almost done! just double-check that everything looks good before yoy submit"}</p>
                        <div className='mb-5'>
                            {/* <div className='mt-3 border-bottom'>
                                        <p>Payout method</p>
                                        {editvalue === 'value1' ?
                                            <StyledTextField className="w-full mb-2" /> : <p>data</p>
                                        }
                                        <p style={{ fontWeight: '600', textDecoration: 'underline',cursor:'pointer'  }} onClick={editvalue === 'value1' ? () => setEditValue('') : () => setEditValue('value1')}>{editvalue === 'value1' ? 'Close' : 'Edit'}</p>
                                    </div> */}
                            <div className='mt-3 border-bottom'>
                                <p>{i18?.SETUPPAYOUTS?.BANKACCOUNTTYPE || "Bank Account Type"}</p>
                                <div className='d-flex justify-content-between'>
                                    {editvalue === 'value2' ?
                                        <FormControl>
                                            <RadioGroup
                                                aria-labelledby="demo-row-radio-buttons-group-label"
                                                name="row-radio-buttons-group"
                                                value={editData.acctType}
                                                onChange={(event) => handleInputChange('acctType', event.target.value)}
                                            >
                                                <FormControlLabel
                                                    value="current" // Set a unique value for each radio button
                                                    label="Current"
                                                    control={
                                                        <Radio
                                                            sx={{
                                                                color: '#717171',
                                                                '&.Mui-checked': {
                                                                    color: 'black'
                                                                }
                                                            }}
                                                        />
                                                    }
                                                />
                                                <FormControlLabel
                                                    value="savings" // Set a unique value for each radio button
                                                    label="Savings"
                                                    control={
                                                        <Radio
                                                            sx={{
                                                                color: '#717171',
                                                                '&.Mui-checked': {
                                                                    color: 'black'
                                                                }
                                                            }}
                                                        />
                                                    }
                                                />
                                            </RadioGroup>
                                        </FormControl> : <p>{editData.acctType}</p>
                                    }
                                    <p style={{ fontWeight: '600', textDecoration: 'underline', cursor: 'pointer' }} onClick={editvalue === 'value2' ? () => setEditValue('') : () => setEditValue('value2')}>{editvalue === 'value2' ? 'Close' : 'Edit'}</p>
                                </div>
                            </div>
                            <div className='mt-3 border-bottom'>
                                <p>{i18?.SETUPPAYOUTS?.ACCOUNTHOLDERNAME || "Account Holder Name"}</p>
                                <div className='d-flex justify-content-between'>
                                    {editvalue === 'value3' ?
                                        <StyledTextField className="w-full mb-2" defaultValue={editData.acctHolderName} onChange={(event) => handleInputChange('acctHolderName', event.target.value)} /> : <p>{editData.acctHolderName}</p>
                                    }
                                    <p style={{ fontWeight: '600', textDecoration: 'underline', cursor: 'pointer' }} onClick={editvalue === 'value3' ? () => setEditValue('') : () => setEditValue('value3')}>{editvalue === 'value3' ? 'Close' : 'Edit'}</p>
                                </div>
                            </div>
                            <div className='mt-3 border-bottom'>
                                <p>{i18?.SETUPPAYOUTS?.PERMANENTACCOUNTNUMBER || "Permanent Account Number"}</p>
                                <div className='d-flex justify-content-between'>
                                    {editvalue === 'value4' ?
                                        <StyledTextField className="w-full mb-2" defaultValue={editData.permanentAcctNum} onChange={(event) => handleInputChange('permanentAcctNum', event.target.value)} /> : <p>{editData.permanentAcctNum}</p>
                                    }
                                    <p style={{ fontWeight: '600', textDecoration: 'underline', cursor: 'pointer' }} onClick={editvalue === 'value4' ? () => setEditValue('') : () => setEditValue('value4')}>{editvalue === 'value4' ? 'Close' : 'Edit'}</p>
                                </div>
                            </div>
                            <div className='mt-3 border-bottom'>
                                <p>{i18?.SETUPPAYOUTS?.BANKNAME || "Bank Name"}</p>
                                <div className='d-flex justify-content-between'>
                                    {editvalue === 'value5' ?
                                        <StyledTextField className="w-full mb-2" defaultValue={editData.bankName} onChange={(event) => handleInputChange('bankName', event.target.value)} /> : <p>{editData.bankName}</p>
                                    }
                                    <p style={{ fontWeight: '600', textDecoration: 'underline', cursor: 'pointer' }} onClick={editvalue === 'value5' ? () => setEditValue('') : () => setEditValue('value5')}>{editvalue === 'value5' ? 'Close' : 'Edit'}</p>
                                </div>
                            </div>
                            <div className='mt-3 border-bottom'>
                                <p>{i18?.SETUPPAYOUTS?.ROUTINGNUMBER || "Routing number"}</p>
                                <div className='d-flex justify-content-between'>
                                    {editvalue === 'value6' ?
                                        <StyledTextField className="w-full mb-2" defaultValue={editData.routing_number} onChange={(event) => handleInputChange('routing_number', event.target.value)} /> : <p>{editData.routing_number}</p>
                                    }
                                    <p style={{ fontWeight: '600', textDecoration: 'underline', cursor: 'pointer' }} onClick={editvalue === 'value6' ? () => setEditValue('') : () => setEditValue('value6')}>{editvalue === 'value6' ? 'Close' : 'Edit'}</p>
                                </div>
                            </div>
                            <div className='mt-3 border-bottom'>
                                <p>{i18?.SETUPPAYOUTS?.ACCOUNTNUMBER || "Account number"}</p>
                                <div className='d-flex justify-content-between'>
                                    {editvalue === 'value7' ?
                                        <StyledTextField className="w-full mb-2" defaultValue={editData.acctNumber} onChange={(event) => handleInputChange('acctNumber', event.target.value)} /> : <p>{editData.acctNumber}</p>
                                    }
                                    <p style={{ fontWeight: '600', textDecoration: 'underline', cursor: 'pointer' }} onClick={editvalue === 'value7' ? () => setEditValue('') : () => setEditValue('value7')}>{editvalue === 'value7' ? 'Close' : 'Edit'}</p>
                                </div>
                            </div>
                            <div className='mt-3 border-bottom'>
                                <p>City</p>
                                <div className='d-flex justify-content-between'>
                                    {editvalue === 'value8' ?
                                        <StyledTextField className="w-full mb-2" defaultValue={editData.city} onChange={(event) => handleInputChange('city', event.target.value)} /> : <p>{editData.city}</p>
                                    }
                                    <p style={{ fontWeight: '600', textDecoration: 'underline', cursor: 'pointer' }} onClick={editvalue === 'value8' ? () => setEditValue('') : () => setEditValue('value8')}>{editvalue === 'value8' ? 'Close' : 'Edit'}</p>
                                </div>
                            </div>
                            <div className='mt-3 border-bottom'>
                                <p>{i18?.PROFILE?.STATE || "State"}</p>
                                <div className='d-flex justify-content-between'>
                                    {editvalue === 'value9' ?
                                        <StyledTextField className="w-full mb-2" defaultValue={editData.state} onChange={(event) => handleInputChange('state', event.target.value)} /> : <p>{editData.state}</p>
                                    }
                                    <p style={{ fontWeight: '600', textDecoration: 'underline', cursor: 'pointer' }} onClick={editvalue === 'value9' ? () => setEditValue('') : () => setEditValue('value9')}>{editvalue === 'value9' ? 'Close' : 'Edit'}</p>
                                </div>
                            </div>
                            <div className='mt-3 border-bottom'>
                                <p>{i18?.SETUPPAYOUTS?.EMAIL || "Email"}</p>
                                <div className='d-flex justify-content-between'>
                                    {editvalue === 'value10' ?
                                        <StyledTextField className="w-full mb-2" defaultValue={editData.email} onChange={(event) => handleInputChange('email', event.target.value)} /> : <p>{editData.email}</p>
                                    }
                                    <p style={{ fontWeight: '600', textDecoration: 'underline', cursor: 'pointer' }} onClick={editvalue === 'value10' ? () => setEditValue('') : () => setEditValue('value10')}>{editvalue === 'value10' ? 'Close' : 'Edit'}</p>
                                </div>
                            </div>
                            <div className='mt-3 border-bottom'>
                                <p>{i18?.PROFILE?.POSTCODE || "Postal code"}</p>
                                <div className='d-flex justify-content-between'>
                                    {editvalue === 'value11' ?
                                        <StyledTextField className="w-full mb-2" defaultValue={editData.postalCode} onChange={(event) => handleInputChange('postalCode', event.target.value)} /> : <p>{editData.postalCode}</p>
                                    }
                                    <p style={{ fontWeight: '600', textDecoration: 'underline', cursor: 'pointer' }} onClick={editvalue === 'value11' ? () => setEditValue('') : () => setEditValue('value11')}>{editvalue === 'value11' ? 'Close' : 'Edit'}</p>
                                </div>
                            </div>
                            <div className='mt-3 border-bottom'>
                                <p>{i18?.SETUPPAYOUTS?.PHONE || "Phone"}</p>
                                <div className='d-flex justify-content-between'>
                                    {editvalue === 'value12' ?
                                        <StyledTextField className="w-full mb-2" defaultValue={editData.phone} onChange={(event) => handleInputChange('phone', event.target.value)} /> : <p>{editData.phone}</p>
                                    }
                                    <p style={{ fontWeight: '600', textDecoration: 'underline', cursor: 'pointer' }} onClick={editvalue === 'value12' ? () => setEditValue('') : () => setEditValue('value12')}>{editvalue === 'value12' ? 'Close' : 'Edit'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                {step === '5' &&
                    <div className={`${styles.content}`}>
                        <span className={`${styles.span}`}> {i18?.ACCOUNTINFO?.WEARESETTING || "We're setting things up"}</span>
                        <p>{i18?.SETUPPAYOUTS?.HEREISWHATWILL || "Here's what will happens next"}:</p>
                        <ul><li>{i18?.SETUPPAYOUTS?.YOURPAYOUTMETHOD || "Your payout method will be verified within 10 business days"}</li></ul>
                        <p>{i18?.ACCOUNTINFO?.YOUWILLGETEMAILFROMUS || "you'll get email from us once everything is verified and your're able to receive payout. if there's anything else you need to do,we'll contact you."}
                        </p>

                        <h5 style={{ fontWeight: '600' }}>{i18?.ACCOUNTINFO?.WHENTOEXPEXT || "When to expect your payouts"}</h5>
                        <p> {i18?.ACCOUNTINFO?.YOURMONEYWILLBESENT || "Your money will be sent 24 hours after a guest checks in and usually arrives in your account in 7 bussiness account.Processing time will be vary"}</p>
                    </div>
                }
            </div>
            <div className={`${styles.footer} border-top`}>
                <div className='d-flex justify-content-between'>
                    {step === '1' &&
                        <>
                            <div></div>
                            {/* <HTMLButton 
                             disabled={!selectedValue || !LocationName}
                             className={`${selectedValue && LocationName ? styles.button : styles.buttonDisable}`} onClick={() => setStep('2')}
                                text={i18?.AUTH?.CONTINUE || "Continue"}
                            /> */}
                            <Button
                                disabled={!selectedValue || !LocationName}
                                className={`${selectedValue && LocationName ? styles.button : styles.buttonDisable}`}
                                onClick={() => setStep('2')}
                            >
                                {i18?.AUTH?.CONTINUE || "Continue"}
                            </Button>
                        </>
                    }
                    {
                        step === '2' &&
                        <>
                            <Button className={`${styles.button1}`} onClick={() => {
                                setStep('1');
                                setSelectedValue(false)
                            }}>
                                {i18?.BUTTONS?.BACK || "Back"}
                            </Button>
                            <DynamicButtonComponent variant="outlined" onClick={() => { mode === 'stripe' ? handleSubmit(onSubmit)() : setStep('3') }}
                                text="Next"
                            />
                        </>

                    }
                    {
                        step === '3' &&
                        <>
                            <Button className={`${styles.button1}`} onClick={handleSubmit(() => setStep('2'))}>
                                {i18?.BUTTONS?.BACK || "Back"}
                            </Button>
                            <DynamicButtonComponent variant="outlined" onClick={() => { handleSubmit(onSubmit)() }}
                                text="Next"
                            />
                        </>

                    }
                    {
                        step === '4' &&
                        <>
                            <Button className={`${styles.button1}`} onClick={() => setStep('2')}>
                                {i18?.BUTTONS?.BACK || "Back"}
                            </Button>
                            <Button className={`${styles.button} d-flex gap-2`} onClick={handleEdit}>
                                <LockIcon /> <p className='d-flex align-items-center mb-0'>{i18?.LISTING?.SUBMIT || "Submit"}</p>
                            </Button>
                        </>

                    }
                    {/* {
                        step === '5' &&
                        <>
                            <div></div>
                            <Button className={`${styles.button} d-flex gap-2`} onClick={() => setStep('5')}>
                                <p className='d-flex align-items-center mb-0'>Done</p>
                            </Button>
                        </>
                    } */}
                </div>
            </div>
        </div>
    )
}

export default SetupPayout
