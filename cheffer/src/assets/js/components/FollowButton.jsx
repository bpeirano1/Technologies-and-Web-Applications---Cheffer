import React, {useState} from "react";
import axios from 'axios';
import likepic from '../../images/like.png';
import unlikepic from '../../images/unlike.JPG';
import './LikeButton.css';
export default function Button({ onClick, user, userId}) {

    const [userFollowed, setUserFollowed] = useState(user);
    //const [userFollowInfo, setUserFollowInfo] = useState(followInfo);
    
    const Follow = () => {
        axios({
            url: `${userId.id}/follow`,
            method: 'put',
            data: user
        })
        .then(response => {
            const followed = response.data;
            setUserFollowed(true);
            //setUserFollowInfo(userFollowInfo.followedby + 1);
        })
    };
    const UnFollow = () => {
        axios({
            url: `${userId.id}/unfollow`,
            method: 'delete',
            data: user
        })
        .then(response => {
            const followed = response.data;
            setUserFollowed(false);
            //setUserFollowInfo(userFollowInfo.followedby - 1);
        })
    };
    console.log(userFollowed)
    console.log(userId.id)
    return (
        <div>

            {userFollowed ? (
                <button className='follow-button' onClick={Follow}>Follow</button>
                
            ) : (
                <button className='follow-button' onClick={UnFollow}> Unfollow</button>
            )}        
        </div>
    ); 
}


//<!--<div>
//<% if (currentUser.id != user.id){ %>
//<% if (userFollowingData.beingFollowed){ %>
//<form action="<%= unfollowPath %>" method="POST">
 // <input type="hidden" name="_method" value="DELETE">
  //<input type="submit" value="Unfollow">
//</form>
//<% } else { %>
//<form action="<%= followPath %>" method="POST">   
//  <input type="hidden" name="_method" value="PUT">
 // <input type="submit" value="Follow">  
//</form>
//<% }%>
//<% }%> 
//</div> -->