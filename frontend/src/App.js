import { RouterProvider } from "react-router-dom";

import "./App.css";

import Router from "./Routes/route";

import UserProfileUploadModal from "./Modal/UserProfileUpload/UserProfileUploadModal";
import CommentsModal from "./Modal/Comments/CommentsModal";

function App() {
  return (
    <div>
      <UserProfileUploadModal />
      <CommentsModal />
      <RouterProvider router={Router} />
    </div>
  );
}

export default App;
