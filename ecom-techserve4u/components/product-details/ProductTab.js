import React, { useState } from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import ReactHtmlParser from 'react-html-parser'
import Reviews from './Reviews';

function ProductTab({description, tags,productId}) {
   
    const [key, setKey] = useState('description');
    return (
        <div className="product_tab">
            <Tabs
                id="controlled-tab-example"
                activeKey={key}
                onSelect={(k) => setKey(k)}
            >
                <Tab eventKey="description" title="Description">
                    {
                        description ? ReactHtmlParser(description) :"No descriptions found"
                    }
                </Tab>
                <Tab eventKey="reviews" title="Reviews">
                   <Reviews productId={productId} />
                </Tab>
                <Tab eventKey="tags" title="Tags">
                    {tags?tags.join(","):"No tags found"} 
                </Tab>
            </Tabs>
        </div>
    )
}

export default ProductTab
