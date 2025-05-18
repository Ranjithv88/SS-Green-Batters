import React from 'react'
import './style/Footer.scss'

const Footer = () => {
  return (
    <footer className="footer" id='footer'>
      <div className="container">
        <div className="footer__row">
          <div className="footer__column">
            <h4 className="footer__title">SS Green Batters</h4>
            <h5 className="footer__subtitle">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </h5>
            <div className="footer__socials">
              <button className="footer__icon-btn instagram"></button>
              <button className="footer__icon-btn x"></button>
              <button className="footer__icon-btn facebook"></button>
            </div>
          </div>
          <div className="footer__column footer__links">
            <div className="footer__link-block">
              <span className="footer__section-title">Useful Links</span>
              <ul>
                <li><a href="#">instagram</a></li>
                <li><a href="#">X</a></li>
                <li><a href="#">facebook</a></li>
              </ul>
            </div>
            <div className="footer__link-block">
              <span className="footer__section-title">Other Resources</span>
              <ul>
                <li><a href="#">MIT License</a></li>
                <li><a href="#">Terms & Conditions</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Contact Us</a></li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="footer__divider" />
        <div className="footer__bottom">
          <div className="footer__copyright">
            © {new Date().getFullYear()}{" "}
            <a href="https://www.creative-tim.com/product/notus-js" target="_blank" rel="noopener noreferrer">
              Notus JS
            </a>{" "}
            by{" "}
            <a href="https://www.creative-tim.com?ref=njs-profile" target="_blank" rel="noopener noreferrer">
              Creative Tim
            </a>.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

