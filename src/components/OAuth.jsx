import {getAuth, signInWithPopup, GoogleAuthProvider} from "firebase/auth"
import {useLocation, useNavigate} from "react-router-dom"
import {setDoc, doc, getDoc, serverTimestamp} from "firebase/firestore"
import {db} from "../firebase_config"
import googleIcon from "../assets/svg/googleIcon.svg"
import {toast} from "react-toastify"


const OAuth = () => {
    const location = useLocation()
    const navigate = useNavigate()

    async function onGoogleClick() {
        try{
            const auth = getAuth()
            const provider = new GoogleAuthProvider()
            const result = await signInWithPopup(auth, provider)
            const user = result.user
            
            //Check for user
            const docRef = doc(db, 'users', user.uid)
            const docSnap = await getDoc(docRef)

            //Create user if it doesn't exist
            if(!docSnap.exists()) {
                await setDoc(doc(db, 'users', user.uid), {
                    name: user.displayName,
                    email: user.email,
                    timestamp: serverTimestamp()
                })

            }
            navigate('/')
        } catch(err) {
            console.log(err)
            toast.error('Could not authorize with google')
        }
    }
  return (
    <div className="socialLogin">
        <p>Sign {location.pathname === "/sign-in" ? "in" : "up"} with</p>
        <button className="socialIconDiv" onClick={onGoogleClick}>
            <img className="socialIconImg" src={googleIcon}/>
            </button>
    </div>
  )
}

export default OAuth