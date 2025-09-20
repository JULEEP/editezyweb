import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import HomePage from "./Pages/Homepage";
import LoginPage from "./Pages/LoginPage";
import CartPage from "./Pages/CartPage";
import DoctorCategoryPage from "./Pages/DoctorCategoryPage";
import DoctorListPage from "./Pages/DoctorListPage";
import MyBookings from "./Pages/MyBookings";
import LabCategoryPage from "./Pages/LabCategoryPage";
import LabTestPage from "./Pages/LabTestPage";
import PackagesPage from "./Pages/PackagesPage";
import ScanAndXRayPage from "./Pages/ScanAndXRayPage";
import PrescriptionPage from "./Pages/PrescriptionPage";
import DiagnosticsPage from "./Pages/DiagnosticsPage";
import WalletPage from "./Pages/WalletPage";
import MedicalRecordsPage from "./Pages/MedicalRecordsPage";
import ChatPage from "./Pages/ChatPage";
import FamilyPage from "./Pages/FamilyPage";
import AddressPage from "./Pages/AddressPage";
import HraPage from "./Pages/HraPage";
import HraQuestionsPage from "./Pages/HraQuestionsPage";
import NotificationsPage from "./Pages/NotificationsPage";
import DeleteAccountPage from "./Pages/DeleteAccountPage";
import HelpPage from "./Pages/HelpPage";
import RegisterPage from "./Pages/RegisterPage";
import VerifyOtpPage from "./Pages/VerifyOtpPage";
import StoryPage from "./Pages/StoryPage";
import CategoryPoster from "./Pages/CategoryPoster";
import SingleCategoryPoster from "./Pages/SingleCategryPoster";
import HoroscopePage from "./Pages/HoroscopePage";
import CustomerPage from "./Pages/CustomerPage";
import Dashboard from "./Pages/Dashboard";
import Profile from "./Pages/Profile";
import ReferAndPay from "./Pages/ReferAndPay";
import Invoice from "./Pages/Invoice";
import ContactUs from "./Pages/ContactUs";
import SinglePlan from "./Pages/SinglePlan";
import SinglePoster from "./Pages/SinglePoster";
import CustomPosterEditor from "./Pages/CustomPoster"
import Logo from "./Pages/Logo";
import BackgroundRemover from "./Pages/BackgroundRemoval";
import BusinessCardManager from "./Pages/BusinessCardManager";

function App() {
  return (
    <Router>
      {/* Google Translate Widget at the Top */}
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/" element={<RegisterPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/doctor-category/:category/:type" element={<DoctorCategoryPage />} />
        <Route path="/doctor-list/:categoryName" element={<DoctorListPage />} />
        <Route path="/mybookings" element={<MyBookings />} />
         <Route path="/lab-category" element={<LabCategoryPage />} />
          <Route path="/labtest" element={<LabTestPage />} />
        <Route path="/packages" element={<PackagesPage />} />
        <Route path="/scan&xrays" element={<ScanAndXRayPage />} />
        <Route path="/prescriptions" element={<PrescriptionPage />} />
          <Route path="/diagnostics" element={<DiagnosticsPage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/medicalrecord" element={<MedicalRecordsPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/family" element={<FamilyPage />} />
          <Route path="/address" element={<AddressPage />} />
          <Route path="/hra-category" element={<HraPage />} />
           <Route path="/hra-questions" element={<HraQuestionsPage />} />
          <Route path="/notification" element={<NotificationsPage />} />
          <Route path="/delete-account" element={<DeleteAccountPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/story" element={<StoryPage />} />
          <Route path="/categories" element={<CategoryPoster />} />
          <Route path="/category/:categoryName" element={<SingleCategoryPoster />} />
          <Route path="/horoscope" element={<HoroscopePage />} />
          <Route path="/customer" element={<CustomerPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/refer" element={<ReferAndPay />} />
          <Route path="/invoice" element={<Invoice />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/singleplan/:id" element={<SinglePlan />} />
          <Route path="/posters/:posterId" element={<SinglePoster />} />
          <Route path="/custom" element={<CustomPosterEditor />} />
          <Route path="/logo" element={<Logo />} />
          <Route path="/backgroundremoval" element={<BackgroundRemover />} />
          <Route path="/businesscard" element={<BusinessCardManager />} />

      </Routes>
    </Router>
  );
}

export default App;
