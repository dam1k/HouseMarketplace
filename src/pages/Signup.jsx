import {useState} from "react"
import {Link, useNavigate} from "react-router-dom"
import {ReactComponent as ArrowRightIcon} from "../assets/svg/keyboardArrowRightIcon.svg"
import visibilityIcon from "../assets/svg/visibilityIcon.svg"
import {getAuth, createUserWithEmailAndPassword, updateProfile} from "firebase/auth"
import {db} from "../firebase_config"
import {setDoc, doc, serverTimestamp} from "firebase/firestore"
import {toast} from "react-toastify"
import OAuth from "../components/OAuth"

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email:'',
    password: ''
  })
  const {email, password, name} = formData
  const navigate = useNavigate()

  function onChange(e) {
    setFormData(prevState => ({
      ...prevState,
      [e.target.id] : e.target.value
    }))
  }

  async function onSubmit(e) {
    e.preventDefault()

    try{
      const auth = getAuth()

      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      updateProfile(auth.currentUser, {
        displayName: name
      })
      
      const formDataCopy = {...formData}
      delete formDataCopy.password
      formDataCopy.timestamp = serverTimestamp()

      await setDoc(doc(db, 'users', user.id), formDataCopy)

      navigate('/')
    } catch(err) {
      console.log(err)
      toast.error('Something went wrong')
    }
  }

  return (
    <>
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Welcome back!</p>
      </header>

        <form onSubmit={onSubmit}>
        <input className="nameInput" type="text" onChange={onChange} placeholder="Name" id="name" value={name}/>
          <input className="emailInput" type="email" onChange={onChange} placeholder="Email" id="email" value={email}/>
          <div className="passwordInputDiv">
          <input className="passwordInput" type={showPassword ? "text" : "password"} placeholder="Password" id="password" value={password} onChange={onChange}/>
          <img className="showPassword" src={visibilityIcon} alt="show-password" onClick={()=> setShowPassword(showPassword => !showPassword)}/>
          </div>
      
          <div className="signUpBar">
            <p className="signUpText">
              Sign Up
            </p>
            <button className="signUpButton"><ArrowRightIcon fill="#fff" width="34px" height="34px"/></button>
          </div>
        </form>
        <OAuth/>
        <Link to="/sign-in" className="registerLink">
          Sign in Instead
        </Link>
    </div>
    </>
  )
}

export default SignUp