import React from "react";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css';

interface PhoneInputComponentProps {
    value?: string | any;
    onPhoneChange?: (value: any, code: any) => void | any;
    country?: string;
    inputStyle?: React.CSSProperties;
    dropdownStyle?: React.CSSProperties;
    errors?: boolean | any
}

const PhoneInputComponent: React.FC<PhoneInputComponentProps> = ({
    value,
    onPhoneChange,
    country = "us", // default country
    errors = false, // default style
}) => {
    const handlePhoneChange = (value: string, data: any) => {
        const code = data.dialCode;
        const number = value.slice(code.length);
        if(onPhoneChange)
        onPhoneChange(number, code); // passing phone number and country code back
    };

    return (
        <div className="w-full">
            <PhoneInput
                value={value}
                onChange={handlePhoneChange}
                country={country}
                inputStyle={{
                    width: '100%',
                    padding: '23px',
                    border:'none'
                }}
                buttonStyle={{
                    width:'100px',
                    padding: '23px',
                    border:'none',
                    borderRadius: '7px',
                }}
            />
        </div>
    );
};

export default PhoneInputComponent;
