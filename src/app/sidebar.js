// components/Sidebar.js
import { useState } from 'react';
import { MdHome, MdSearch, MdNotifications, MdMail, MdStar, MdBookmark, MdGroup, MdVerified, MdPerson, MdMoreHoriz } from 'react-icons/md';

export default function Sidebar() {
  const [showPopup, setShowPopup] = useState(false);

  const handleProfileClick = () => {
    setShowPopup(!showPopup);
  };

  return (
    <div className="bg-black text-white w-64 h-screen flex flex-col justify-between p-4 fixed top-0 left-0">
      {/* Scrollable container for navigation items */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-md">
            <MdHome size={24} />
            <span>Home</span>
          </div>
          <div className="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-md">
            <MdSearch size={24} />
            <span>Explore</span>
          </div>
          <div className="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-md">
            <MdNotifications size={24} />
            <span>Notifications</span>
          </div>
          <div className="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-md">
            <MdMail size={24} />
            <span>Messages</span>
          </div>
          <div className="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-md">
            <MdStar size={24} />
            <span>Premium</span>
          </div>
          <div className="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-md">
            <MdBookmark size={24} />
            <span>Bookmarks</span>
          </div>
          <div className="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-md">
            <MdGroup size={24} />
            <span>Communities</span>
          </div>
          <div className="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-md">
            <MdVerified size={24} />
            <span>Verified Orgs</span>
          </div>
          <div className="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-md">
            <MdPerson size={24} />
            <span>Profile</span>
          </div>
          <div className="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-md">
            <MdMoreHoriz size={24} />
            <span>More</span>
          </div>
        </div>
      </div>

      {/* Post Button */}
      <div className="mt-4">
        <button
          className="bg-blue-500 text-white py-3 px-4 rounded-full font-semibold hover:bg-blue-600 w-full"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          Post
        </button>
      </div>

      {/* Profile Section */}
      <div className="relative mt-4">
        <div
          onClick={handleProfileClick}
          className="flex items-center space-x-3 hover:bg-gray-800 rounded-md p-2 cursor-pointer"
        >
          <img
            src="/tweetify2.png" 
            alt="Profile"
            className="w-12 h-12 rounded-full"
          />
          <div>
            <p className="font-bold">Tweetify</p>
            <p className="text-gray-400">@TweetifySOL</p>
          </div>
        </div>

        {/* Popup Menu */}
        {showPopup && (
          <div className="absolute bottom-16 left-0 w-56 bg-black text-white rounded-md shadow-lg p-4">
            {/* Arrow pointing down */}
            <div className="absolute -bottom-2 left-6 w-4 h-4 bg-black transform rotate-45"></div>
            <a href="https://x.com/TweetifySOL" target="_blank" rel="noopener noreferrer" className="block hover:bg-gray-800 rounded-md p-2">
              Twitter
            </a>
            <a href="https://pump.fun" target="_blank" rel="noopener noreferrer" className="block hover:bg-gray-800 rounded-md p-2">
              Pumpfun
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
