import AppointmentConfirm from '../pages/AppointmentConfirm'
import ActivateAccount from '../pages/ActivateAccount'
import Home from '../pages/Home'
import Login from '../pages/Login'
import PasswordConfirmMessage from '../pages/PasswordConfirmMessage'
import PasswordMessage from '../pages/PasswordMessage'
import PasswordReset from '../pages/PasswordReset'
import PasswordResetConfirm from '../pages/PasswordResetConfirm'
import SignUp from '../pages/SignUp'
import VerifyMessage from '../pages/VerifyMessage'
import AppointmentDetail from '../pages/AppointmentDetail'
import AppointmentReview from '../pages/AppointmentReview'
import DoctorFeedback from '../pages/DoctorFeedback'
import About from '../pages/About'
import Archive from '../pages/Archive'
import NotFound from '../pages/NotFound'
import Landing from '../pages/Landing'
import AboutNoAuth from '../pages/AboutNoAuth'


const routes = [
    {
        path:'/',
        component: Landing,
        exact:true,
    },
    {
        path:'/Home/',
        component: Home,
    },
    {
        path:'/about/',
        component: About,
    },
    {
        path:'/noauth/about/',
        component: AboutNoAuth,
        expect:true,
    },
    {
        path:'/archive/',
        component: Archive,
    },
    {
        path:'/login/',
        component: Login,
    },
    {
        path:'/signup/',
        component:SignUp
    },
    {
        path:'/password-reset/',
        component: PasswordReset
    },
    {
        path:'/password-message/',
        component: PasswordMessage
    },
    {
        path:'/password/reset/confirm/:uid/:token',
        component: PasswordResetConfirm
    },
    {
        path:'/password-confirm/message',
        component: PasswordConfirmMessage
    },
    {
        path:'/activate/:uid/:token',
        component:ActivateAccount
    },
    {
        path:'/verify-account-message/',
        component: VerifyMessage
    },
    {
        path:'/appointments/confirm/:token/:appttoken',
        component: AppointmentConfirm
    },
    {
        path:'/appointments/detail/:appointmentId/',
        component: AppointmentDetail,
        exact: true
    },
    {
        path:'/appointments/review/:token/:appttoken',
        component: AppointmentReview
    },
    {
        path:'/appointments/doctor/review/:id/',
        component:DoctorFeedback
    },
    {
        component:NotFound,
    }

]

export default routes
