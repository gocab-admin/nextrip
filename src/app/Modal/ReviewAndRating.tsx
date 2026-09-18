import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import Rating from "@mui/material/Rating";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";

import Textarea from "@/components/textArea";
import { setModal } from "@/redux/slice/modalSlice";
import { dispatch } from "@/redux/store";
import { postApiMethod } from "@/services/global";
import { addAlert } from "@/redux/slice/AlertSlice";
import APICONSTANT from "@/services/config";
import DynamicButtonComponent from "@/components/DynamicComponent/ButtonComponent";
import { Skeleton } from '@mui/material';

import styles from "./review.module.scss";
import { ThreeDots } from "react-loader-spinner";

function ReviewsAndRatings(props: any) {
  const { i18 } = props;
  const selectedRowId = useSelector(
    (state: any) => state.bookingEstimation.selectedRowId
  );
  const BookingID = useSelector((state: any) => state.bookingEstimation.bookingId)
  const Reviewdata = useSelector((state: any) => state?.about?.GetReview?.listingReview);
  const loader = useSelector((state: any) => state?.about?.loader);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [reviewData, setReviewData] = useState({
    Cleanliness: 0,
    Accuracy: 0,
    Communication: 0,
    Location: 0,
    CheckIn: 0,
    Value: 0
  });
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setReviewData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };
  const closeModal = () => {
    dispatch(setModal("" as any));
  };
  const handleTextchange = (event: any) => {
    const { value } = event.target;
    setText(value);
  };
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data: any) => {
    try {
      if (selectedRowId) {
        const response = await postApiMethod(
          `${APICONSTANT.reviewRating}/${selectedRowId}/${BookingID}`,
          {
            ...reviewData,
            review: data.review,
            type: "user"
          }
        );

        if (response.statusCode === 200) {
          setReviewData({
            Cleanliness: 0,
            Accuracy: 0,
            Communication: 0,
            Location: 0,
            CheckIn: 0,
            Value: 0
          });
          dispatch(
            addAlert({
              isOpen: true,
              message: response.message,
              type: "success",
              severity: "success"
            })
          );
        } else {
          console.error("Failed to submit the review");
        }
      } else {
        console.error("Unable to retrieve the id from localStorage");
      }
    } catch (error) {
      console.error("An error occurred while submitting the review", error);
    }
    closeModal();
  };
  useEffect(() => {
    debugger
    if ( Reviewdata?.rating?.Cleanliness) {
      // setText(Reviewdata?.review)
      reset({
        review: Reviewdata?.review
      })
      setReviewData(Ratings)
    } else {
      setReviewData({
        Cleanliness: 0,
        Accuracy: 0,
        Communication: 0,
        Location: 0,
        CheckIn: 0,
        Value: 0
      })
      reset({})
    }
    
    setLoading(false);
  }, [Reviewdata])

  // useEffect(() => {
  //   if (Reviewdata && Reviewdata.length > 0) {
  //     // Mapping through the reviewRating array
  //     Reviewdata.forEach((Reviewdata: any) => {
  //       setReviewData((prevData) => ({
  //         ...prevData,
  //         Cleanliness: Reviewdata?.rating?.Cleanliness,
  //         Accuracy: Reviewdata?.rating?.Accuracy,
  //         Communication: Reviewdata?.rating?.Communication,
  //         Location: Reviewdata?.rating?.Location,
  //         CheckIn: Reviewdata?.rating?.Check_in,
  //         Value: Reviewdata?.rating?.Value,
  //       }));

  //       // Resetting the form with the review text
  //       reset({
  //         review: Reviewdata?.review,
  //       });
  //     });
  //   }
  // }, [Reviewdata]);


  const Ratings = useMemo(() => ({
    Cleanliness: Reviewdata?.rating?.Cleanliness || 0,
    Accuracy: Reviewdata?.rating?.Accuracy || 0,
    Communication: Reviewdata?.rating?.Communication || 0,
    Location: Reviewdata?.rating?.Location || 0,
    CheckIn: Reviewdata?.rating?.Check_in || 0,
    Value: Reviewdata?.rating?.Value || 0,
  }), [Reviewdata]);

  return (

    <>
      {
        loader ?
          <div className='d-flex justify-content-center'>
            <ThreeDots
              visible={true}
              height="80"
              width="80"
              color="var(--search-button-color)"
              radius="9"
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
          :
          <section >

            <div className={`${styles.grid} p-3`}>
              <div className={`${styles.gridContent}`}>
                <label htmlFor="Cleanliness">{i18?.TRIPS?.CLEANLINESS || "Cleanliness"}:</label>
                {loading ? (
                  <Skeleton variant="rectangular" width={210} height={30} />
                ) : (
                  <Rating
                    name="Cleanliness"
                    id="Cleanliness"
                    value={reviewData.Cleanliness}
                    onChange={handleInputChange}
                    sx={{ fontSize: 'var(--homepage-header-size)', color: 'var(--text-color)', fontFamily: 'var(--font-family-base)' }}
                    readOnly={Reviewdata?.rating?.Cleanliness > 0}
                  />
                )}
              </div>
              <div className={`${styles.gridContent}`}>
                <label htmlFor="Accuracy">{i18?.TRIPS?.ACCURACY || "Accuracy"}:</label>
                {loading ? (
                  <Skeleton variant="rectangular" width={210} height={30} />
                ) : (
                  <Rating
                    name="Accuracy"
                    id="Accuracy"
                    value={reviewData.Accuracy}
                    onChange={handleInputChange}
                    sx={{ fontSize: 'var(--homepage-header-size)', color: 'var(--text-color)', fontFamily: 'var(--font-family-base)' }}
                    readOnly={Reviewdata?.rating?.Accuracy > 0}
                  />
                )}
              </div>
              <div className={`${styles.gridContent}`}>
                <label htmlFor="Communication">{i18?.TRIPS?.COMMUNICATION || "Communication"}:</label>
                {loading ? (
                  <Skeleton variant="rectangular" width={210} height={30} />
                ) : (
                  <Rating
                    name="Communication"
                    id="Communication"
                    value={reviewData.Communication}
                    onChange={handleInputChange}
                    sx={{ fontSize: 'var(--homepage-header-size)', color: 'var(--text-color)', fontFamily: 'var(--font-family-base)' }}
                    readOnly={Reviewdata?.rating?.Communication > 0}
                  />
                )}
              </div>
              <div className={`${styles.gridContent}`}>
                <label htmlFor="Location">{i18?.TRIPS?.LOCATION || "Location"}:</label>
                {loading ? (
                  <Skeleton variant="rectangular" width={210} height={30} />
                ) : (
                  <Rating
                    name="Location"
                    id="Location"
                    value={reviewData.Location}
                    onChange={handleInputChange}
                    sx={{ fontSize: 'var(--homepage-header-size)', color: 'var(--text-color)', fontFamily: 'var(--font-family-base)' }}
                    readOnly={Reviewdata?.rating?.Location > 0}
                  />
                )}
              </div>
              <div className={`${styles.gridContent}`}>
                <label htmlFor="CheckIn">{i18?.HEADER?.AMENITIES || "Amenities"}:</label>
                {loading ? (
                  <Skeleton variant="rectangular" width={210} height={30} />
                ) : (
                  <Rating
                    name="CheckIn"
                    id="CheckIn"
                    value={reviewData.CheckIn}
                    onChange={handleInputChange}
                    sx={{ fontSize: 'var(--homepage-header-size)', color: 'var(--text-color)', fontFamily: 'var(--font-family-base)' }}
                    readOnly={Reviewdata?.rating?.Check_in > 0}
                  />
                )}
              </div>
              <div className={`${styles.gridContent}`}>
                <label htmlFor="Value">{i18?.TRIPS?.SECURITY || "Security"}:</label>
                {loading ? (
                  <Skeleton variant="rectangular" width={210} height={30} />
                ) : (
                  <Rating
                    name="Value"
                    id="Value"
                    value={reviewData.Value}
                    onChange={handleInputChange}
                    sx={{ fontSize: 'var(--homepage-header-size)', color: 'var(--text-color)', fontFamily: 'var(--font-family-base)' }}
                    readOnly={Reviewdata?.rating?.Value > 0}
                  />
                )}
              </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex justify-center p-3">
                <Controller
                  name="review"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: (i18?.REVIEWLIST?.REVIEWISREQUIRED || "Review is required")
                  }}
                  render={({ field }) => (
                    <Textarea
                      style={{ color: 'var(--text-color' }}
                      {...field}
                      disabled={Reviewdata?.review}
                      error={!!errors.review}
                      placeholder={i18?.REVIEWS?.USERREVIEW || "Say Something about your experience in this place......"}
                      className={`${styles.Textarea}`}
                    />
                  )} />
                {errors.review && <div className={`${styles.color}`}>{errors.review.message?.toString()}</div>}
              </div>

              <div
                className={`${styles.modal_bottom} d-flex justify-content-end border-top p-3`}
              >
                {/* <MuiButton
        type="submit"
        label={i18?.LISTING?.SUBMIT || "Submit"}
        sx={{
          border: '2px solid #ffffff',
          textTransform: 'capitalize',
          color: '#ffffff',
          backgroundColor: '#000 !important',
          float: 'right',
          borderRadius: '5px',
          margin: '15px'
        }}
        startIcon={undefined}
        variant={undefined}
        endIcon={<SendOutlinedIcon sx={{ color: 'white' }} />} /> */}
                {Reviewdata?.length === 0 &&
                  <DynamicButtonComponent
                    type="submit"
                    text={i18?.LISTING?.SUBMIT || "Submit"}
                    sx={{ padding: '6px 8px', margin: '15px' }}
                    startIcon={undefined}
                    variant="outlined"
                    endIcon={<SendOutlinedIcon />} />
                }
              </div>
            </form>
          </section>

      }


    </>

  )
}
export default ReviewsAndRatings;
