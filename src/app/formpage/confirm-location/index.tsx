"use client";

import dynamic from "next/dynamic";
import React, { FormEvent, useEffect, useState } from "react";
import styles from "./page.module.scss";
import { usePageContext } from "@/components/Providers/PageContext";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { Controller, UseFormSetValue } from "react-hook-form";
const Map = dynamic(() => import("@/components/locationmap"));
const MenuItem = dynamic(() => import("@mui/material/MenuItem"));

const countryData = [
  { label: "Afghanistan - AF", value: "AF" },
  { label: "Åland Islands - AX", value: "AX" },
  { label: "Albania - AL", value: "AL" },
  { label: "India - IN", value: "IN" }
];

interface Props {
  control: any;
  setValue: UseFormSetValue<any>;
  location: any;
  setLocation: any;
  errors: any;
}

function ConfirmAddress({
  control,
  setValue,
  location,
  setLocation,
  errors
}: Props) {
  const { i18 } = usePageContext();
  console.log('====================================');
  console.log(location);
  console.log('====================================');

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const changeGeo = (data: any) => {
    setLocation((prev: any) => ({ ...prev, ...data }));
  };

  const changeAddress = (address: any) => {
    if (typeof address === "string") {
      setLocation((prev: any) => ({ ...prev, location: address }));
    } else {
      setLocation((prev: any) => ({
        ...prev,
        location: address.selectedPlace
      }));
    }
  };

  const requiredIndicator = ' *'

  return (
    <section className={`${styles.host}`}>
      <div className={`${styles.step4}`}>
        <div className={`${styles.checkbox} col-md-7 h-100 mt-5 checkbox`}>
          <h1 className="me-2">
            {i18?.CONFIRMADDRESS?.TITLE || "Confirm your address"}
          </h1>
          <p style={{ color: "var(--text-color)" }}>
            {i18?.CONFIRMADDRESS?.TEXT ||
              "Your address is only shared with guests after they’ve made a reservation."}
          </p>
          <div className={`${styles.regional_images4} pb-4`}>
            <form onSubmit={onSubmit} className="mb-3">
              {/* register your input into the hook by invoking the "register" function */}
              <div className="mb-3 w-100">
                <FormControl className="w-[100%]">
                  <InputLabel id="country-label">
                    {i18?.PROFILE?.COUNTRY || "Country"}
                    {/* {i18?.PROFILE?.REGION || "region"}{requiredIndicator} */}
                  </InputLabel>
                  <Controller
                    name="country"
                    control={control}
                    render={({ field }) => (
                      <Select
                        labelId="country-label"
                        id="country-select"
                        label={(i18?.PROFILE?.COUNTRY || "Country/region")+requiredIndicator}
                        error={!!errors.country}
                        {...field}
                      >
                        <MenuItem value={field.value}>{field.value}</MenuItem>
                        {countryData?.map((country) => (
                          <MenuItem key={country.value} value={country.label}>
                            {country.label}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </div>

              {/* include validation with required or other standard HTML validation rules */}
              {/* <TextField
                    label={i18?.PROFILE?.HOUSEFLATNO || "House, flat No etc.."}
                    value={houseNo}
                    onChange={(e) => {
                      dispatch(flatNo(e.target.value));
                    }}
                  /> */}
              <Controller
                name="Address"
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    value={value || ""}
                    label={(i18?.PROFILE?.STREETADDRESS || "Street address")+requiredIndicator}
                    error={!!errors.Address}
                    onChange={(e) => {
                      const value = e.target.value;

                      // Split the value into number and alphabet parts
                      const parts: RegExpMatchArray | null =
                        value.match(/^(\d*)\s*(.*)$/);
                      const newHouseNo = parts ? parts[1] : "";
                      const newStreet = parts ? parts[2].trimStart() : ""; // Remove leading spaces from the street part

                      // Automatically add a space after the number if it's followed by any text
                      const formattedStreet =
                        newHouseNo && newStreet ? ` ${newStreet}` : newStreet;

                      // Update the combined address in the TextField
                      const combinedAddress = newHouseNo + formattedStreet;
                      // onChange(combinedAddress);
                      setValue("Address", combinedAddress, {
                        shouldValidate: true
                      });
                      // Update state and dispatch actions
                      // dispatch(setData({ houseNo: newHouseNo, street: formattedStreet}));
                    }}
                  />
                )}
              />
              {/* <TextField
                    value={area}
                    label={
                      (i18?.PROFILE?.AREA || "Area") +
                      "/" +
                      (i18?.PROFILE?.VILLAGE || "Village")
                    }
                    onChange={(e) => {
                      dispatch(addArea(e.target.value));
                    }}
                  /> */}
              <Controller
                name="landmark"
                control={control}
                render={({ field }) => (
                  <TextField
                    error={!!errors.landmark}
                    label={i18?.PROFILE?.LANDMARK || "Near by landmark"}
                    {...field}
                  />
                )}
              />

              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <TextField
                    error={!!errors.city}
                    label={`${i18?.PROFILE?.CITY || "City"}/${
                      i18?.PROFILE?.TOWN || "town"
                    }${  requiredIndicator}`}
                    {...field}
                  />
                )}
              />
              {/* errors will return when field validation fails  */}
              {/* {errors.exampleRequired && <span>This field is required</span>} */}

              <Controller
                name="zipcode"
                control={control}
                render={({ field }) => (
                  <TextField
                    error={!!errors.zipcode}
                    label={(i18?.PROFILE?.POSTCODE || "Postcode")+requiredIndicator}
                    {...field}
                  />
                )}
              />

              <Controller
                name="state"
                control={control}
                render={({ field }) => (
                  <TextField
                    error={!!errors.state}
                    label={`${i18?.PROFILE?.STATE || "State"}/${
                      i18?.PROFILE?.TERRITORY || "territory"
                    }${requiredIndicator}`}
                    className=""
                    {...field}
                  />
                )}
              />
            </form>
            <hr />
            <Map
              onChangeAddress={changeAddress}
              onChange={changeGeo}
              value={{
                latitude: location.lat || 9.933491,
                longitude: location.lng || 78.127579
              }}
              location={location.location}
              auto="hide"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default ConfirmAddress;
