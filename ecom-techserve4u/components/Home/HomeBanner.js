import React from 'react'

function HomeBanner() {
    return (
        <div className="row">
              <div className="col-lg-4 col-md-4 col-sm-12 two">
                <div className="row">
                  <div className="col-12 mb-2">
                    <img style={{ maxHeight: "211px" }} src="/watch-banner.jpg" alt="" />
                  </div>
                  <div className="col-12">
                    <img style={{ maxHeight: "211px" }} src="/camera-banner.jpg" alt="" />
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-4 col-sm-12">
                <img src="/50-banner.jpg" alt="" />
              </div>
              <div className="col-lg-4 col-md-4 col-sm-12 two">
                <div className="col-12 mb-2">
                  <img style={{ maxHeight: "211px" }} src="/laptop-banner.jpg" alt="" />
                </div>
                <div className="col-12">
                  <img style={{ maxHeight: "211px" }} src="/dress-banner.jpg" alt="" />
                </div>
              </div>
            </div>
    )
}

export default HomeBanner
