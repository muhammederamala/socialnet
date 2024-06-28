import React from "react";
import { Modal } from "react-bootstrap";
import ModalPortal from "../ModalPortal";
import { useDispatch, useSelector } from "react-redux";
import { modalActions } from "../../redux/modalSlice";

import CommentsSection from "../../Components/PC/comments/CommentsSection";

function CommentsModal() {
    const dispatch = useDispatch();
    const showModal = useSelector((state) => state.modal.commentsModal.show);
    const postId = useSelector((state) => state.modal.commentsModal.postId);

    const onHideHandler = () => {
        dispatch(modalActions.hideCommentsModal());
    };

    return (
        <ModalPortal>
            <Modal show={showModal} onHide={onHideHandler} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Comments</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CommentsSection postId={postId} />
                </Modal.Body>
            </Modal>
        </ModalPortal>
    );
}

export default CommentsModal;
