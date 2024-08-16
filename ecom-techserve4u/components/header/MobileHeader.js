import React, { useState } from 'react'
import Search from './Search'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import NotificationComp from './NotificationComp'
import { motion, AnimatePresence } from "framer-motion"

function MobileHeader({ setUserDrawerOpen }) {
    const [isSearch, setIsSearch] = useState(false)
    const { user, isAuthenticated } = useSelector(state => state.auth)
    return (
        <div className="mobile_nav_container">
            <div className="nav_content">
                <div className="bars">
                    <i onClick={setUserDrawerOpen} className="fas fa-bars mr-3"></i>
                </div>
                <div className="mobile_logo">

                    <Link href='/'>

                        <img src='/logo.png'></img>
                        {/* Protocol Inc */}

                    </Link>
                </div>
                <div className="search_logo">
                    {
                        isAuthenticated && <NotificationComp />
                    }
                    <i onClick={() => setIsSearch(!isSearch)} className="fas fa-search"></i>
                </div>
            </div>

            <AnimatePresence>
                {isSearch && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Search />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* {
                isSearch &&
                <div style={{ marginBottom: "10px" }}>
                    <Search />
                </div>
            } */}
        </div>
    )
}

export default MobileHeader
