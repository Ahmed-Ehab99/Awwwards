import { useEffect, useRef, useState } from "react"
import { useWindowScroll } from "react-use";
import gsap from "gsap";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import MenuSvg from "./MenuSvg";

const navItems = ["About", "Features", "Story", "Contact"];

const Navbar = () => {
    const [openNavigation, setOpenNavigation] = useState(false);
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const [isIndicatorActive, setIsIndicatorActive] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isNavVisible, setIsNavVisible] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const navContainerRef = useRef(null);
    const audioElementRef = useRef(null);
    const popupRef = useRef(null);
    const { y: currentScrollY } = useWindowScroll();

    const toggleAudioIndecator = () => {
        setIsAudioPlaying(prev => !prev);
        setIsIndicatorActive(prev => !prev);
    }

    const toggleNavigation = () => {
        if (openNavigation) {
            setOpenNavigation(false);
            enablePageScroll();
        } else {
            setOpenNavigation(true);
            disablePageScroll();
        }
    };

    const handleClick = () => {
        if (!openNavigation) return;
        enablePageScroll();
        setOpenNavigation(false);
    };

    useEffect(() => {
        if (currentScrollY === 0) {
            setIsNavVisible(true);
            navContainerRef.current.classList.remove("floating-nav");
        } else if (currentScrollY > lastScrollY) {
            setIsNavVisible(false);
            navContainerRef.current.classList.add("floating-nav");
        } else if (currentScrollY < lastScrollY) {
            setIsNavVisible(true);
            navContainerRef.current.classList.add("floating-nav");
        }
        setLastScrollY(currentScrollY);
    }, [currentScrollY, lastScrollY]);

    useEffect(() => {
        gsap.to(navContainerRef.current, {
            y: isNavVisible ? 0 : -100,
            opacity: isNavVisible ? 1 : 0,
            duration: 0.2
        })
    }, [isNavVisible])

    useEffect(() => {
        if (isAudioPlaying) {
            audioElementRef.current.play();
        } else {
            audioElementRef.current.pause();
        }
    }, [isAudioPlaying]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowPopup(true);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (showPopup) {
            gsap.fromTo(popupRef.current,
                { opacity: 0, x: 20 },
                { opacity: 1, x: 0, duration: 0.5 }
            );
        }
    }, [showPopup]);

    return (
        <div ref={navContainerRef} className={`fixed inset-x-0 ${openNavigation ? "top-0" : "top-4"} z-50 h-16 border-none transition-all duration-700 sm:inset-x-6`}>
            <header className="absolute top-1/2 w-full -translate-y-1/2">
                <nav className="flex size-full items-center justify-between p-4">
                    <a href="#" className="flex items-center focus-visible:outline-none">
                        <img src="/img/logo.png" alt="logo" className="w-10" />
                    </a>
                    <div className={`${openNavigation ? "flex" : "hidden"
                        } fixed top-1 left-0 right-0 bottom-0 bg-n-8 md:static md:flex md:bg-transparent bg-black justify-center items-center h-screen md:h-full flex-col md:flex-row`}>
                        <div className="flex items-center justify-center flex-col md:flex-row gap-16 md:gap-0">
                            {navItems.map((item) => (
                                <a key={item} href={`#${item.toLowerCase()}`} className="nav-hover-btn" onClick={handleClick}>
                                    {item}
                                </a>
                            ))}
                        </div>
                        <button className="bg-blue-50 w-fit relative cursor-pointer rounded-full md:ml-10 mt-16 md:mt-0 flex items-center px-7 py-3 space-x-0.5" onClick={toggleAudioIndecator}>
                            <audio src="/audio/loop.mp3" loop ref={audioElementRef} className="hidden" />
                            {[1, 2, 3, 4].map((bar) => (
                                <div
                                    key={bar}
                                    className={`indicator-line ${isIndicatorActive ? "active" : ""}`}
                                    style={{
                                        animationDelay: `${bar * 0.1}s`,
                                    }}
                                />
                            ))}
                        </button>
                        {showPopup && (
                            <div ref={popupRef} className={`${openNavigation ? "hidden" : "flex"} absolute top-[3.7rem] text-sm w-64 gap-3 right-0 font-general bg-violet-300 text-blue-50 p-6 rounded items-center`}>
                                <span>You can always turn on the sound</span>
                                <button onClick={() => setShowPopup(false)} className="ml-2 text-black">
                                    X
                                </button>
                                <div className="absolute -top-2 right-10 border-l-8 border-r-8 border-b-8 border-transparent border-b-violet-300" />
                            </div>
                        )}
                    </div>
                    <button onClick={toggleNavigation} className="md:hidden z-50">
                        <MenuSvg openNavigation={openNavigation} />
                    </button>
                </nav>
            </header>
        </div>
    )
}

export default Navbar