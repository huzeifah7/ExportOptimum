// ManageAssurance.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";

Modal.setAppElement("#root");

const ManageAssurance = () => {
    const [paragraph, setParagraph] = useState(null);
    const [assurances, setAssurances] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [editedAssurance, setEditedAssurance] = useState({
        idAssurance: null,
        AssuranceName: "",
        AssuranceImage: null,
    });
    const [paragraphModalIsOpen, setParagraphModalIsOpen] = useState(false);
    const [editedParagraphDescription, setEditedParagraphDescription] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const paragraphResponse = await axios.get("http://localhost:5000/api/quality-assurance-paragraph");
            setParagraph(paragraphResponse.data[0]);
            setEditedParagraphDescription(paragraphResponse.data[0]?.description || "");

            const assurancesResponse = await axios.get("http://localhost:5000/api/assurances");
            setAssurances(assurancesResponse.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const openModal = (assurance = null) => {
        setEditedAssurance(assurance || { idAssurance: null, AssuranceName: "", AssuranceImage: null });
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleInputChange = (e) => {
        if (e.target.name === "AssuranceImage") {
            setEditedAssurance({ ...editedAssurance, AssuranceImage: e.target.files[0] });
        } else {
            setEditedAssurance({ ...editedAssurance, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("AssuranceName", editedAssurance.AssuranceName);
        formData.append("AssuranceImage", editedAssurance.AssuranceImage);

        for (const pair of formData.entries()) {
            console.log(pair[0] + ": " + pair[1]); // Debugging
        }

        try {
            if (editedAssurance.idAssurance) {
                await axios.put(`http://localhost:5000/api/assurances/${editedAssurance.idAssurance}`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
            } else {
                formData.append("IdParagraph", paragraph.IdParagraph);
                await axios.post("http://localhost:5000/api/assurances", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
            }
            fetchData();
            closeModal();
        } catch (error) {
            console.error("Error submitting:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/assurances/${id}`);
            fetchData();
        } catch (error) {
            console.error("Error deleting:", error);
        }
    };

    const openParagraphModal = () => {
        setParagraphModalIsOpen(true);
    };

    const closeParagraphModal = () => {
        setParagraphModalIsOpen(false);
    };

    const handleParagraphDescriptionChange = (e) => {
        setEditedParagraphDescription(e.target.value);
    };

    const handleParagraphSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/quality-assurance-paragraph/${paragraph.IdParagraph}`, {
                description: editedParagraphDescription,
            });
            fetchData();
            closeParagraphModal();
        } catch (error) {
            console.error("Error updating paragraph:", error);
        }
    };

    return (
        <div className="p-8 bg-gray-100">
            {paragraph && (
                <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
                    <h1 className="text-xl font-semibold text-blue-500 mb-3">Quality Assurance Paragraph</h1>
                    <p className="text-lg text-gray-800 mb-4">{paragraph.description}</p>
                    <button onClick={openParagraphModal} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">
                        Edit Paragraph
                    </button>
                </div>
            )}

            <div className="mb-6">
                <button onClick={() => openModal()} className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded">
                    Add Assurance
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {assurances.map((assurance) => (
                    <div key={assurance.idAssurance} className="border p-6 rounded-lg shadow-md bg-white">
                        <img src={`/AssuranceImages/${assurance.AssuranceImage}`} alt={assurance.AssuranceName} className="mb-4 rounded-md w-full h-32 object-contain" />
                        <p className="text-xl font-semibold text-gray-800 mb-3">{assurance.AssuranceName}</p>
                        <div className="flex justify-end">
                            <button onClick={() => openModal(assurance)} className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded mr-2">
                                Edit
                            </button>
                            <button onClick={() => handleDelete(assurance.idAssurance)} className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded">
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg w-11/12 md:w-1/2">
                <form onSubmit={handleSubmit}>
                    <input type="text" name="AssuranceName" placeholder="Assurance Name" value={editedAssurance.AssuranceName} onChange={handleInputChange} className="border p-3 mb-4 w-full rounded-md" />
                    <input type="file" name="AssuranceImage" onChange={handleInputChange} className="border p-3 mb-4 w-full rounded-md" />
                    <div className="flex justify-end">
                        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded mr-2">
                            {editedAssurance.idAssurance ? "Update" : "Create"}
                        </button>
                        <button type="button" onClick={closeModal} className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded">
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>

            <Modal isOpen={paragraphModalIsOpen} onRequestClose={closeParagraphModal} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg w-11/12 md:w-1/2">
                <form onSubmit={handleParagraphSubmit}>
                    <textarea value={editedParagraphDescription} onChange={handleParagraphDescriptionChange} className="border p-3 mb-4 w-full rounded-md" rows="5"></textarea>
                    <div className="flex justify-end">
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded mr-2">
                            Update Paragraph
                        </button>
                        <button type="button" onClick={closeParagraphModal} className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded">
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ManageAssurance;