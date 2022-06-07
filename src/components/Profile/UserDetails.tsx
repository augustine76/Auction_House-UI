// import { FC } from 'react';

import React from 'react';
import isha from './image/isha.png';
export const UserDetails = () => {

    return (
        <div>
            <img src="https://gateway.pinata.cloud/ipfs/QmQ9QiGncY4J8gexqKNA77Du7FSBdbGURR4PWoP7wn8A11" className="profileimg" />
            <div className="profileName">Isha</div>
            <div className="profileNameB text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">@Isha</div>
            <div className="publicKey">DZMj6Bf2qw5RRZjqKzyajd</div>
            <button className="pd group w-60 m-2 btn animate-pulse disabled:animate-none bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ... "            >
                <span className="block group-disabled:hidden ">Edit Profile</span>
            </button>
            
        </div>

    );
};
