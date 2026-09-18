import React, { useEffect, useState } from 'react';
import CustomModal from "@/components/modal";
import { usePageContext } from "@/components/Providers/PageContext";
import styles from './reportHost.module.scss';
import Textarea from '@/components/textArea';
import dynamic from 'next/dynamic';
import { getApiMethod, postApiMethod } from '@/services/global';
import { toast } from 'react-toastify';

interface ReportHostProps {
    open: boolean;
    onClose: () => void;
    onSubmit?: (data: { reason: string; notes: string }) => void;
    hostData: any;
}

const DynamicButtonComponent = dynamic(
    () => import("@/components/DynamicComponent/ButtonComponent")
)

const ReportHost: React.FC<ReportHostProps> = ({ open, onClose, hostData }) => {
    const HostID = hostData?._id;
    const { i18 } = usePageContext();
    const [reportHostDesc, setReportHostDesc] = useState<Array<any>>([]);
    const [selectedReason, setSelectedReason] = useState<string>('');
    const [notes, setNotes] = useState<string>('');
    const [errors, setErrors] = useState<{ reason?: string; notes?: string }>({});

    useEffect(() => {
        fetchReportReason();
    }, []);

    const fetchReportReason = async() => {
        const url = 'reportUser/description'
        try {
            const response = await getApiMethod(url);
            if(response?.statusCode === 200) {
                setReportHostDesc(response?.data?.reportUserDescription);
            }
        }catch(error) {
            console.error("Error in fetching report reason", error);
        }
    }

    const validateForm = () => {
        const newErrors: { reason?: string; notes?: string } = {};
        if (!selectedReason) {
            newErrors.reason = i18?.REPORTHOST?.REASON_REQUIRED || "Please select a report reason.";
        }
        if (!notes.trim()) {
            newErrors.notes = i18?.REPORTHOST?.NOTES_REQUIRED || "Please add a comment to help us understand what the problem is with this host.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleReasonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedReason(event.target.value);
        if (errors.reason) {
            setErrors((prev) => ({ ...prev, reason: undefined }));
        }
    };

    const handleNotesChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNotes(event.target.value);
        if (errors.notes) {
            setErrors((prev) => ({ ...prev, notes: undefined }));
        }
    };

    const handleSubmit = async() => {
        if (validateForm()) {
            try {
                const payload = new URLSearchParams();
                payload.append('reason', selectedReason);
                payload.append('details', notes);
                const response = await postApiMethod(`reportUser/${HostID}`, payload.toString());
                if(response?.statusCode === 201) {
                    toast.info(response?.message)
                    handleModalClose();
                }
            } catch(error) {
                console.error('Error in reporting host', error);
            }
        }
    };

    const handleModalClose = () => {
        setSelectedReason('');
        setNotes('');
        setErrors({});
        onClose();
    };

    // const isButtonDisabled = !selectedReason || !notes.trim();

    return (
        <CustomModal
            open={open}
            onClose={handleModalClose}
            title={i18?.REPORTHOST?.USERCOMPLAINT || "User Complaint"}
        >
            <div className={styles.reportReason}>
                {reportHostDesc?.map((reason, index) => (
                    <label
                        key={index}
                        className={styles.reportHostRadioReasons}
                        htmlFor={`reason-${index}`}
                    >
                        <input
                            id={`reason-${index}`}
                            className={styles.reportHostRadioBtn}
                            value={reason?.title}
                            type="radio"
                            name="reportReason"
                            checked={selectedReason === reason?.title}
                            onChange={handleReasonChange}
                        />
                        {reason?.title}
                    </label>
                ))}
                {errors.reason && (
                    <p className={styles.errorText}>{errors.reason}</p>
                )}
            </div>
            <div className={styles.reportReasonTextarea}>
                <label htmlFor="reportNotes" className={styles.reportHostTextareaLabel}>
                    {i18?.REPORTHOST?.ADDITIONAL_COMPLAINTS || "Additional Complaints :"}
                </label>
                <Textarea
                    id="reportNotes"
                    className={styles.reportHostTextarea}
                    placeholder="If you have any other complaints to help us resolve this issue, please add them."
                    value={notes}
                    onChange={handleNotesChange}
                />
                {errors.notes && (
                    <p className={styles.errorText}>{errors.notes}</p>
                )}
            </div>
            <div className={styles.reportHostSubmitBtn}>
                <DynamicButtonComponent
                    variant="outlined"
                    onClick={handleSubmit}
                    text={i18?.REPORTHOST?.SENDACOMPLAINT || "Send Complaint"}
                    // disabled={isButtonDisabled} // disable working but color only have to update
                />
            </div>
        </CustomModal>
    );
};

export default ReportHost;
