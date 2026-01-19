import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "../Pages/admin/layout";
import Home from "../Pages/admin/homeAdmin";
import Providers from "../Pages/admin/providers";
import Categories from "../Pages/admin/categories";
import Users from "../Pages/admin/users";
import Services from "../Pages/admin/services";
import Messages from "../Pages/admin/messages";
import Admins from "../Pages/admin/admins";
import Login from "../Pages/login";
import Profile from "../Pages/admin/profile";
import EditProfile from "../Pages/editProfile";
import ChangePass from "../Pages/changePass";





function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Admin" element={<AppLayout />}>
          <Route path="home" element={<Home />} />
          <Route path="users" element={<Users />} />
          <Route path="providers" element={<Providers />} />
          <Route path="categories" element={<Categories />} />
          <Route path="services" element={<Services />} />
          <Route path="messages" element={<Messages />} />
          <Route path="admins" element={<Admins />} />
          <Route path="profile" element={<Profile />} />
          <Route path="editProfile" element={<EditProfile />} />
          <Route path="changePass" element={<ChangePass />} />
        </Route>
      </Routes>
    </BrowserRouter>

  );
}

export default App;
