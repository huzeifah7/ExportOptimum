import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import emailsData from "../../Data/Emails.json";
import logo from "../../EOLogo.png";
import Sidebar from "../Sidebar";

const Emails = () => {
  const [emails, setEmails] = useState([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    setEmails(emailsData);
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();
    let yPosition = 50;
    const maxEmailsPerPage = 22;
    let emailCount = 0;
    
    doc.addImage(logo, "PNG", 10, 10, 30, 30);
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 255);
    doc.text("List of Emails", 50, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    doc.line(105, 40, 105, 280); // Vertical line from top to bottom

    for (let i = 0; i < emails.length; i += 2) {
      if (emailCount >= maxEmailsPerPage) {
        doc.addPage();
        yPosition = 50;
        emailCount = 0;
        doc.addImage(logo, "PNG", 10, 10, 30, 30);
        doc.setFontSize(18);
        doc.setTextColor(0, 0, 255);
        doc.text("List of Emails", 50, 20);
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.line(105, 40, 105, 280); // Vertical line for new page
      }
      
      doc.text(emails[i], 20, yPosition);
      if (emails[i + 1]) {
        doc.text(emails[i + 1], 110, yPosition);
      }
      
      yPosition += 10;
      emailCount++;
    }
    
    doc.save("emails.pdf");
  };

  return (
    <div className="flex">



      <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center w-full">
        <button
          onClick={generatePDF}
          className="mb-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded shadow-lg hover:shadow-xl transition duration-300"
        >
          Generate PDF
        </button>
        <div className="grid grid-cols-3 gap-6 bg-white p-6 rounded shadow-lg">
          {emails.map((email, index) => (
            <div key={index} className="p-4 border rounded-lg shadow-md bg-blue-100 text-blue-900 font-semibold">
              {email}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Emails;
