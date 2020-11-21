import React, {useState} from "react";
import likepic from '../../images/like.png';
import unlikepic from '../../images/unlike.JPG';
import axios from 'axios';
import './LikeButton.css';
export default function Button({ onClick, publication, pub, likes}) {

    const [userLikes, setUserLikes] = useState(publication);
    const [quantityLikes, setQuantityLikes] = useState(likes);
    
    const Like = () => {
        axios({
            url: `/users/${pub.userId}/publications/${pub.id}/like`,
            method: 'put',
            data: pub
        })
        .then(response => {
            const liked = response.data;
            setUserLikes(true);
            setQuantityLikes(quantityLikes + 1);
        })
    };
    const UnLike = () => {
        axios({
            url: `/users/${pub.userId}/publications/${pub.id}/unlike`,
            method: 'delete',
            data: pub
        })
        .then(response => {
            const liked = response.data;
            setUserLikes(false);
            setQuantityLikes(quantityLikes - 1);
        })
    };
    console.log(userLikes)
    return (
        <div>
            {userLikes ? (
                <button className='like-button' onClick={UnLike}><img src={likepic} height='20' width='25'/></button>
                
            ) : (
                <button className='like-button' onClick={Like}><img src={unlikepic} height='20' width='25'/></button>
            )}        
            <p>Likes: {quantityLikes}</p>
        </div>
    ); 
}

// <% if (publication.currentUserLikedPublication){ %>
//     <form action="<%= unlikePublicationPath(publication) %>" method="POST">
//       <input type="hidden" name="_method" value="DELETE">
//       <input type="submit" value="unlike">
//     </form>
//     <% } else {%> 
//     <form action="<%= likePublicationPath(publication) %>" method="POST">
//       <input type="hidden" name="_method" value="PUT">
//       <input type="submit" value="like">
//     </form>
//     <% }%>  