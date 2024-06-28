import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userProfileUpload: false,
  commentsModal: {
    show: false,
    postId: "",
  },
};

const modalSlice = createSlice({
  name: "modal",
  initialState: initialState,
  reducers: {
    showUserProfileUpload(state) {
      state.userProfileUpload = true;
    },
    hideUserProfileUpload(state) {
      state.userProfileUpload = false;
    },

    // comments
    showCommentsModal(state, action) {
      state.commentsModal.show = true;
      state.commentsModal.postId = action.payload.postId;
    },
    hideCommentsModal(state) {
      state.commentsModal.show = false;
      state.commentsModal.postId = "";
    },
  },
});

export const { actions: modalActions, reducer: modalReducer } = modalSlice;
