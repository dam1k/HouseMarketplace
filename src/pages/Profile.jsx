import {getAuth, updateProfile} from "firebase/auth"
import {useEffect, useState} from "react"
import {useNavigate, Link} from "react-router-dom"
import {updateDoc, doc} from "firebase/firestore"
import {db} from "../firebase_config"
import {toast} from "react-toastify"

const Profile = () => {
  const auth = getAuth() 
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName, 
    email: auth.currentUser.email
  })

  const {name, email} = formData
  const [changeDetails, setChangeDetails] = useState(false)

  const navigate = useNavigate()

  function onLogout() {
    auth.signOut()
    navigate('/')
  }

  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    })
    )
  }

  async function onSubmit() {
    try {
      if(auth.currentUser.displayName !== name) {
        //update display name in firebase
        await updateProfile(auth.currentUser,{
          displayName: name
        }) 
        //update in firestore
        const userRef = doc(db, 'users', auth.currentUser.uid)
        await updateDoc(userRef, {
          name,
        })
      }
    } catch(err) {
      console.log(err)
      toast.error('Could not update user profile details')
    }
  }

  return <div className="profile">
    <header className="profileHeader">
      <p className="pageHeader">My Profile</p>
      <button type="button" className="logOut" onClick={onLogout}>Logout</button>
    </header>

    <main>
      <div className="profileDetailsHeader">
        <p className="profileDetailsText">
          Personal Details
        </p>
        <p className="changePersonalDetails" onClick={()=> 
          {changeDetails && onSubmit() 
          setChangeDetails((prevState) => !prevState)
          }}>
            {changeDetails ? "done": 'change'}</p>
      </div>
      
      <div className="profileCard">
        <input type="text" value={name} id="name" 
        className={!changeDetails ? "profileName" : "profileNameActive"}
         disabled={!changeDetails} onChange={onChange}/>
           <input type="email" value={email} id="email" 
        className={!changeDetails ? "profileName" : "profileNameActive"}
         disabled={!changeDetails} onChange={onChange}/>
      </div>
      </main>
  </div>  
}

export default Profile