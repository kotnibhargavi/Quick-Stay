import React, { useState,useMemo } from 'react'
import HotelCard from '../components/HotelCard'
import { assets, facilityIcons } from '../assets/assets'
import StartRating from '../components/StartRating'
import { useAppContext } from '../context/appContext'
import { useSearchParams } from 'react-router-dom'

const CheckBox = ({label,selected= false, onChange= ()=>{}})=>{
    return <label className='flex gap-3 items-center cursor-pointer mt-2 text-sm'>
        <input type = "checkbox" checked= {selected} onChange={(e)=>onChange(e.target.checked,label)} />
        <span className='font-light select-none'>{label}</span>
    </label>
}
const RadioButton = ({label,selected= false, onChange= ()=>{}})=>{
    return <label className='flex gap-3 items-center cursor-pointer mt-2 text-sm'>
        <input type = "radio" name = "sortOptions" checked= {selected} onChange={()=>onChange(label)} />
        <span className='font-light select-none'>{label}</span>
    </label>
}


const AllRooms = () => {
    const {rooms,navigate,currency} = useAppContext()
    const [searchParams,setSearchParams] = useSearchParams()
    const [openFilters,setOpenFilters] = useState(false)
    const [selectedFilters,setSelectedFilters] = useState({
        roomType:[],
        priceRange:[]
    });
    const [selectSort,setSelectSort] = useState('')


    const roomTypes = [
        "Single Bed",
        "Double Bed",
        "Luxury Room",
        "Family Suit",
    ];
    const priceRanges = [
        "0 to 500",
        "500 to 1000",
        "1000 to 2000",
        "2000 to 3000"
    ];
    const sortOptions = [
        "Price Low to High",
        "Price High to Low",
        "Newest First"
    ]
;
// Handle changes for filter and sorting
   const handleFilterChange = (checked,value,type)=>{
    setSelectedFilters((prevFilter)=>{
        const updatedFilters = {...prevFilter}
        if(checked){
            updatedFilters[type].push(value)
        }else{
            updatedFilters[type] = updatedFilters[type].filter(item=>item!==value)
        }
        return updatedFilters
    })
   }
    const handleSortChange = (sortOption)=>{
        setSelectSort(sortOption)
    }
// Function to check if a room matches the selected room types
    const matchesRoomType = (room)=>{
        return selectedFilters.roomType.length===0 || selectedFilters.roomType.includes(room.roomType)
    }
// Function to check if a room matches the selected price range
    const matchesPriceRange= (room)=>{
    return selectedFilters.priceRange.length===0 || selectedFilters.priceRange.some(range =>{
        const [min,max] = range.split(" to ").map(Number)
        return room.pricePerNight >= min && room.pricePerNight <= max;
    })

}
// Function to check if a room matches the selected sort options
const sortRooms= (a,b)=>{
   if (selectSort === "Price Low to High"){
        return a.pricePerNight - b.pricePerNight
   }
   if (selectSort === "Price High to Low"){
        return b.pricePerNight - a.pricePerNight
   }
   if (selectSort === "Newest First"){
    return new Date(b.createdAt) - new Date(a.createdAt)
}
  return 0;  
}
// Filter destination 

const filterDestination = (room)=>{
    const destination = searchParams.get("destination")
    if(!destination) return true 
    return room.hotel.city.toLowerCase().includes(destination.toLowerCase())
}
// Filter and sort rooms based on selected filters and sort option
const filteredRooms = useMemo(()=>{
    const filtered = rooms.filter(room => 
        matchesRoomType(room) && 
        matchesPriceRange(room) && 
        filterDestination(room))
    return filtered.sort(sortRooms)
},[rooms,selectedFilters,selectSort,searchParams])

// clear all filters 
const clearFilters = ()=>{
    setSelectedFilters({
        roomType:[],
        priceRange:[]
    })
    setSelectSort("")
    setSearchParams({})
}

  return (
    <div className='flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-32 md:px-16 lg:px-24 xl:px-32 sm:ml-6'>
     <div>
        <div className='flex flex-col items-start text-left'>
            <h1 className='font-playfair text-4xl md:text-[40px]'>Hotel Rooms</h1>
            <p className='text-sm md:text-base text-gray-500/90 mt-2 max-w-174'>Take advantage of our limited-time offers and special packages to enhance your stay and create unforgettable memories.</p>
        </div>
        {filteredRooms.map((room)=>(
            <div className='flex flex-col md:flex-row items-start py-10 gap-6 border-gray-300 last:pb-30 last:border-0' key = {room._id}>
                <img onClick={()=>{navigate(`/rooms/${room._id}`), scrollTo(0,0)}} src = {room.images[0]} alt = "hotel-img" title = "View Room Details" className='max-h-64 md:w-1/2 rounded-xl shadow-lg object-cover cursor-pointer' />
                <div className='md:w-1/2 flex flex-col gap-4'>
                <div className='md:w-1/2 flex flex-col gap-2'>
                    <p className='text-gray-500'>{room.hotel.city}</p>
                    <p onClick={()=>{navigate(`/rooms/${room._id}`); scrollTo(0,0);}} 
                    className='text-gray-800 text-3xl font-playfair cursor-pointer'>
                        {room.hotel.name}</p>
                    <div className='flex items-center'>
                        <StartRating/>
                        <p className='ml-2'>200+ Reviews</p>
                    </div>
                    
            </div>
            <div className='flex items-center gap-1 text-gray-500 mt-2'>
                <img src = {assets.locationIcon} alt='location-icon' />
                <span>{room.hotel.address}</span>
            </div>
            {/* Room Eminities */}
            <div className='flex flex-wrap items-center mt-3 mb-6 gap-4'>
                {room.amenities.map((item,index)=>(
                 <div key = {index} className='flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F5FF]/70'>
                    <img src = {facilityIcons[item]} alt = {item} className='w-5 h-5' />
                    <p className='text-xs'>{item}</p>
                </div>
            ))}
        </div>
        <p className="text-2xl font-semibold text-gray-600 mt-2">
        {currency} {room.pricePerNight}
        <span className="text-base font-normal text-gray-400"> /night</span>
        </p>
                </div>
            </div>
        ))}
     </div> 
      {/* Filters */}
      <div className='bg-white w-80 border border-gray-300 text-gray-600 max-lg:mb-8 min-lg:mt-16'>
        <div className={`flex items-center justify-between px-5 py-2.5 min-lg:border-b border-gray-300 ${openFilters&& "border-b"}`}>
            <p className='text-base font-medium text-gray-800'>FILTERS</p>
            <div>
            <span onClick={()=>setOpenFilters((prev)=>!prev)} className='lg:hidden'>{openFilters?"HIDE":"SHOW"}</span>
            
            <span className='hidden lg:block'>CLEAR</span>
        </div>
        </div>
       
      
      <div className={`${openFilters?"h-auto": "h-0 lg:h-auto"} overflow-hidden transition-all duration-700`}>
        <div className='px-5 pt-5'>
            <p className='font-medium text-gray-800 pb-2'>Popular Filters</p>
            {roomTypes.map((room,index)=>(
                <CheckBox key = {index} label = {room} selected  = {selectedFilters.roomType.includes(room)}
                onChange={(checked)=>handleFilterChange(checked,room,'roomType')}
                />
            ))}
        </div>
        <div className='px-5 pt-5'>
            <p className='font-medium text-gray-800 pb-2'>Price Range</p>
            {priceRanges.map((range,index)=>(
                <CheckBox key = {index} label = {`${currency} ${range}`} selected  = {selectedFilters.priceRange.includes(range)}
                onChange={(checked)=>handleFilterChange(checked,range,'priceRange')}/>
            ))}
        </div>
        <div className='px-5 pt-5 pb-7'>
            <p className='font-medium text-gray-800 pb-2'>Sort By</p>
            {sortOptions.map((option,index)=>(
                <RadioButton key = {index} label = {option} 
                selected  = {selectSort === option}
                onChange={(option)=>handleSortChange(option)}
                />
            ))}
        </div>
        
         
      </div>
      </div>
    </div>
  )
}

export default AllRooms
