import React, { useState } from 'react';
import { Train, Eye, EyeOff, UserPlus } from 'lucide-react';

import platformbcg from './platformbcg.png';

// Data for states and districts is now included directly in this file
const districtsByState = {
    'Andhra Pradesh': [
        'Alluri Sitharama Raju', 'Anakapalli', 'Ananthapuramu', 'Annamayya',
        'Bapatla', 'Chittoor', 'Dr. B.R. Ambedkar Konaseema', 'East Godavari',
        'Eluru', 'Guntur', 'Kakinada', 'Krishna', 'Kurnool', 'Nandyal',
        'NTR', 'Palnadu', 'Parvathipuram Manyam', 'Prakasam',
        'Sri Potti Sriramulu Nellore', 'Sri Sathya Sai', 'Srikakulam',
        'Tirupati', 'Visakhapatnam', 'Vizianagaram', 'West Godavari',
        'YSR'
    ],
    'Arunachal Pradesh': [
        'Anjaw', 'Changlang', 'Dibang Valley', 'East Kameng', 'East Siang',
        'Kamle', 'Kra Daadi', 'Kurung Kumey', 'Lepa Rada', 'Lohit',
        'Longding', 'Lower Dibang Valley', 'Lower Siang', 'Lower Subansiri',
        'Namsai', 'Pakke-Kessang', 'Papum Pare', 'Shi Yomi', 'Siang',
        'Tawang', 'Tirap', 'Upper Siang', 'Upper Subansiri', 'West Kameng',
        'West Siang'
    ],
    'Assam': [
        'Bajali', 'Baksa', 'Barpeta', 'Biswanath', 'Bongaigaon', 'Cachar',
        'Charaideo', 'Chirang', 'Darrang', 'Dhemaji', 'Dhubri', 'Dibrugarh',
        'Dima Hasao', 'Goalpara', 'Golaghat', 'Hailakandi', 'Hojai',
        'Jorhat', 'Kamrup', 'Kamrup Metropolitan', 'Karbi Anglong', 'Karimganj',
        'Kokrajhar', 'Lakhimpur', 'Majuli', 'Morigaon', 'Nagaon', 'Nalbari',
        'Sivasagar', 'Sonitpur', 'South Salmara-Mankachar', 'Tamulpur',
        'Tinsukia', 'Udalguri', 'West Karbi Anglong'
    ],
    'Bihar': [
        'Araria', 'Arwal', 'Aurangabad', 'Banka', 'Begusarai', 'Bhagalpur',
        'Bhojpur', 'Buxar', 'Darbhanga', 'East Champaran (Motihari)',
        'Gaya', 'Gopalganj', 'Jamui', 'Jehanabad', 'Kaimur (Bhabua)',
        'Katihar', 'Khagaria', 'Kishanganj', 'Lakhisarai', 'Madhepura',
        'Madhubani', 'Munger (Monghyr)', 'Muzaffarpur', 'Nalanda', 'Nawada',
        'Patna', 'Purnia (Purnea)', 'Rohtas', 'Saharsa', 'Samastipur',
        'Saran', 'Sheikhpura', 'Sheohar', 'Sitamarhi', 'Siwan',
        'Supaul', 'Vaishali', 'West Champaran'
    ],
    'Chhattisgarh': [
        'Balod', 'Baloda Bazar', 'Balrampur', 'Bastar', 'Bemetara', 'Bijapur',
        'Bilaspur', 'Dantewada (Dakshin Bastar)', 'Dhamtari', 'Durg',
        'Gariaband', 'Gaurela-Pendra-Marwahi', 'Janjgir-Champa', 'Jashpur',
        'Kabirdham (Kawardha)', 'Kanker (Uttar Bastar)', 'Khairagarh-Chhuikhadan-Gandai',
        'Kondagaon', 'Korba', 'Koriya', 'Mahasamund', 'Manendragarh-Chirmiri-Bharatpur',
        'Mohla-Manpur-Ambagarh Chowki', 'Mungeli', 'Narayanpur', 'Raigarh',
        'Raipur', 'Rajnandgaon', 'Sarangarh-Bilaigarh', 'Shakti', 'Sukma', 'Surajpur', 'Surguja'
    ],
    'Goa': [
        'North Goa', 'South Goa'
    ],
    'Gujarat': [
        'Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banaskantha (Palanpur)',
        'Bharuch', 'Bhavnagar', 'Botad', 'Chhota Udepur', 'Dahod',
        'Dang (Ahwa)', 'Devbhoomi Dwarka', 'Gandhinagar', 'Gir Somnath',
        'Jamnagar', 'Junagadh', 'Kachchh', 'Kheda (Nadiad)', 'Mahisagar',
        'Mehsana', 'Morbi', 'Narmada (Rajpipla)', 'Navsari', 'Panchmahal (Godhra)',
        'Patan', 'Porbandar', 'Rajkot', 'Sabarkantha (Himmatnagar)', 'Surat',
        'Surendranagar', 'Tapi (Vyara)', 'Vadodara', 'Valsad'
    ],
    'Haryana': [
        'Ambala', 'Bhiwani', 'Charkhi Dadri', 'Faridabad', 'Fatehabad',
        'Gurugram (Gurgaon)', 'Hisar', 'Jhajjar', 'Jind', 'Kaithal',
        'Karnal', 'Kurukshetra', 'Mahendragarh', 'Nuh', 'Palwal',
        'Panchkula', 'Panipat', 'Rewari', 'Rohtak', 'Sirsa', 'Sonipat',
        'Yamunanagar'
    ],
    'Himachal Pradesh': [
        'Bilaspur', 'Chamba', 'Hamirpur', 'Kangra', 'Kinnaur', 'Kullu',
        'Lahaul & Spiti', 'Mandi', 'Shimla', 'Sirmaur', 'Solan', 'Una'
    ],
    'Jharkhand': [
        'Bokaro', 'Chatra', 'Deoghar', 'Dhanbad', 'Dumka', 'East Singhbhum',
        'Garhwa', 'Giridih', 'Godda', 'Gumla', 'Hazaribag', 'Jamtara',
        'Khunti', 'Koderma', 'Latehar', 'Lohardaga', 'Pakur', 'Palamu',
        'Ramgarh', 'Ranchi', 'Sahebganj', 'Seraikela-Kharsawan', 'Simdega',
        'West Singhbhum'
    ],
    'Karnataka': [
        'Bagalkot', 'Ballari (Bellary)', 'Belagavi (Belgaum)', 'Bengaluru (Bangalore) Rural',
        'Bengaluru (Bangalore) Urban', 'Bidar', 'Chamarajanagar', 'Chikballapur',
        'Chikkamagaluru (Chikmagalur)', 'Chitradurga', 'Dakshina Kannada', 'Davanagere',
        'Dharwad', 'Gadag', 'Hassan', 'Haveri', 'Kalaburagi (Gulbarga)',
        'Kodagu', 'Kolar', 'Koppal', 'Mandya', 'Mysuru (Mysore)', 'Raichur',
        'Ramanagara', 'Shivamogga (Shimoga)', 'Tumakuru (Tumkur)', 'Udupi',
        'Uttara Kannada (Karwar)', 'Vijayanagara', 'Vijayapura (Bijapur)', 'Yadgir'
    ],
    'Kerala': [
        'Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod',
        'Kollam', 'Kottayam', 'Kozhikode', 'Malappuram', 'Palakkad',
        'Pathanamthitta', 'Thiruvananthapuram', 'Thrissur', 'Wayanad'
    ],
    'Madhya Pradesh': [
        'Agar Malwa', 'Alirajpur', 'Anuppur', 'Ashoknagar', 'Balaghat', 'Barwani',
        'Betul', 'Bhind', 'Bhopal', 'Burhanpur', 'Chhatarpur', 'Chhindwara',
        'Damoh', 'Datia', 'Dewas', 'Dhar', 'Dindori', 'Guna', 'Gwalior',
        'Harda', 'Narmadapuram', 'Indore', 'Jabalpur', 'Jhabua', 'Katni',
        'Khandwa', 'Khargone', 'Mandla', 'Mandsaur', 'Morena', 'Narsinghpur',
        'Neemuch', 'Niwari', 'Panna', 'Raisen', 'Rajgarh', 'Ratlam',
        'Rewa', 'Sagar', 'Satna', 'Sehore', 'Seoni', 'Shahdol', 'Shajapur',
        'Sheopur', 'Shivpuri', 'Sidhi', 'Singrauli', 'Tikamgarh', 'Ujjain',
        'Umaria', 'Vidisha'
    ],
    'Maharashtra': [
        'Ahmednagar', 'Akola', 'Amravati', 'Chhatrapati Sambhaji Nagar', 'Beed', 'Bhandara',
        'Buldhana', 'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli',
        'Jalgaon', 'Jalna', 'Kolhapur', 'Latur', 'Mumbai City', 'Mumbai Suburban',
        'Nagpur', 'Nanded', 'Nandurbar', 'Nashik', 'Dharashiv', 'Palghar',
        'Parbhani', 'Pune', 'Raigad', 'Ratnagiri', 'Sangli', 'Satara',
        'Sindhudurg', 'Solapur', 'Thane', 'Wardha', 'Washim', 'Yavatmal'
    ],
    'Manipur': [
        'Bishnupur', 'Chandel', 'Churachandpur', 'Imphal East', 'Imphal West',
        'Jiribam', 'Kakching', 'Kamjong', 'Kangpokpi', 'Noney', 'Pherzawl',
        'Senapati', 'Tamenglong', 'Tengnoupal', 'Thoubal', 'Ukhrul'
    ],
    'Meghalaya': [
        'East Garo Hills', 'East Jaintia Hills', 'East Khasi Hills',
        'North Garo Hills', 'Ri Bhoi', 'South Garo Hills', 'South West Garo Hills',
        'South West Khasi Hills', 'West Garo Hills', 'West Jaintia Hills', 'West Khasi Hills',
        'Eastern West Khasi Hills'
    ],
    'Mizoram': [
        'Aizawl', 'Champhai', 'Hnahthial', 'Khawzawl', 'Kolasib', 'Lawngtlai',
        'Lunglei', 'Mamit', 'Saiha', 'Saitual', 'Serchhip'
    ],
    'Nagaland': [
        'Chümoukedima', 'Dimapur', 'Kiphire', 'Kohima', 'Longleng', 'Mokokchung',
        'Mon', 'Niuland', 'Noklak', 'Peren', 'Phek', 'Shamator',
        'Tseminyü', 'Tuensang', 'Wokha', 'Zunheboto'
    ],
    'Odisha': [
        'Angul', 'Balangir', 'Balasore', 'Bargarh', 'Bhadrak', 'Boudh',
        'Cuttack', 'Deogarh', 'Dhenkanal', 'Gajapati', 'Ganjam',
        'Jagatsinghpur', 'Jajpur', 'Jharsuguda', 'Kalahandi', 'Kandhamal',
        'Kendrapara', 'Kendujhar (Keonjhar)', 'Khordha', 'Koraput',
        'Malkangiri', 'Mayurbhanj', 'Nabarangpur', 'Nayagarh', 'Nuapada',
        'Puri', 'Rayagada', 'Sambalpur', 'Sonepur', 'Sundargarh'
    ],
    'Punjab': [
        'Amritsar', 'Barnala', 'Bathinda', 'Faridkot', 'Fatehgarh Sahib',
        'Fazilka', 'Ferozepur', 'Gurdaspur', 'Hoshiarpur', 'Jalandhar',
        'Kapurthala', 'Ludhiana', 'Malerkotla', 'Mansa', 'Moga',
        'Muktsar', 'Pathankot', 'Patiala', 'Rupnagar (Ropar)',
        'Sahibzada Ajit Singh Nagar (Mohali)', 'Sangrur', 'Shaheed Bhagat Singh Nagar (Nawanshahr)', 'Tarn Taran'
    ],
    'Rajasthan': [
        'Ajmer', 'Alwar', 'Banswara', 'Baran', 'Barmer', 'Bharatpur',
        'Bhilwara', 'Bikaner', 'Bundi', 'Chittorgarh', 'Churu', 'Dausa',
        'Dholpur', 'Dungarpur', 'Hanumangarh', 'Jaipur', 'Jaisalmer',
        'Jalore', 'Jhalawar', 'Jhunjhunu', 'Jodhpur', 'Karauli', 'Kota',
        'Nagaur', 'Pali', 'Pratapgarh', 'Rajsamand', 'Sawai Madhopur',
        'Sikar', 'Sirohi', 'Sri Ganganagar', 'Tonk', 'Udaipur'
    ],
    'Sikkim': [
        'East Sikkim', 'North Sikkim', 'South Sikkim', 'West Sikkim'
    ],
    'Tamil Nadu': [
        'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore',
        'Dharmapuri', 'Dindigul', 'Erode', 'Kallakurichi', 'Kancheepuram',
        'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai', 'Mayiladuthurai',
        'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai',
        'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi',
        'Thanjavur', 'Theni', 'Thoothukudi (Tuticorin)', 'Tiruchirappalli',
        'Tirunelveli', 'Tirupathur', 'Tiruppur', 'Tiruvallur', 'Tiruvannamalai',
        'Tiruvarur', 'Vellore', 'Viluppuram', 'Virudhunagar'
    ],
    'Telangana': [
        'Adilabad', 'Bhadradri Kothagudem', 'Hyderabad', 'Jagtial', 'Jangaon',
        'Jayashankar Bhupalpally', 'Jogulamba Gadwal', 'Kamareddy', 'Karimnagar',
        'Khammam', 'Komaram Bheem Asifabad', 'Mahabubabad', 'Mahabubnagar',
        'Mancherial', 'Medak', 'Medchal-Malkajgiri', 'Mulugu', 'Nagarkurnool',
        'Nalgonda', 'Narayanpet', 'Nirmal', 'Nizamabad', 'Peddapalli',
        'Rajanna Sircilla', 'Rangareddy', 'Sangareddy', 'Siddipet',
        'Suryapet', 'Vikarabad', 'Wanaparthy', 'Warangal', 'Hanamkonda', 'Yadadri Bhuvanagiri'
    ],
    'Tripura': [
        'Dhalai', 'Gomati', 'Khowai', 'North Tripura', 'Sepahijala',
        'South Tripura', 'Unakoti', 'West Tripura'
    ],
    'Uttar Pradesh': [
        'Agra', 'Aligarh', 'Ambedkar Nagar', 'Amethi',
        'Amroha (J.P. Nagar)', 'Auraiya', 'Ayodhya', 'Azamgarh', 'Baghpat',
        'Bahraich', 'Ballia', 'Balrampur', 'Banda', 'Barabanki', 'Bareilly',
        'Basti', 'Bhadohi', 'Bijnor', 'Budaun', 'Bulandshahr', 'Chandauli',
        'Chitrakoot', 'Deoria', 'Etah', 'Etawah', 'Farrukhabad', 'Fatehpur',
        'Firozabad', 'Gautam Buddha Nagar', 'Ghaziabad', 'Ghazipur', 'Gonda',
        'Gorakhpur', 'Hamirpur', 'Hapur (Panchsheel Nagar)', 'Hardoi',
        'Hathras', 'Jalaun', 'Jaunpur', 'Jhansi', 'Kannauj',
        'Kanpur Dehat', 'Kanpur Nagar', 'Kasganj', 'Kaushambi',
        'Kushinagar', 'Lakhimpur Kheri', 'Lalitpur', 'Lucknow',
        'Maharajganj', 'Mahoba', 'Mainpuri', 'Mathura', 'Mau', 'Meerut',
        'Mirzapur', 'Moradabad', 'Muzaffarnagar', 'Pilibhit', 'Pratapgarh',
        'Prayagraj', 'Raebareli', 'Rampur', 'Saharanpur', 'Sambhal (Bhim Nagar)',
        'Sant Kabir Nagar', 'Shahjahanpur', 'Shamli', 'Shravasti', 'Siddharthnagar',
        'Sitapur', 'Sonbhadra', 'Sultanpur', 'Unnao', 'Varanasi'
    ],
    'Uttarakhand': [
        'Almora', 'Bageshwar', 'Chamoli', 'Champawat', 'Dehradun', 'Haridwar',
        'Nainital', 'Pauri Garhwal', 'Pithoragarh', 'Rudraprayag', 'Tehri Garhwal',
        'Udham Singh Nagar', 'Uttarkashi'
    ],
    'West Bengal': [
        'Alipurduar', 'Bankura', 'Birbhum', 'Cooch Behar', 'Dakshin Dinajpur (South Dinajpur)',
        'Darjeeling', 'Hooghly', 'Howrah', 'Jalpaiguri', 'Jhargram', 'Kalimpong',
        'Kolkata', 'Malda', 'Murshidabad', 'Nadia', 'North 24 Parganas',
        'Paschim Bardhaman (West Bardhaman)', 'Paschim Medinipur (West Medinipur)',
        'Purba Bardhaman (East Bardhaman)', 'Purba Medinipur (East Medinipur)',
        'Purulia', 'South 24 Parganas', 'Uttar Dinajpur (North Dinajpur)'
    ],
    'Andaman and Nicobar Islands': [
        'Nicobar', 'North and Middle Andaman', 'South Andaman'
    ],
    'Chandigarh': [
        'Chandigarh'
    ],
    'Dadra and Nagar Haveli and Daman and Diu': [
        'Dadra and Nagar Haveli', 'Daman', 'Diu'
    ],
    'Delhi': [
        'Central Delhi', 'East Delhi', 'New Delhi', 'North Delhi', 'North East Delhi',
        'North West Delhi', 'Shahdara', 'South Delhi', 'South East Delhi',
        'South West Delhi', 'West Delhi'
    ],
    'Jammu and Kashmir': [
        'Anantnag', 'Bandipora', 'Baramulla', 'Budgam', 'Doda', 'Ganderbal',
        'Jammu', 'Kathua', 'Kishtwar', 'Kulgam', 'Kupwara', 'Poonch',
        'Pulwama', 'Rajouri', 'Ramban', 'Reasi', 'Samba', 'Shopian',
        'Srinagar', 'Udhampur'
    ],
    'Ladakh': [
        'Kargil', 'Leh'
    ],
    'Lakshadweep': [
        'Lakshadweep'
    ],
    'Puducherry': [
        'Karaikal', 'Mahe', 'Puducherry', 'Yanam'
    ]
};


// Get the list of states from the keys of our data object
const indianStates = Object.keys(districtsByState);

export default function Signup() {
    const [employeeId, setEmployeeId] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [district, setDistrict] = useState('');
    const [state, setState] = useState('');
    
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleStateChange = (e) => {
        const newState = e.target.value;
        setState(newState);
        setDistrict(''); // Reset district selection when state changes
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            // In a real app, you'd show a more elegant message
            alert("Passwords do not match!");
            return;
        }
        // Handle signup logic here
        console.log('Signup attempt:', { employeeId, password, state, district });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden" style={{ backgroundImage: `url(${platformbcg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 left-10 w-32 h-1 bg-white transform -rotate-45"></div>
                <div className="absolute top-40 right-20 w-24 h-1 bg-white transform rotate-45"></div>
                <div className="absolute bottom-32 left-20 w-40 h-1 bg-white transform -rotate-12"></div>
                <div className="absolute bottom-20 right-10 w-28 h-1 bg-white transform rotate-12"></div>
                <div className="absolute top-60 left-1/3 w-36 h-1 bg-white transform rotate-30"></div>
                <div className="absolute top-80 right-1/3 w-20 h-1 bg-white transform -rotate-30"></div>
            </div>

            {/* Main content */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen py-4 px-4">
                {/* Header section */}
                <div className="text-center mb-2">
                    <div className="flex items-center justify-center mb-4">
                        <div className="bg-blue-600 p-3 rounded-lg mr-4">
                            <Train className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-left">
                            <h1 className="text-3xl font-bold text-white">Railway Control System</h1>
                            <p className="text-blue-300 text-sm">Platform Management Division</p>
                        </div>
                    </div>
                </div>

                {/* Signup form */}
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 w-full max-w-md">
                    <div className="text-center mb-6">
                        <div className="bg-blue-600 p-2 rounded-lg inline-block mb-3">
                            <UserPlus className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-white">Create Platform Control Account</h3>
                        <p className="text-gray-400 text-sm">Register for the Railway Platform Management System</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            {/* Employee ID */}
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">
                                    Employee ID
                                </label>
                                <input
                                    type="text"
                                    value={employeeId}
                                    onChange={(e) => setEmployeeId(e.target.value)}
                                    placeholder="Enter your employee ID"
                                    required
                                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        required
                                        className="w-full px-4 py-3 pr-12 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition duration-200"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                            
                            {/* Confirm Password */}
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm your password"
                                        required
                                        className="w-full px-4 py-3 pr-12 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition duration-200"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                            
                             {/* State Dropdown */}
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">
                                    State
                                </label>
                                <select
                                    value={state}
                                    onChange={handleStateChange}
                                    required
                                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200"
                                >
                                    <option value="" disabled>Select your state</option>
                                    {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            
                            {/* District Dropdown */}
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">
                                    District
                                </label>
                                <select
                                    value={district}
                                    onChange={(e) => setDistrict(e.target.value)}
                                    required
                                    disabled={!state}
                                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <option value="" disabled>Select your district</option>
                                    {state && districtsByState[state].map(d => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800"
                        >
                            Create Account
                        </button>
                    </form>
                </div>

                {/* Footer warning */}
                <div className="mt-8 text-center max-w-md">
                    <p className="text-gray-400 text-xs flex items-center justify-center">
                        <span className="w-4 h-4 rounded-full bg-gray-600 flex items-center justify-center mr-2 text-xs">!</span>
                        This system is for authorized railway personnel only. All access is monitored and logged.
                    </p>
                </div>
            </div>
        </div>
    );
}

