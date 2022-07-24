import {getAuth, updateProfile} from "firebase/auth"
import {useEffect, useState} from "react"
import {useNavigate, Link} from "react-router-dom"
import {updateDoc, doc, collection, getDocs, query, orderBy, where, deleteDoc } from "firebase/firestore"
import {db} from "../firebase_config"
import {toast} from "react-toastify"
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg"
import homeIcon from "../assets/svg/homeIcon.svg"
import ListingItem from "../components/ListingItem"

const Profile = () => {
  const auth = getAuth() 
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName, 
    email: auth.currentUser.email
  })
  const [listings, setListings] = useState(null)
  const [loading, setLoading] = useState(true)
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

  useEffect(()=>{
    const fetchUserListings = async () => {
      const listingsRef = collection(db, 'listings')

      const q = query(listingsRef, where('userRef', "==", auth.currentUser.uid), orderBy('timestamp', 'desc'))

      const querySnap = await getDocs(q)

      let listings = []

      querySnap.forEach(doc => {
        return listings.push({
          id: doc.id,
          data: doc.data()
        })
      })

      setListings(listings)
      console.log(listings)
      setLoading(false)
    }

    fetchUserListings()

  }, [auth.currentUser.uid])

  const onEdit = (listingId) => navigate(`/edit-listing/${listingId}`)
  const onDelete = async (listingId) => {
    if(window.confirm('Are you sure?')) {
      await deleteDoc(doc(db, 'listings', listingId))

      const updatedListings = listings.filter(listing => {
        return listing.id !== listingId
      })
      
      setListings(updatedListings)
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
      <Link className="createListing" to="/create-listing">
        <img src={homeIcon} alt="home"/>
        <p>Sell or rent your home</p>
        <img src={arrowRight} alt="arrow-right"/>
      </Link>

      {!loading && listings?.length > 0 &&
      (
        <>
        <p className="listingText"> Your listings:</p>
        <ul className="listingsList">
          {listings.map(listing=>{
            return <ListingItem key={listing.id}
            listing={listing.data}
            id={listing.id}
            onDelete={()=> onDelete(listing.id)}
            onEdit={()=> onEdit(listing.id)}/>
          })}
        </ul>
        </>
      )
      
    }
      </main>
  </div>  
}

export default Profile