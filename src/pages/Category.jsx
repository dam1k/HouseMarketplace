import {useEffect, useState} from "react"
import {useParams} from "react-router-dom"
import {collection, getDocs, query, where, orderBy, limit, startAfter} from "firebase/firestore"
import {db} from "../firebase_config"
import {toast} from "react-toastify"
// import Spinner from "../components/Spinner"
function Category() {
    const [listings, setListings] = useState(null)
    const [loading, setLoading] = useState(true)
    const params = useParams()

    useEffect(()=> {
        async function fetchListings() {
            try {
                const listingsRef = collection(db, 'listings')

                //Create a query
                const q = query(listingsRef, where('type', '==', params.categoryName), orderBy('timestamp', 'desc'), limit(10))
                //Execute Query
                const querySnap = await getDocs(q) 

                const listings = []
                querySnap.forEach((doc) => {
                    console.log('Hi')
                })
            } catch(err) {
                console.log(err)
            }
        }

        fetchListings()
})
return ( 
    <div>Category</div>
)
}

export default Category