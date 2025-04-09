import React, { useEffect, useState } from 'react';

const ManageAbout = () => {
  const [aboutData, setAboutData] = useState({
    "Who Are We?": {},
    vision: {},
    mission: {},
    images: [],
    whyChooseUs: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data when the component mounts
  useEffect(() => {
    fetch('http://localhost:5000/api/about')
      .then((response) => response.json())
      .then((data) => {
        setAboutData(data);
        setIsLoading(false);
      })
      .catch((error) => console.error('❌ Error fetching about data:', error));
  }, []);

  // Handle form input changes
  const handleChange = (section, field, value) => {
    setAboutData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: value,
      },
    }));
  };

  const handleWhyChooseChange = (index, field, value) => {
    const updatedWhyChoose = [...aboutData.whyChooseUs];
    updatedWhyChoose[index][field] = value;
    setAboutData((prevData) => ({
      ...prevData,
      whyChooseUs: updatedWhyChoose,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aboutData),
      });

      if (!response.ok) {
        throw new Error(`❌ Failed to update about data: ${response.status}`);
      }

      console.log('✅ About data updated successfully');
      alert('About data updated successfully');
    } catch (error) {
      console.error('❌ Error updating about data:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-12 w-full mx-auto bg-gray-100 rounded-lg shadow-md flex">

      <div className="flex-1">
        <h1 className="text-4xl font-bold mb-6 text-center">Manage About Information</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Who Are We Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Who Are We?</h2>
            <input
              type="text"
              value={aboutData["Who Are We?"].title}
              onChange={(e) => handleChange("Who Are We?", "title", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
              placeholder="Title"
            />
            <textarea
              value={aboutData["Who Are We?"].description}
              onChange={(e) => handleChange("Who Are We?", "description", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
              placeholder="Description"
            />
            <input
              type="text"
              value={aboutData["Who Are We?"].welcomeMessage}
              onChange={(e) => handleChange("Who Are We?", "welcomeMessage", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
              placeholder="Welcome Message"
            />
          </div>

          {/* Vision Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Vision</h2>
            <input
              type="text"
              value={aboutData.vision.title}
              onChange={(e) => handleChange("vision", "title", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
              placeholder="Vision Title"
            />
            <input
              type="text"
              value={aboutData.vision.tag}
              onChange={(e) => handleChange("vision", "tag", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
              placeholder="Vision Tag"
            />
            <textarea
              value={aboutData.vision.content}
              onChange={(e) => handleChange("vision", "content", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
              placeholder="Vision Content"
            />
          </div>

          {/* Mission Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Mission</h2>
            <input
              type="text"
              value={aboutData.mission.title}
              onChange={(e) => handleChange("mission", "title", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
              placeholder="Mission Title"
            />
            <input
              type="text"
              value={aboutData.mission.tag}
              onChange={(e) => handleChange("mission", "tag", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
              placeholder="Mission Tag"
            />
            <textarea
              value={aboutData.mission.content}
              onChange={(e) => handleChange("mission", "content", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
              placeholder="Mission Content"
            />
          </div>

          {/* Why Choose Us Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Why Choose Us?</h2>
            {aboutData.whyChooseUs.map((item, index) => (
              <div key={index} className="space-y-4">
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => handleWhyChooseChange(index, "title", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Why Choose Us Title"
                />
                <textarea
                  value={item.content}
                  onChange={(e) => handleWhyChooseChange(index, "content", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Why Choose Us Content"
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md bg-blue-600 text-white"
          >
            Update All
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManageAbout;
