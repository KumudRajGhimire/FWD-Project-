import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { FaSearch } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";

function Header(props) {
    const [loc, setLoc] = useState(localStorage.getItem("userLoc") || null);
    const [showOver, setShowOver] = useState(false);

    const categories = [
        "Stationaries",
        "Entertainment",
        "Fashion",
        "Cutleries",
        "Vehicles",
        "Hobbies",
        "Sports",
        "Daily Essentials",
        "Electronics",
        "Notes",
    ];

    const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
    const typingSpeed = 150; // Typing speed in ms
    const backspacingSpeed = 100; // Backspacing speed in ms
    const cooldownTime = 3000; // Cooldown time before changing category

    const navigate = useNavigate();

    // Handle logout functionality
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        navigate("/login");
    };

    // Reference to the search input element
    const searchInputRef = useRef(null);

    // Typing effect for the search input placeholder
    useEffect(() => {
        let timeout;
        let index = 0;
        let isTyping = true;
        let currentText = "";

        const typeCategory = () => {
            const currentCategory = categories[currentCategoryIndex];

            if (isTyping) {
                if (index < currentCategory.length) {
                    currentText += currentCategory.charAt(index);
                    if (searchInputRef.current) {
                        searchInputRef.current.placeholder = currentText;
                    }
                    index++;
                    timeout = setTimeout(typeCategory, typingSpeed);
                } else {
                    setTimeout(() => {
                        isTyping = false;
                        index = currentText.length - 1;
                        setTimeout(typeCategory, cooldownTime);
                    }, cooldownTime);
                }
            } else {
                if (index >= 0) {
                    currentText = currentText.slice(0, index);
                    if (searchInputRef.current) {
                        searchInputRef.current.placeholder = currentText;
                    }
                    index--;
                    timeout = setTimeout(typeCategory, backspacingSpeed);
                } else {
                    setTimeout(() => {
                        setCurrentCategoryIndex((prev) => (prev + 1) % categories.length);
                        isTyping = true;
                    }, cooldownTime);
                }
            }
        };

        typeCategory();

        return () => clearTimeout(timeout); // Cleanup timeout
    }, [currentCategoryIndex]);

    const locations = [
        { latitude: 12.939545260949961, longitude: 77.56507148999786, placeName: "National Boys Hostel, BMSCE" },
        { latitude: 12.940430758768843, longitude: 77.56481021979333, placeName: "International Hostel, BMSCE" },
        { latitude: 12.940299426324318, longitude: 77.56562529957633, placeName: "National Girls Hostel, BMSCE" },
        { latitude: 13.03294912219995, longitude: 77.56437005192409, placeName: "MSR Boys Hostel, MSRIT" },
        { latitude: 13.031180542421236, longitude: 77.56717365522184, placeName: "Nilgiri Men's Hostel, MSRIT" }
    ];

    return (
        <div className="header-container">
            {/* Left Section */}
            <div className="header-left">
                <Link className="links" to="/">
                    HOME
                </Link>
                <select
                    value={loc}
                    onChange={(e) => {
                        localStorage.setItem("userLoc", e.target.value);
                        setLoc(e.target.value);
                    }}
                >
                    {locations.map((item, index) => (
                        <option value={`${item.latitude},${item.longitude}`} key={index}>
                            {item.placeName}
                        </option>
                    ))}
                </select>
            </div>

            {/* Search Section */}
            <div className="search-container">
                <input
                    className="search"
                    type="text"
                    value={props?.search || ""}
                    onChange={(e) => props.handlesearch && props.handlesearch(e.target.value)}
                    ref={searchInputRef} // Attach the ref here
                />
                <button
                    className="search-btn"
                    onClick={() => props.handleClick && props.handleClick()}
                >
                    <FaSearch />
                </button>
            </div>

            {/* Profile Section */}
            <div className="header-right">
                <div
                    className="user-icon"
                    onClick={() => setShowOver(!showOver)}
                >
                    N
                </div>

                {showOver && (
                    <div className="profile-dropdown">
                        {!!localStorage.getItem("token") && (
                            <>
                                <Link to="/add-product">
                                    <button className="dropdown-btn">ADD PRODUCT</button>
                                </Link>
                                <Link to="/liked-products">
                                    <button className="dropdown-btn">FAVOURITES</button>
                                </Link>
                                <Link to="/my-products">
                                    <button className="dropdown-btn">MY ADS</button>
                                </Link>
                            </>
                        )}
                        {!localStorage.getItem("token") ? (
                            <Link to="/login" className="dropdown-link">
                                LOGIN
                            </Link>
                        ) : (
                            <button className="dropdown-btn" onClick={handleLogout}>
                                LOGOUT
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Header;
