// RecaptchaComponent.tsx
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const RecaptchaComponent = forwardRef(({
  onVerify, google
}: {onVerify: any; google: any }, ref) => {
  const ReCaptchaRef = useRef<any>();
  const CAPTCHA_id = google?.googleRecaptchaSiteKey
  
  const handleVerify = (captchaToken: string | null) => {
    onVerify(captchaToken);
  };

  useImperativeHandle(ref, () => {
    return {
      reset: () => {
        ReCaptchaRef.current.reset();
      }
    };
  }, []);

  return (
    <div>
      <ReCAPTCHA sitekey={CAPTCHA_id} onChange={handleVerify} ref={ReCaptchaRef} />
    </div>
  );
});
export default RecaptchaComponent;
