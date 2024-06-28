import React from "react";
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from "react-router-dom";

import SignupPage from "../pages/SignupPage";
import Layout from "../Layout/Layout";
import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import ProfilePage from "../pages/profilePage/ProfilePage"
import AddPostPage from "../pages/addPost/AddPostPage";
import PostPage from "../pages/post/PostPage";
import SearchPage from "../pages/search/SearchPage";
import VisitUserProfilePage from "../pages/visitUserProfile/VisitUserProfilePage";

const Router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/user-profile/:email" element={<VisitUserProfilePage />} />
            <Route path="/add-post" element={<AddPostPage />} />
            <Route path="/post/:postId" element={<PostPage />} />
        </Route>
    )
);

export default Router;
