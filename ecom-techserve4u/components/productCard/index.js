import React from "react";
import Link from "next/link";
import Rating from '@material-ui/lab/Rating';
import Image from 'next/image'

function ProductCard({ product }) {
    //console.log(product);
    return (
        <div className="product_card">
            <div className="product_image">
                {
                    product?.discount?.value > 0 &&
                    <span className="discount-tag-in-percent">
                        - {product.discount.discountType === 'percent' ? product.discount.value :
                            Math.floor((product.discount.value / product.price) * 100)
                        }%
                    </span>
                }

                <Link href={`/product/${product?.slug ? product.slug : "sample"}`}>
                    <div>
                        <Image
                            width={500}
                            height={500}
                            src={
                                product?.thumbnail
                                    ? product.thumbnail
                                    : "https://via.placeholder.com/250"
                            }

                            alt="Product"
                        />
                    </div>
                </Link>
            </div>
            <Link href={`/product/${product?.slug ? product.slug : "sample"}`}>
                <div>
                    <div className="product_info">
                        <div className="rating">
                            <Rating size="small" precision={0.5} readOnly defaultValue={0} value={product.average} />
                            <span className='count'>({product.ratingCount || 0})</span>
                        </div>
                        <h5>{product?.name ? product.name : "Product name"}</h5>

                        <div className="product-price">
                            {
                                product?.discount?.value > 0 ?
                                    <>
                                        <span className="old-price">${product.price}</span>
                                        {
                                            product.discount.discountType === 'flat' ?
                                                <span className="new-price">${product.price - product.discount.value}</span> :
                                                <span className="new-price">${product.price - Math.floor((product.price * (product.discount.value / 100)))}</span>
                                        }

                                    </> :
                                    <span className="new-price">${product.price}</span>
                            }


                        </div>


                        {/* <span>$ {product?.price ? product.price : "1200"}</span> */}
                    </div>
                </div>
            </Link>
            {/* <div className="card_footer">
           <span><i className="fas fa-eye"></i></span>
           <span><i className="fas fa-cart-plus"></i></span>
           <span><i className="fas fa-heart"></i></span>
        </div> */}
        </div>
    );
}

export default ProductCard;
