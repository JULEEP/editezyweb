import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import {
    FaUpload, FaPhone, FaWhatsapp, FaEnvelope, FaMapMarkerAlt,
    FaRegFilePdf, FaShareAlt, FaTimes, FaClock, FaBuilding
} from "react-icons/fa";
import Navbar from "./Navbar";

export default function BusinessCardManager() {
    const [cards, setCards] = useState([]);
    const [form, setForm] = useState({
        name: "",
        phone: "",
        whatsapp: "",
        email: "",
        address: "",
        businessHours: "",
        logo: null,
        description: "",
    });
    const [viewCard, setViewCard] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);

    // Load saved cards from localStorage
    useEffect(() => {
        const savedCards = JSON.parse(localStorage.getItem("businessCards"));
        if (savedCards) {
            setCards(savedCards);
        }
    }, []);

    // Save cards to localStorage
    const saveCardsToLocalStorage = (newCards) => {
        localStorage.setItem("businessCards", JSON.stringify(newCards));
    };

    // Text fields change handler
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Image uploads handler
    const handleImageUpload = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setForm({ ...form, [field]: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    // Add new card
    const handleAdd = () => {
        if (!form.name) {
            alert("Please enter at least a business name.");
            return;
        }
        const newCard = { ...form, id: Date.now() };
        const updatedCards = [...cards, newCard];
        setCards(updatedCards);
        saveCardsToLocalStorage(updatedCards);
        setForm({
            name: "",
            phone: "",
            whatsapp: "",
            email: "",
            address: "",
            businessHours: "",
            logo: null,
            description: "",
        });
        setShowForm(false);
        setPreviewMode(false);
    };

    // Download PDF
    const handleDownload = (card) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;

        // Add blue header with business name
        doc.setFillColor(25, 118, 210);
        doc.rect(0, 0, pageWidth, 30, 'F');
        doc.setFontSize(20);
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.text(card.name, pageWidth / 2, 20, { align: "center" });

        // Add logo if exists
        if (card.logo) {
            doc.addImage(card.logo, "JPEG", pageWidth - 35, 35, 30, 30);
        }

        // About Us section
        doc.setFillColor(240, 245, 255);
        doc.rect(0, 70, pageWidth, 25, 'F');
        doc.setFontSize(16);
        doc.setTextColor(25, 118, 210);
        doc.setFont("helvetica", "bold");
        doc.text("About Us", 15, 85);

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "normal");
        if (card.description) {
            const splitDescription = doc.splitTextToSize(card.description, pageWidth - 30);
            doc.text(splitDescription, 15, 95);
        }

        // Contact Information section
        let yPosition = card.description ? 95 + (doc.splitTextToSize(card.description, pageWidth - 30).length * 5) : 105;
        if (yPosition < 105) yPosition = 105;

        doc.setFillColor(240, 245, 255);
        doc.rect(0, yPosition, pageWidth, 25, 'F');
        doc.setFontSize(16);
        doc.setTextColor(25, 118, 210);
        doc.setFont("helvetica", "bold");
        doc.text("Contact Information", 15, yPosition + 15);

        yPosition += 30;

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "normal");

        if (card.phone) {
            doc.text(`Phone: ${card.phone}`, 15, yPosition);
            yPosition += 8;
        }

        if (card.whatsapp) {
            doc.text(`WhatsApp: ${card.whatsapp}`, 15, yPosition);
            yPosition += 8;
        }

        if (card.email) {
            doc.text(`Email: ${card.email}`, 15, yPosition);
            yPosition += 8;
        }

        if (card.address) {
            const splitAddress = doc.splitTextToSize(`Address: ${card.address}`, pageWidth - 30);
            doc.text(splitAddress, 15, yPosition);
            yPosition += splitAddress.length * 5;
        }

        // Business Information section
        yPosition += 5;
        doc.setFillColor(240, 245, 255);
        doc.rect(0, yPosition, pageWidth, 25, 'F');
        doc.setFontSize(16);
        doc.setTextColor(25, 118, 210);
        doc.setFont("helvetica", "bold");
        doc.text("Business Information", 15, yPosition + 15);

        yPosition += 25;

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "normal");

        if (card.businessHours) {
            const splitHours = doc.splitTextToSize(`Business Hours: ${card.businessHours}`, pageWidth - 30);
            doc.text(splitHours, 15, yPosition + 5);
        }

        // Footer
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text("Generated by Business Card Manager", pageWidth / 2, doc.internal.pageSize.height - 10, { align: "center" });

        doc.save(`${card.name.replace(/\s+/g, '_')}_business_card.pdf`);
    };

    // Share card info
    const handleShare = async (card) => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${card.name} - Business Card`,
                    text: `Check out ${card.name}'s business card!\n\nAbout: ${card.description}\nPhone: ${card.phone}\nWhatsApp: ${card.whatsapp}\nEmail: ${card.email}\nAddress: ${card.address}\nBusiness Hours: ${card.businessHours}`,
                    url: window.location.href
                });
            } catch (error) {
                console.log('Sharing cancelled', error);
            }
        } else {
            alert("Sharing not supported in this browser. You can download the PDF instead.");
        }
    };

    // Close the view card modal
    const closeCardView = () => {
        setViewCard(null);
    };

    // Render the card preview
    const renderCardPreview = () => {
        if (!viewCard) return null;

        return (
            <div style={modalOverlayStyle} onClick={closeCardView}>
                <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
                    <div style={modalHeaderStyle}>
                        <h3 style={{ margin: 0 }}>{viewCard.name}</h3>
                        <button style={closeButtonStyle} onClick={closeCardView}>
                            <FaTimes />
                        </button>
                    </div>

                    <div style={cardPreviewStyle}>
                        {viewCard.logo && (
                            <div style={logoPreviewStyle}>
                                <img src={viewCard.logo} alt="Logo" style={{ maxWidth: '100px', maxHeight: '100px' }} />
                            </div>
                        )}

                        <div style={cardSectionStyle}>
                            <h4 style={sectionTitleStyle}>About Us</h4>
                            <p style={sectionContentStyle}>{viewCard.description || "No description provided"}</p>
                        </div>

                        <div style={cardSectionStyle}>
                            <h4 style={sectionTitleStyle}>Contact Information</h4>
                            {viewCard.phone && (
                                <div style={contactItemStyle}>
                                    <FaPhone style={iconStyle} />
                                    <span>{viewCard.phone}</span>
                                </div>
                            )}
                            {viewCard.whatsapp && (
                                <div style={contactItemStyle}>
                                    <FaWhatsapp style={{ ...iconStyle, color: '#25D366' }} />
                                    <span>{viewCard.whatsapp}</span>
                                </div>
                            )}
                            {viewCard.email && (
                                <div style={contactItemStyle}>
                                    <FaEnvelope style={iconStyle} />
                                    <span>{viewCard.email}</span>
                                </div>
                            )}
                            {viewCard.address && (
                                <div style={contactItemStyle}>
                                    <FaMapMarkerAlt style={iconStyle} />
                                    <span>{viewCard.address}</span>
                                </div>
                            )}
                        </div>

                        <div style={cardSectionStyle}>
                            <h4 style={sectionTitleStyle}>Business Information</h4>
                            {viewCard.businessHours && (
                                <div style={contactItemStyle}>
                                    <FaClock style={iconStyle} />
                                    <span>{viewCard.businessHours}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={actionButtonsStyle}>
                        <button
                            style={{ ...actionButtonStyle, backgroundColor: '#d32f2f' }}
                            onClick={() => handleDownload(viewCard)}
                        >
                            <FaRegFilePdf style={{ marginRight: 8 }} />
                            Download PDF
                        </button>
                        <button
                            style={{ ...actionButtonStyle, backgroundColor: '#1976d2' }}
                            onClick={() => handleShare(viewCard)}
                        >
                            <FaShareAlt style={{ marginRight: 8 }} />
                            Share
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <Navbar />
            <div className="mb-5" style={{ padding: 20, maxWidth: 800, margin: "auto", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
                {/* Header */}
                <h2 style={{ fontWeight: "bold", fontSize: 28, marginBottom: 20, textAlign: "center", color: "#1976d2" }}>
                    Business Card Manager
                </h2>

                {/* Cards list */}
                {cards.length > 0 ? (
                    <div style={cardsGridStyle}>
                        {cards.map((card) => (
                            <div
                                key={card.id}
                                style={cardItemStyle}
                                onClick={() => setViewCard(card)}
                            >
                                {card.logo && (
                                    <img
                                        src={card.logo}
                                        alt="Logo"
                                        style={cardLogoStyle}
                                    />
                                )}
                                <h3 style={cardTitleStyle}>{card.name}</h3>
                                {card.email && <p style={cardDetailStyle}>{card.email}</p>}
                                {card.phone && <p style={cardDetailStyle}>{card.phone}</p>}
                                <div style={cardHoverStyle}>Click to view details</div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={emptyStateStyle}>
                        <FaBuilding style={{ fontSize: 48, color: '#ccc', marginBottom: 16 }} />
                        <p style={{ color: '#666', textAlign: 'center' }}>No business cards yet. Add your first card to get started.</p>
                    </div>
                )}

                {/* Add New Button */}
                <div className="flex justify-center mt-8">
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                        {showForm ? "Close Form" : "Add Business Card"}
                    </button>
                </div>

                {/* Form for adding new business card */}
                {showForm && (
                    <div className="max-w-4xl mx-auto mt-6 bg-white p-6 rounded-xl shadow-lg space-y-6">
                        <h3 className="text-xl font-semibold text-gray-800 text-center">Add New Business Card</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left Column */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Company Name"
                                        value={form.name}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        name="description"
                                        placeholder="Brief description of your business"
                                        value={form.description}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[100px]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
                                    <div className="relative border border-gray-300 rounded-lg flex items-center justify-center p-3 cursor-pointer hover:bg-gray-50">
                                        <FaUpload className="mr-2 text-gray-500" />
                                        <span className="text-gray-700">Upload Logo</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, "logo")}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                    </div>
                                    {form.logo && (
                                        <img src={form.logo} alt="Logo preview" className="mt-2 w-32 h-32 object-contain rounded-lg border" />
                                    )}
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-4">
                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-gray-700">Contact Information</label>

                                    <div className="relative">
                                        <FaPhone className="absolute left-3 top-3 text-gray-400" />
                                        <input
                                            type="text"
                                            name="phone"
                                            placeholder="Phone Number"
                                            value={form.phone}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        />
                                    </div>

                                    <div className="relative">
                                        <FaWhatsapp className="absolute left-3 top-3 text-gray-400" />
                                        <input
                                            type="text"
                                            name="whatsapp"
                                            placeholder="WhatsApp Number"
                                            value={form.whatsapp}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        />
                                    </div>

                                    <div className="relative">
                                        <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Email Address"
                                            value={form.email}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        />
                                    </div>

                                    <div className="relative">
                                        <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
                                        <input
                                            type="text"
                                            name="address"
                                            placeholder="Business Address"
                                            value={form.address}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        />
                                    </div>
                                </div>

                                <div className="relative w-full">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Hours</label>
                                    <div className="relative">
                                        <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            name="businessHours"
                                            placeholder="e.g., Mon-Fri: 9AM-5PM"
                                            value={form.businessHours}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                                        />
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                onClick={() => {
                                    setShowForm(false);
                                    setPreviewMode(false);
                                }}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAdd}
                                disabled={!form.name}
                                className={`px-4 py-2 rounded-lg text-white transition ${form.name ? "bg-blue-500 hover:bg-blue-600" : "bg-blue-300 cursor-not-allowed"}`}
                            >
                                Save Card
                            </button>
                        </div>
                    </div>
                )}


                {/* Card Preview Modal */}
                {viewCard && renderCardPreview()}
            </div>
        </>
    );
}

// Styles
const cardsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
};

const cardItemStyle = {
    background: '#fff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    border: '1px solid #e0e0e0'
};

const cardLogoStyle = {
    width: '60px',
    height: '60px',
    borderRadius: '8px',
    objectFit: 'contain',
    marginBottom: '15px',
    border: '1px solid #f0f0f0'
};

const cardTitleStyle = {
    fontSize: '18px',
    fontWeight: '600',
    margin: '0 0 10px 0',
    color: '#1976d2'
};

const cardDetailStyle = {
    fontSize: '14px',
    color: '#666',
    margin: '5px 0'
};

const cardHoverStyle = {
    position: 'absolute',
    bottom: '0',
    left: '0',
    right: '0',
    background: 'rgba(25, 118, 210, 0.9)',
    color: 'white',
    padding: '8px',
    textAlign: 'center',
    fontSize: '12px',
    transform: 'translateY(100%)',
    transition: 'transform 0.3s ease',
};

// Add hover effect
cardItemStyle[':hover'] = {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
};

cardItemStyle[':hover'] = {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
};

cardItemStyle[':hover'] = cardHoverStyle ? {
    ...cardItemStyle[':hover'],
    [`& ${cardHoverStyle}`]: {
        transform: 'translateY(0)'
    }
} : cardItemStyle[':hover'];

const emptyStateStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    background: '#fafafa',
    borderRadius: '12px',
    border: '2px dashed #e0e0e0'
};

const addButtonStyle = {
    background: "#1976d2",
    color: "#fff",
    padding: "14px 28px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    boxShadow: "0 4px 8px rgba(25, 118, 210, 0.3)",
    transition: "all 0.3s ease"
};

addButtonStyle[':hover'] = {
    background: "#1565c0",
    boxShadow: "0 6px 12px rgba(25, 118, 210, 0.4)",
    transform: "translateY(-2px)"
};

const formContainerStyle = {
    background: "#fff",
    padding: "30px",
    marginTop: "30px",
    borderRadius: "12px",
    border: "1px solid #e0e0e0",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)"
};

const formTitleStyle = {
    fontSize: "22px",
    fontWeight: "600",
    margin: "0 0 25px 0",
    color: "#1976d2",
    paddingBottom: "15px",
    borderBottom: "1px solid #eee"
};

const formGridStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "30px",
    marginBottom: "25px"
};

const formColumnStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
};

const inputGroupStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
};

const labelStyle = {
    fontSize: "14px",
    fontWeight: "600",
    color: "#333"
};

const inputStyle = {
    padding: "12px 15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "15px",
    transition: "all 0.3s ease"
};

inputStyle[':focus'] = {
    borderColor: "#1976d2",
    boxShadow: "0 0 0 3px rgba(25, 118, 210, 0.2)",
    outline: "none"
};

const iconInputStyle = {
    position: "relative"
};

const inputIconStyle = {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#999",
    fontSize: "16px"
};

const fileUploadStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px 15px",
    borderRadius: "8px",
    border: "1px dashed #ddd",
    backgroundColor: "#fafafa",
    cursor: "pointer",
    transition: "all 0.3s ease",
    position: "relative"
};

const fileInputStyle = {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    opacity: "0",
    cursor: "pointer"
};

const imagePreviewStyle = {
    marginTop: "10px",
    maxWidth: "120px",
    maxHeight: "120px",
    borderRadius: "8px",
    border: "1px solid #eee"
};

const formActionsStyle = {
    display: "flex",
    justifyContent: "flex-end",
    gap: "15px",
    paddingTop: "20px",
    borderTop: "1px solid #eee"
};

const cancelButtonStyle = {
    background: "#f5f5f5",
    color: "#666",
    padding: "12px 24px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "500",
    transition: "all 0.3s ease"
};

const saveButtonStyle = {
    background: "#1976d2",
    color: "#fff",
    padding: "12px 24px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "500",
    transition: "all 0.3s ease",
    opacity: "1"
};

saveButtonStyle[':disabled'] = {
    background: "#ccc",
    cursor: "not-allowed",
    opacity: "0.7"
};

// Modal styles
const modalOverlayStyle = {
    position: "fixed",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    background: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: "1000",
    padding: "20px"
};

const modalContentStyle = {
    background: "#fff",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "600px",
    maxHeight: "90vh",
    overflow: "auto",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)"
};

const modalHeaderStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 25px",
    borderBottom: "1px solid #eee",
    background: "#fafafa",
    borderTopLeftRadius: "12px",
    borderTopRightRadius: "12px"
};

const closeButtonStyle = {
    background: "none",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
    color: "#999",
    padding: "5px",
    borderRadius: "50%",
    width: "34px",
    height: "34px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
};

closeButtonStyle[':hover'] = {
    background: "#eee",
    color: "#333"
};

const cardPreviewStyle = {
    padding: "25px"
};

const cardSectionStyle = {
    marginBottom: "25px"
};

const sectionTitleStyle = {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1976d2",
    margin: "0 0 15px 0",
    paddingBottom: "10px",
    borderBottom: "1px solid #eee"
};

const sectionContentStyle = {
    fontSize: "15px",
    lineHeight: "1.6",
    color: "#444",
    margin: "0"
};

const contactItemStyle = {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
    fontSize: "15px",
    color: "#555"
};

const iconStyle = {
    marginRight: "12px",
    color: "#1976d2",
    fontSize: "16px",
    minWidth: "20px"
};

const logoPreviewStyle = {
    display: "flex",
    justifyContent: "center",
    marginBottom: "25px"
};

const actionButtonsStyle = {
    display: "flex",
    gap: "15px",
    padding: "20px 25px",
    borderTop: "1px solid #eee",
    background: "#fafafa",
    borderBottomLeftRadius: "12px",
    borderBottomRightRadius: "12px"
};

const actionButtonStyle = {
    flex: "1",
    color: "#fff",
    padding: "12px 20px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease"
};