import React, { useState, useEffect } from 'react'
import Header from '../components/header/Header.js'
import Link from 'next/link'
import axios from 'axios'
import Countdown from 'react-countdown';
import { SpinnerCircularFixed } from 'spinners-react';





function campaings() {
    const [campaigns, setCampaigns] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        axios.get('/campaign/getactive')
            .then(res => {
                setIsLoading(false)
                setCampaigns(res.data.campaigns)
            })
            .catch(err => {
                setIsLoading(false)
                err && err.response && console.log(err.response.data)
            })
    }, [])


    const renderer = ({ days, hours, minutes, seconds, completed }) => {
        if (completed) {
            // Render a completed state
            return <span>Completed</span>;
        } else {
            // Render a countdown
            return <div className='timer'>
                <div>
                    <strong>Days</strong>
                    <span className='time'>{days}</span>
                </div>
                <div>
                    <strong>Hours</strong>
                    <span className='time'>{hours}</span>
                </div>
                <div>
                    <strong>Minutes</strong>
                    <span className='time'>{minutes}</span>
                </div>
                <div>
                    <strong>Seconds</strong>
                    <span className='time'>{seconds}</span>
                </div>
            </div>


        }
    };



    return (
        <>
            <Header />
            <div id='campaings'>

                <div className="main_container">
                    <h4 className='title'>Campaigns</h4>
                    <div className="camp_container">
                        <div className="row">
                            {
                                isLoading ?
                                    <div style={{ textAlign: "center", marginTop: "10vh" }}>
                                        <SpinnerCircularFixed size={100} thickness={160} speed={100} color="#36D7B7" secondaryColor="rgba(0, 0, 0, .05)" />
                                    </div>
                                    :
                                    campaigns.length > 0 ?
                                        campaigns.map((camp, index) => (
                                            <div key={index} className="col-md-6 col-sm-12">
                                                <Link href={`/campaign/${camp.slug}`}>
                                                    <div>
                                                        <div className="camp_card">
                                                            <img src={camp.image} alt="" />
                                                            <h6>{camp.name}</h6>

                                                            <Countdown
                                                                date={camp.endAt}
                                                                renderer={renderer}
                                                            />
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        )) :
                                        <p>No campaigns found</p>
                            }



                        </div>





                    </div>
                </div>
            </div>
        </>
    )
}

export default campaings
