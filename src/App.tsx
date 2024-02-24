import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from "react-router-dom";

import RootLayout from "./layouts/RootLayout";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Discover from "./pages/Discover";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

import RootError from "./errors/RootError";
import Profile from "./pages/Profile";
import PrivateLayout from "./layouts/PrivateLayout";
import CreatePost from "./pages/CreatePost";
import ShowPost from "./pages/ShowPost";
import EditProfile from "./pages/EditProfile";
import EditPost from "./pages/EditPost";
import UserProfile from "./pages/UserProfile";
import SearchResultsPage from "./pages/SearchResults";
import FollowingPage from "./pages/FollowingPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<RootLayout />} errorElement={<RootError />}>

        <Route index element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/discover" element={<Discover />} />

        <Route path="/register" element={<Register />} />

        <Route path="/posts/:postId" element={<ShowPost />} />

        <Route path="/user/:userId" element={<UserProfile />} />

        <Route path="/search-results" element={<SearchResultsPage />} />

        <Route element={<PrivateLayout />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/following" element={<FollowingPage />} />
        </Route>

        <Route element={<PrivateLayout />}>
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/edit-post/:postId" element={<EditPost />} />
        </Route>

        <Route path="*" element={<NotFound />}/>

      </Route>
      
    </>
  )
);

 


function App() {
  
  return (
    <RouterProvider router={router}/>
  )
}

export default App;

