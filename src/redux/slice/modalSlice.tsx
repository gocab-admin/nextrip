import { createSlice } from '@reduxjs/toolkit'

type ModalState = {
  isOpen: boolean;
  activeModel: string;
  modalData?: any;
}

const initialState: ModalState = {
  isOpen: false,
  activeModel: '',
  modalData: {}
}

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state: any) => {
      state.isOpen = true
    },
    closeModals: (state: any) => {
      state.isOpen = false
    },
    setConfirmModaData: (state, action) => {
      if(action.payload.func) {
        action.payload.func();
      }
      state.modalData = action.payload.modal
      state.activeModel = action.payload.name
    },
    setModal: (state: any, action: any) => {
      state.activeModel = action.payload
    }

  }
})

export const {
  openModal, closeModals, setModal, setConfirmModaData
} = modalSlice.actions
export default modalSlice.reducer
