import {useState} from "react"
import {Link, useNavigate} from "react-router-dom"
import {ReactComponent as ArrowRightIcon} from "../assets/svg/keyboardArrowRightIcon.svg"
import visibilityIcon from "../assets/svg/visibilityIcon.svg"
import {getAuth, signInWithEmailAndPassword} from "firebase/auth"
import {toast} from "react-toastify"
import OAuth from "../components/OAuth"

const Signin = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email:'',
    password: ''
  })
  const {email, password} = formData
  const navigate = useNavigate()

  function onChange(e) {
    setFormData(prevState => ({
      ...prevState,
      [e.target.id] : e.target.value
    }))
  }

async function onSubmit(e) {
e.preventDefault()

try {
  const auth = getAuth()

  const userCredential = await signInWithEmailAndPassword(auth, email, password)

  if(userCredential.user) {
    navigate('/')
  }
  
} catch(err) {
  console.log(err)
  toast.error('Bad User Credentials')
}

}

  return (
    <>
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Welcome back!</p>
      </header>

        <form onSubmit={onSubmit}>
          <input className="emailInput" type="email" onChange={onChange} placeholder="Email" id="email" value={email}/>
          <div className="passwordInputDiv">
          <input className="passwordInput" type={showPassword ? "text" : "password"} placeholder="Password" id="password" value={password} onChange={onChange}/>
          <img className="showPassword" src={visibilityIcon} alt="show-password" onClick={()=> setShowPassword(showPassword => !showPassword)}/>
          </div>
          <Link to="/forgot-password" className="forgotPasswordLink">Forgot Password</Link>
          <div className="signInBar">
            <p className="signInText">
              Sign In
            </p>
            <button className="signInButton"><ArrowRightIcon fill="#fff" width="34px" height="34px"/></button>
          </div>
        </form>
        <OAuth/>
        <Link to="/sign-up" className="registerLink">
          Sign Up Instead
        </Link>
    </div>
    </>
  )
}

export default Signin