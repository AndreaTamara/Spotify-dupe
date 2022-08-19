import './TrackCard.css';
import { FiHeart, FiClock } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { BsPlayFill } from 'react-icons/bs';
import { useSelector, useDispatch } from 'react-redux';
import { selectUriToPlay } from '../../actions/playingActions';
import { checkSavedTrack, removeSavedTrack, saveTrack } from '../../api/privateServices';
import { useEffect, useState } from 'react';


export const TrackCard = ({ header, number, url, name, author, album, time, albumView, albumId, hidden, uri, id }) => {

    const { logged } = useSelector(state => state.log)
    const { currentTrack } = useSelector(state => state.playing)
    const dispatch = useDispatch()
    const [isSaved, setIsSaved] = useState(null)

    const handlePlay = (uri) => {
        console.log('inicio play:' + uri)
        if (uri && logged) dispatch(selectUriToPlay(uri))
    }

    const checkIfIsSave = (id) => {
        if (id) {
            checkSavedTrack(id)
                .then((res) => setIsSaved(res))
        }
    }

    useEffect(() => {
        checkIfIsSave(id)
    }, [id])

    const handleOnClickSave = (id) => {
        if (!isSaved) {
            saveTrack(id)
                .then(() => checkIfIsSave(id))
        } else {
            removeSavedTrack(id)
                .then(() => checkIfIsSave(id))
        }

    }


    return (
        <div
            className={`track-card 
                ${header && 'track-card-header'} 
                ${albumView && 'track-card-album'} 
                ${hidden || ''}
                ${currentTrack === uri && 'play-icon-active'}`}
        >
            <div
                className={`track-number`}>
                <span className='number-of-track'>
                    {header ? '#' : number}
                </span>
                {!header &&
                    <span
                        onClick={() => handlePlay(uri)}
                        className='play-icon play-icon-desktop'>
                        <BsPlayFill />
                    </span>}
            </div>
            <div className='track-name'>
                {(!header && !albumView) &&
                    <div className={`track-img-container`}>
                        <img className='track-img' src={url} alt='album cover' />
                        <span
                            onClick={() => handlePlay(uri)}
                            className='play-icon play-icon-mobile'>
                            <BsPlayFill />
                        </span>
                    </div>
                }
                <span className='track-info'>
                    {header ? 'TITLE' :
                        <p className='track-info-name'
                            onClick={albumView ? () => handlePlay(uri) : () => { }}>
                            {name}
                        </p>}
                    {!header &&
                        <p className='track-info-author'>
                            {author?.map((e, i) =>
                                <Link key={e.id} to={'/artist/' + e.id}>
                                    {`${e.name}${(i + 1) === author.length ? '' : ','}`}
                                </Link>)}
                        </p>
                    }
                </span>
            </div>
            {!albumView &&
                <div className='track-album'>
                    {header ? 'ALBUM' :
                        <Link to={'/album/' + albumId}>
                            {album}
                        </Link>}
                </div>
            }
            <div className={`track-save ${isSaved && 'show'}`}
                onClick={() => handleOnClickSave(id)}
            >
                {!header && <FiHeart className={`save-btn ${isSaved && 'active'}`} />}
            </div>
            <div className='track-time'>
                {header ? <FiClock /> : time}
            </div>
        </div>
    )
}
