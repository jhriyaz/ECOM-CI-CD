import React, { useEffect, useState } from 'react'
import Rating from '@material-ui/lab/Rating';
import { Progress, Comment, Avatar } from 'antd';
import axios from 'axios'
function Reviews({ productId }) {
    const [reviewsCount, setReviewsCount] = useState(0)
    const [average, setAverage] = useState(0)
    const [reviewsStats, setReviewsStats] = useState([])
    const [reviews, setReviews] = useState([])

    useEffect(() => {

        if (productId) {
            axios.get('/review/get/' + productId)
                .then(res => {
                    const { reviewsCount, average, reviewsStats, reviews } = res.data
                    setReviewsCount(reviewsCount)
                    setAverage(average)
                    setReviewsStats(reviewsStats)
                    setReviews(reviews)
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }, [productId])

    const Review = ({ children, review }) => (
        <Comment
            author={<div className='review_list'>
                <Rating size="small" precision={0.5} readOnly defaultValue={0} value={review.rating} />
                <span>{review.user?.name}</span>
            </div>}
            avatar={
                <Avatar
                    src={review.user?.profilePicture ? review.user.profilePicture : "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"}
                    alt={review.user?.name}
                />
            }
            content={
                <p>
                    {review.comment}
                </p>
            }
        >
            {children}
        </Comment>
    );


    const Reply = ({reply}) => (

        <Comment
            author={<span>{reply?.name}</span>}
            avatar={
                <Avatar
                    src={reply?.profile ? reply.profile : "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"}
                    alt={reply?.name}
                />
            }
            content={
                <p>
                    {reply.comment}
                </p>
            }
        />

    )


    return (
        <div id='review'>
            <div className="review_info">
                <div className="counts">
                    <div className="average_count">
                        <span>{average == 'NaN' ? 0 : average}<span className='maximum'>/5</span></span>
                    </div>
                    <div className="rating">
                        <Rating size="large" precision={0.5} readOnly defaultValue={0} value={average} />
                    </div>
                    <div className="total">
                        {reviewsCount} Ratings
                    </div>
                </div>
                <hr className='mobile' />

                <div className="progress_container">
                    <li className="item">
                        <span className="rating_icon">
                            <Rating size="small" readOnly value={5} />
                        </span>
                        <div className="loader">
                            <Progress
                                className='progress_bar'
                                showInfo={false}
                                strokeLinecap="square"
                                percent={reviewsStats.filter(r => r._id === 5)[0] ? (reviewsStats.filter(r => r._id === 5)[0].count / reviewsCount) * 100 : 0}
                            />
                            <span>{reviewsStats.filter(r => r._id === 5)[0] ? reviewsStats.filter(r => r._id === 5)[0].count : 0}</span>
                        </div>
                    </li>
                    <li className="item">
                        <span className="rating_icon">
                            <Rating size="small" readOnly value={4} />
                        </span>
                        <div className="loader">
                            <Progress
                                className='progress_bar'
                                showInfo={false}
                                strokeLinecap="square"
                                percent={reviewsStats.filter(r => r._id === 4)[0] ? (reviewsStats.filter(r => r._id === 4)[0].count / reviewsCount) * 100 : 0}
                            />
                            <span>{reviewsStats.filter(r => r._id === 4)[0] ? reviewsStats.filter(r => r._id === 4)[0].count : 0}</span>
                        </div>
                    </li>
                    <li className="item">
                        <span className="rating_icon">
                            <Rating size="small" readOnly value={3} />
                        </span>
                        <div className="loader">
                            <Progress
                                className='progress_bar'
                                showInfo={false}
                                strokeLinecap="square"
                                percent={reviewsStats.filter(r => r._id === 3)[0] ? (reviewsStats.filter(r => r._id === 3)[0].count / reviewsCount) * 100 : 0}
                            />
                            <span>{reviewsStats.filter(r => r._id === 3)[0] ? reviewsStats.filter(r => r._id === 3)[0].count : 0}</span>
                        </div>
                    </li>
                    <li className="item">
                        <span className="rating_icon">
                            <Rating size="small" readOnly value={2} />
                        </span>
                        <div className="loader">
                            <Progress
                                className='progress_bar'
                                showInfo={false}
                                strokeLinecap="square"
                                percent={reviewsStats.filter(r => r._id === 2)[0] ? (reviewsStats.filter(r => r._id === 2)[0].count / reviewsCount) * 100 : 0}
                            />
                            <span>{reviewsStats.filter(r => r._id === 2)[0] ? reviewsStats.filter(r => r._id === 2)[0].count : 0}</span>
                        </div>
                    </li>
                    <li className="item">
                        <span className="rating_icon">
                            <Rating size="small" readOnly value={1} />
                        </span>
                        <div className="loader">
                            <Progress
                                className='progress_bar'
                                showInfo={false}
                                strokeLinecap="square"
                                percent={reviewsStats.filter(r => r._id === 1)[0] ? (reviewsStats.filter(r => r._id === 1)[0].count / reviewsCount) * 100 : 0}
                            />
                            <span>{reviewsStats.filter(r => r._id === 1)[0] ? reviewsStats.filter(r => r._id === 1)[0].count : 0}</span>
                        </div>
                    </li>
                </div>
            </div>
            <hr />
            <div className="comments_section">
                {
                    reviews.length > 0 ?
                        reviews.map((review, index) => {
                            return (
                                <Review key={index} review={review} >
                                    {
                                        review.reply && review.reply.comment && <Reply reply={review.reply} />
                                    }
                                </Review>
                            )
                        }) :
                        <p>No reviews found</p>
                }

            </div>
        </div>
    )
}

export default Reviews
