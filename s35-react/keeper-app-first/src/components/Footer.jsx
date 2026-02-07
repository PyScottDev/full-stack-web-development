import React from "react";

function Footer() {
  const date = new Date();
  const year = date.getFullYear;
  return <p>Copyright {year}</p>;
}

export default Footer;

