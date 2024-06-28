import React from 'react'
import { useDispatch } from 'react-redux'

import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import UserProfileDefaultImage from '../../../../../../assets/images/userDefaultProfile.jpg'
import { modalActions } from '../../../../../../redux/modalSlice'

import styles from './UserProfileImage.module.css'

function UserProfileImage({ responseObject }) {
    const dispatch = useDispatch();
    const imageUploadHandler = () => {
        dispatch(modalActions.showUserProfileUpload())
    }
    const profileImageSrc = responseObject.userProfile.profileImageUrl ? responseObject.userProfile.profileImageUrl : UserProfileDefaultImage
    return (
        <div className={styles.container}>
            <img src={profileImageSrc} className={styles.profileImage} alt="User profile" />
            <FontAwesomeIcon onClick={imageUploadHandler} icon={faPlus} className={styles.plusIcon} />
        </div>
    )
}

export default UserProfileImage
