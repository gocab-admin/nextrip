import React from 'react'
import CustomModal from "@/components/modal";
function MobileDialog({children, onClose, title}:any) {
  return (
    <CustomModal
          open={true}
          onClose={onClose}
          sx={{ fontSize: "var(--notes-text)" }}
          title={title}
        >
            {children}
        </CustomModal>
  )
}
export default MobileDialog
