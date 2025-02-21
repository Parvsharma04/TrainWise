"use client";

import clsx from "clsx";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { useWindowScroll } from "react-use";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NavBar = () => {
  // State for toggling audio and visual indicator
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const whiteLinks = ["/", "/pricing"];

  // Refs for audio and navigation container
  const audioElementRef = useRef(null);
  const navContainerRef = useRef(null);

  const { y: currentScrollY } = useWindowScroll() || { y: 0 };
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Toggle audio and visual indicator
  const toggleAudioIndicator = () => {
    setIsAudioPlaying((prev) => !prev);
    setIsIndicatorActive((prev) => !prev);
  };

  // Manage audio playback
  useEffect(() => {
    if (isAudioPlaying) {
      audioElementRef.current.play();
    } else {
      audioElementRef.current.pause();
    }
  }, [isAudioPlaying]);

  useEffect(() => {
    if (currentScrollY === 0) {
      // Topmost position: show navbar without floating-nav
      setIsNavVisible(true);
      navContainerRef.current.classList.remove("floating-nav");
    } else if (currentScrollY > lastScrollY) {
      // Scrolling down: hide navbar and apply floating-nav
      setIsNavVisible(false);
      navContainerRef.current.classList.add("floating-nav");
    } else if (currentScrollY < lastScrollY) {
      // Scrolling up: show navbar with floating-nav
      setIsNavVisible(true);
      navContainerRef.current.classList.add("floating-nav");
    }

    setLastScrollY(currentScrollY);
  }, [currentScrollY, lastScrollY]);

  useEffect(() => {
    gsap.to(navContainerRef.current, {
      y: isNavVisible ? 0 : -100,
      opacity: isNavVisible ? 1 : 0,
      duration: 0.2,
    });
  }, [isNavVisible]);

  return (
    <div
      ref={navContainerRef}
      className="fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700 sm:inset-x-6"
    >
      <header className="absolute top-1/2 w-full -translate-y-1/2">
        <nav className="flex size-full items-center justify-between p-4">
          {/* Logo and Product button */}
          <div className="flex items-center gap-7">
            <img src="/img/logo.png" alt="logo" className="w-10" />
          </div>

          {/* Navigation Links and Audio Button */}
          <div className="flex h-full items-center">
            <div className="hidden md:block">
              <Link
                href={`/`}
                className={`nav-hover-btn md:!text-lg ${
                  !whiteLinks.find((e) => e == pathname) ? "!text-black" : ""
                }`}
              >
                Home
              </Link>
              <Link
                href={`/pricing`}
                className={`nav-hover-btn md:!text-lg ${
                  !whiteLinks.find((e) => e == pathname) ? "!text-black" : ""
                }`}
              >
                Pricing
              </Link>
              <Link
                href={`/about`}
                className={`nav-hover-btn md:!text-lg ${
                  !whiteLinks.find((e) => e == pathname) ? "!text-black" : ""
                }`}
              >
                About
              </Link>
              <Link
                href={`/auth`}
                className={`nav-hover-btn md:!text-lg ${
                  !whiteLinks.find((e) => e == pathname) ? "!text-black" : ""
                }`}
              >
                Login
              </Link>
            </div>

            <button
              className="ml-4 md:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <FiMenu size={24} />
            </button>

            <button
              onClick={toggleAudioIndicator}
              className="ml-10 flex items-center space-x-0.5"
            >
              <audio
                ref={audioElementRef}
                className="hidden"
                src="/audio/loop.mp3"
                loop
              />
              {/* {[1, 2, 3, 4].map((bar) => (
                <div
                  key={bar}
                  className={clsx("indicator-line !w-3 !h-5 !mr-5", {
                    active: isIndicatorActive,
                  })}
                  style={{
                    animationDelay: `${bar * 0.1}s`,
                  }}
                />
              ))} */}
            </button>
          </div>
        </nav>
      </header>

      <div
        className={clsx(
          "fixed -top-5 inset-y-0 left-0 z-50 w-64 bg-black shadow-lg transform transition-transform duration-300 md:hidden",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-lg font-semibold text-white">Menu</h2>
          <button onClick={() => setIsSidebarOpen(false)}>
            <FiX size={24} />
          </button>
        </div>
        <nav className="flex flex-col p-4 space-y-4 bg-gray-700 h-screen text-black">
          <Link
            href={`/`}
            onClick={() => setIsSidebarOpen(false)}
            className="nav-hover-btn md:!text-md "
          >
            Home
          </Link>
          <Link
            href={`/pricing`}
            onClick={() => setIsSidebarOpen(false)}
            className="nav-hover-btn !text-md "
          >
            Pricing
          </Link>
          <Link
            href={`/about`}
            onClick={() => setIsSidebarOpen(false)}
            className="nav-hover-btn !text-md "
          >
            About
          </Link>
          <Link
            href={`/auth`}
            onClick={() => setIsSidebarOpen(false)}
            className="nav-hover-btn !text-md "
          >
            Login
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default NavBar;
