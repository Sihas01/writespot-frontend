import React from 'react';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { MdClose } from 'react-icons/md';

const ManuscriptNoticeModal = ({ isOpen, onClose, onProceed }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                        <div className="bg-[#5A7C65]/10 p-3 rounded-full text-[#5A7C65]">
                            <IoInformationCircleOutline size={32} />
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
                        >
                            <MdClose size={24} />
                        </button>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold font-nunito text-[#5A7C65] mb-4">Manuscript Guidelines</h2>
                        <div className="space-y-4 text-gray-600 font-nunito text-lg leading-relaxed">
                            <p>
                                Before you begin the publishing process, please ensure your manuscript meets the following requirements:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>
                                    Only <span className="font-bold text-gray-800">.docx</span> format is allowed
                                </li>
                                <li>
                                    Content must use a <span className="font-bold text-gray-800">Unicode font</span>
                                </li>
                            </ul>
                            <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100 italic">
                                Note: Following these guidelines ensures smooth processing and error-free publication.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-3 rounded-xl font-bold text-gray-500 bg-gray-50 hover:bg-gray-100 transition border border-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onProceed}
                            className="flex-1 px-8 py-3 rounded-xl font-bold text-white bg-[#5A7C65] hover:bg-[#4a6555] transition shadow-lg shadow-[#5A7C65]/30"
                        >
                            Got it, Proceed
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManuscriptNoticeModal;
