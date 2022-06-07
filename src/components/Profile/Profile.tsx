// import { FC } from 'react';

import React from 'react';
import { UserDetails } from './UserDetails';
import {UserItems} from './UserItems';
export const Profile = () => {

    return (
        <div className="column">



            <UserDetails/>
            <UserItems/>



        </div>

    );
};
