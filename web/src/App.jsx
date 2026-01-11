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
import EditProfile from "../Pages/editProfile"
import ChangePass from "../Pages/changePass"


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Admin" element={<AppLayout />}>
          <Route path="/Admin/home" element={<Home />} />
          <Route path="/Admin/users" element={<Users />} />
          <Route path="/Admin/providers" element={<Providers />} />
          <Route path="/Admin/categories" element={<Categories />} />
          <Route path="/Admin/services" element={<Services />} />
          <Route path="/Admin/messages" element={<Messages />} />
          <Route path="/Admin/admins" element={<Admins />} />
          <Route path="/Admin/profile" element={<Profile />} />
          <Route path="/Admin/editProfile" element={<EditProfile />} />
          <Route path="/Admin/changePass" element={<ChangePass />} />

          {/* باقي الصفحات */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
