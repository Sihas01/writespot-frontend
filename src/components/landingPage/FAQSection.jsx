import { useState, useRef } from "react";
import { MdKeyboardArrowUp } from "react-icons/md";
import { MdKeyboardArrowDown } from "react-icons/md";

const faqs = [
  {
    question: "What is this platform about?",
    answer:
      "This platform allows authors to publish their work and readers to explore new stories.",
  },
  {
    question: "How do I register as an author?",
    answer:
      "Click on the 'Register as Author' button and fill in your required details.",
  },
  {
    question: "Is it free to read stories?",
    answer:
      "Yes! Readers can explore stories for free, with optional premium upgrades.",
  },
  {
    question: "Can I publish my book here?",
    answer:
      "Absolutely! We support all authors, whether new or experienced.",
  },
  {
    question: "Can I publish my book here?",
    answer:
      "Absolutely! We support all authors, whether new or experienced.",
  },
  {
    question: "Can I publish my book here?",
    answer:
      "Absolutely! We support all authors, whether new or experienced.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <div className="px-6 md:px-16 lg:px-32 py-20 bg-[#F8F8F8]">
      <h1 className="text-3xl md:text-4xl font-poppins-sm  mb-12 text-[#074B03]">
        FAQs
      </h1>

      <div className="space-y-4 w-full">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={index}
              className="border-l-4 border-[#074B03] bg-white rounded-md shadow-md"
            >
            
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center px-6 py-4"
              >
                <span className="font-poppins-md  text-left">{faq.question}</span>
                <span className="text-2xl">{isOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}</span>
              </button>

             
              <div
                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? "max-h-40 py-4 border-t" : "max-h-0 py-0"
                }`}
              >
                <p className="text-gray-600 font-poppins-rg">{faq.answer}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FAQSection;
