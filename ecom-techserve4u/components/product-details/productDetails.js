import React, { useState, useEffect } from 'react'
import ProductTab from './ProductTab';
import ShareThis from '../sharethis';
import { Select, Button, notification, Divider, Space, Empty } from 'antd';

import { useDispatch } from 'react-redux'
import { addToCart } from '../../actions/cartActions'
import Link from 'next/link'
import Router from 'next/router'

import SliderImage from 'react-zoom-slider';
import { notificationFunc } from '../global/notification'
import Rating from '@material-ui/lab/Rating';

const { Option } = Select;

const openNotification = (placement, msg) => {
    notification.success({
        message: `${msg}- added to your cart`,
        placement,
    });
};



function ProductInfo({ product, campDiscount }) {
    //console.log(product);
    let dispatch = useDispatch()
    const [images, setImages] = useState([]);
    const [quantity, setQuantity] = useState(1)
    const [attributes, setAttributes] = useState({})

    const [cartProduct, setCartProduct] = useState({})
    const [thumb, setthumb] = useState("")

    const [price, setPrice] = useState(0)
    const [discount, setDiscount] = useState(0)
    const [discountType, setDiscountType] = useState('')

    const [variations, setVariations] = useState([])

    const [error, setError] = useState({})

    const [stock, setStock] = useState(1)

    const [campaign, setCampaign] = useState(null)



    const setProductForCart = (prod) => {
        let item = {
            productId: prod._id,
            thumbnail: prod.thumbnail,
            name: prod.name,
            attributes,
            slug: prod.slug,
            shipping: prod.shipping,
            campaign: campaign ? campaign._id : null,
            isAvailable: true
        }
        if (discount > 0) {
            if (discountType === 'flat') {
                item.price = price - discount
            } else if (discountType === 'percent') {
                item.price = price - Math.floor((price * (discount / 100)))
            }

        } else {
            item.price = price
        }

        if (prod.tax.taxType === 'flat') {
            item.tax = prod.tax.value
        } else if (prod.tax.taxType === 'percent') {
            item.tax = Math.floor((prod.price * (prod.tax.value / 100)))
        }
        //console.log(item);

        setCartProduct(item)
    }



    useEffect(() => {
        if (!product) return
        setImages([{
            image: product.thumbnail,
            text: ""
        }]
        )
        product.gallery.length > 0 && product.gallery.map(g => {
            setImages(prev => [...prev, { image: g, text: "" }])
        })

        // product.attributes.length > 0 && product.attributes.map(attr => {
        //     setAttributes(prev => [...prev, { [attr.name]: attr.values[0] }])
        // })
        //console.log(campDiscount);
        if (campDiscount) {
            setCampaign({ name: campDiscount.campName, slug: campDiscount.campSlug, _id: campDiscount.campId })
            setDiscount(campDiscount.value)
            setDiscountType(campDiscount.discountType)
        } else {
            setDiscount(product.discount.value)
            setDiscountType(product.discount.discountType)
        }
        setPrice(product.price)


        setVariations(product.variations)
        setStock(product.stock)



        setthumb(product.thumbnail)

    }, [campDiscount, product]);


    useEffect(() => {
        if (!product) return
        setProductForCart(product)


    }, [attributes, quantity, variations, price, discount, discountType, campaign, product])

    function findByMatchingProperties(set, properties) {
        return set.filter(function (entry) {
            return Object.keys(properties).every(function (key) {
                return entry[key] === properties[key];
            });
        });
    }




    const arraysCompare = (a1, a2) => {

        if (a1.length !== a2.length) return false;
        const objectIteration = (object) => {
            const result = [];
            const objectReduce = (obj) => {
                for (let i in obj) {
                    if (typeof obj[i] !== 'object') {
                        result.push(`${i}${obj[i]}`);
                    } else {
                        objectReduce(obj[i]);
                    }
                }
            };
            objectReduce(object);

            return result;
        };
        const reduceArray1 = a1.map(item => {
            if (typeof item !== 'object') return item;
            return objectIteration(item).join('');
        });
        const reduceArray2 = a2.map(item => {
            if (typeof item !== 'object') return item;
            return objectIteration(item).join('');
        });
        const compare = reduceArray1.map(item => reduceArray2.includes(item));
        // console.log(compare.length === 1 && compare.includes(true));
        if (compare.length === 1 && compare.includes(true)) {
            return true
        }
        return compare.reduce((acc, item) => acc + Number(item)) === a1.length;
    };

    useEffect(() => {
        if (attributes.length === 0 || variations.length === 0) return
        let attrArray = []
        Object.keys(attributes).map(key => {
            attrArray.push({ [key]: attributes[key] })
        })

        variations.map(obj => {
            let array = []
            Object.keys(obj).map(key => {
                if (key === 'discount' || key === 'discountType' || key === 'image' || key === 'isDefault' || key === 'price' || key === 'stock' || key === 'varname') return
                array.push({ [key]: obj[key] })
            })
            // console.log(arraysCompare(array, attrArray));





            if (arraysCompare(array, attrArray)) {

                setPrice(obj['price'])
                if (campDiscount) {
                    setDiscount(campDiscount.value)
                    setDiscountType(campDiscount.discountType)
                } else {
                    setDiscount(obj['discount'])
                    setDiscountType(obj['discountType'])
                }

                setStock(obj['stock'])
                if (obj['image']) {
                    let varimages = [...images]
                    let index = varimages.findIndex(img => img.text === 'var')
                    if (index === -1) {
                        setImages(prev => [{ image: obj['image'], text: "var" }, ...prev,])
                    } else {
                        varimages[0] = { image: obj['image'], text: 'var' }
                        setImages(varimages)
                    }

                }
                return
            }

        })

    }, [attributes, variations, product])


    const checkAttr = async () => {
        if (product && product.attributes.length > 0) {
            product.attributes.map(attr => {
                //console.log(attr);
                if (Object.keys(attributes).includes(attr.name)) {

                    if (!attributes[attr.name]) {
                        return setError(prev => ({ ...prev, [attr.name]: "Please select a value" }))
                    }
                    //console.log(attributes, error);
                    let index = Object.keys(error).findIndex(err => err === attr.name)

                    let newError = { ...error }
                    if (index !== -1) {
                        delete newError[attr.name]
                        setError(newError)
                    }


                    //console.log(Object.keys(newError).length);

                    return true
                } else {
                    setError(prev => ({ ...prev, [attr.name]: "Please select a value" }))
                    //notificationFunc("error","Please select all variants")
                    return true
                }
            })

        }
    }


    let handleCart = async (action) => {

        const res = await checkAttr()
        //console.log(res);

        if (Object.keys(error).length === 0) {

            if (product.attributes.length !== Object.keys(attributes).length) return notificationFunc("error", "Please select all variants!")
            //console.log("sdg");
            if (quantity > stock) return notificationFunc("error", "Quantity must be below stock")
            dispatch(addToCart(cartProduct, quantity, attributes))
            if (action === 'buynow') {
                return Router.push("/checkout")
            }
            dispatch({
                type: "CART_OPEN"
            })

            openNotification('bottomLeft', product.name)
        } else {
            notificationFunc("error", "Please select all variants!")
        }

    }


    const increaseQuantity = () => {
        if (quantity >= stock) return
        setQuantity(prev => prev + 1)
    }
    const decreaseQuantity = () => {
        if (quantity === 1) return
        setQuantity(prev => prev - 1)
    }


    //---------------------set variations-----------
    const getKey = (object) => {
        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                //alert(key); // 'a'
                return (object[key]); // 'hello'
            }
        }
    }

    const getValue = (obj, name) => {

        let value = ''
        if (Object.keys(attributes).length > 0) {
            Object.keys(attributes).map(key => {
                // console.log( key , name);
                if (key === name) value = attributes[key]

            })
        } else {
            value = ''
        }
        //console.log(value);
        return value
    }

    const handleAttributes = (value) => {

        let key = Object.keys(value)[0]
        let attr = { ...attributes }
        if (value[key] === '') {
            if (Object.keys(attr).includes(key)) {
                delete attr[key]
                setAttributes(attr)
            }
        } else {
            setAttributes(prev => ({ ...prev, ...value }))
        }

    }

    useEffect(() => {
        checkAttr()
    }, [attributes, product])





    return (
        <>
            <div className="col-md-9 col-sm-12">
                <div className="row background_white">
                    <div className="col-md-6 col-sm-12 product_image">
                        <div className="row">

                            {
                                images.length > 0 &&
                                <SliderImage
                                    data={images}
                                    width="500px"
                                    showDescription={true}
                                    direction="right"
                                />
                            }


                        </div>
                    </div>
                    <div className="col-md-6 col-sm-12 product_info mt-3">
                        <h1 className='product_name text-capitalize'>{product.name}</h1>
                        <div className="review">
                            <span>
                                <Rating size="small" precision={0.5} readOnly defaultValue={0} value={product.average} />
                            </span>
                            <span >({product.ratingCount || 0} reviews)</span>

                        </div>
                        <div className="sku"><span className="key">SKU: </span> <span>{product?.sku ? product.sku : "N/A"}</span></div>
                        <div className="price">
                            {
                                discount > 0 ?
                                    <>
                                        <span className="old-price">${price}</span>
                                        {
                                            discountType === 'flat' ?
                                                <span className="new-price">${price - discount}</span> :
                                                <span className="new-price">${price - Math.floor((price * (discount / 100)))}</span>
                                        }

                                    </> :
                                    <span className="new-price">${price}</span>
                            }
                            {/* $ {product?.price ? product.price : "N/A"} */}

                        </div>
                        {campaign && <div className="brand">
                            <span className="key"> Campaign: </span>
                            <Link href={`/campaign/${campaign.slug}`}><span>{campaign.name}</span></Link>
                        </div>}
                        <div className="brand">
                            <span className="key"> Brand: </span>
                            <span>{product?.brand[0] ? product.brand[0]?.name : "N/A"}</span>
                        </div>
                        <div className="attributes">
                            {
                                product.attributes.length > 0 &&
                                product.attributes.map((attr, index) => {
                                    return (
                                        <>
                                            <span key={index} className="key">{attr.name}:</span>
                                            <Select

                                                style={{ width: 150 }}
                                                value={getValue(attributes, attr.name)}
                                                className="m-2"
                                                onChange={(value => handleAttributes({ [attr.name]: value }))}
                                            >
                                                <Option value="" >Select a value</Option>
                                                {
                                                    attr.values.map((val, index) => {
                                                        return (

                                                            <Option key={index} value={val} >{val}</Option>


                                                        )
                                                    })
                                                }
                                            </Select>

                                            <br />
                                            {
                                                error[attr.name] && <p style={{ color: "red", fontStyle: "italic", fontSize: "12px" }}>{error[attr.name]}</p>
                                            }
                                        </>
                                    )
                                })
                            }
                            <span className="key"></span>
                        </div>
                        {/* <div className="description">
                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptates tempore dolor aut eos neque eveniet aspernatur hic officia a rerum. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eum iste velit possimus repellat aut ut mollitia tempore voluptatibus, natus dolore!
                                    </div> */}
                        <div className="quantity">
                            <span className="key">
                                <span className="key">Quantity: </span> </span>
                            <span className='quantity_field'>

                                <button onClick={() => decreaseQuantity()}>-</button>
                                <input value={quantity} type="number" className="input-number" readOnly />
                                <button onClick={() => increaseQuantity()} >+</button>
                            </span>

                        </div>
                        {
                            stock == 0 ? <strong style={{ color: "red" }}>Out of stock</strong> : <span>Remaining <strong style={{ color: "red" }}>{stock}</strong> items</span>
                        }

                        <div className="action_button">
                            <button disabled={stock == 0} onClick={() => handleCart()} className="add_to_cart"><i className="fas fa-cart-plus mr-2"></i>Add To Cart</button>
                            <button onClick={() => handleCart("buynow")} className="add_to_wish">Buy Now</button>
                        </div>
                        <div className='mt-2'>
                            <ShareThis />
                        </div>

                    </div>
                </div>

                <div className="row">
                    <div className="col-12 my-2">
                        <ProductTab productId={product._id} description={product.description} tags={product.tags} />
                    </div>


                </div>
            </div>
        </>
    )
}

export default ProductInfo
