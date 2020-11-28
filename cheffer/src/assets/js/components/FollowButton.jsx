import React, {useState} from "react";
import axios from 'axios';
import './FollowButton.css';
export default function Button({ onClick, user, userId, following,followed}) {

    const [userFollowed, setUserFollowed] = useState(user);
    const [quantityFollowed, setQuantityFollowed] = useState(followed);
    
    const Follow = () => {
        axios({
            url: `${userId}/follow`,
            method: 'put',
            data: user
        })
        .then(response => {
            const followed = response.data;
            setUserFollowed(true);
            setQuantityFollowed(quantityFollowed + 1);
        })
    };
    const UnFollow = () => {
        axios({
            url: `${userId}/unfollow`,
            method: 'delete',
            data: user
        })
        .then(response => {
            const followed = response.data;
            setUserFollowed(false);
            setQuantityFollowed(quantityFollowed - 1);
        })
    };
    console.log(userFollowed)
    console.log(userId)
    return (
        <div>
            <p>Following {following} Followed {quantityFollowed}</p>

            {userFollowed ? (
                <button className='unfollow-button' onClick={UnFollow}>unFollow</button>
                
            ) : (
                <button className='follow-button' onClick={Follow}> Follow</button>
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