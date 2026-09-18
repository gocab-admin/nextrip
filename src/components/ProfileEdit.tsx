"use client";
import React from "react";
import { Box, Modal, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { usePageContext } from "@/components/Providers/PageContext";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 3
  // p: 4,
};

const ProfileEdit = (props: any) => {
  const { i18 } = usePageContext();

  const { modalOpen, setModalOpen, heading, text, placeholder } = props;

  return (
    <>
      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
      >
        <Box sx={style}>
          <div>
            <div className="p-4">
              <CloseIcon
                onClick={() => {
                  setModalOpen(false);
                }}
              />
            </div>
            <div className="px-4 pt-3 pb-4">
              <h5 className="">{heading}</h5>
              <p>{text}</p>
              <TextField className="w-100" label={placeholder} />
            </div>
          </div>
          <div className="border-top py-3 px-4 d-flex justify-content-end">
            <button className="py-3 px-4">
              {i18?.ROOMPAGE?.SAVE || "Save"}
            </button>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default ProfileEdit;
