import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="mt-10 text-sm text-gray-500 flex flex-col items-center gap-2">
      <span>© {new Date().getFullYear()} Tipko &amp; Miška</span>
      <a
        className="hover:underline hover:text-blue-600"
        href="https://safe.si/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Več o varnosti na spletu
      </a>
    </footer>
  );
};

export default Footer;
